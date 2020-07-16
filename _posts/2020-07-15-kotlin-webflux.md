---
title: 'Kotlin과 Spring WebFlux 기반의 컨텐츠 인증 서비스 개발 후기'
author: digimon
tags: [backend,kotlin,spring,webflux,r2dbc,redis]
date: 2020-07-15 00:00:00
---
제가 일하고 있는 서비스 개발팀은 레진코믹스의 백엔드 서비스를 책임지고 있는 팀입니다. 저희는 작년부터 <mark>Kotlin</mark>과 <mark>Spring WebFlux</mark>를 메인 스택으로 선정하여 개발하고 있습니다. 이 글에선 WebFlux 기반의 컨텐츠 인증 서비스를 개발하면서 경험한 이슈들을 공유하려 합니다. 

이 글은 WebFlux 또는 리액티브 프로그래밍에 대한 기초 지식을 다루진 않으므로 다소 불친절하게 느껴질 수 있는 점 양해 바랍니다. WebFlux에 대한 기초적인 내용은 제 블로그의 [Spring WebFlux와 Kotlin으로 만드는 Todo 서비스 - 1편](https://devsh.tistory.com/entry/Spring-WebFlux-with-Kotlin)을 참고하시기 바랍니다.

**이 글에서 소개 예제는 저희가 서비스하고 있는 코드를 <mark>공개용으로 변경</mark>했기 때문에 정상 동작을 보장하지 않습니다. 참고 부탁드립니다** 

## 이 글에서 다루고 있는 내용
* [R2DBC](#r2dbcreactive-relational-database-connectivity)
* [Reactive Redis를 사용한 캐시 적용](#reactive-redis를-사용한-캐시-적용)
* [RestTemplate 대신 WebClient](#resttemplate-대신-webclient)
* [@Scheduled 대신 Flux.interval](#scheduled-대신-fluxinterval)
* [쿠버네티스 환경 모니터링 시스템 구축](#쿠버네티스-환경-모니터링-시스템-구축)

## 컨텐츠 인증 서비스
컨텐츠 인증 서비스는 유저가 레진코믹스 컨텐츠의 구매 여부를 판별하는 서비스입니다. 기본적으로 이미지 서버와 통신하며 유료 작품이라면 유저가 해당 작품을 구매했는지 판별하거나 무료 작품이라면 회원인지 비회원인지 판별하여 컨텐츠 접근 여부를 응답하는 단순하지만 없어선 안되는 서비스입니다.  

### 컨텐츠 인증 서비스 기술 스택
* Kotlin 1.3.x
* Spring Boot 2.3.x
* Spring WebFlux 
* Spring Data R2DBC 1.1.x
* Spring Data Redis Reactive
* Spring Boot Actuator

### 시스템 구성도
이해를 돕기 위해 작성한 간략한 시스템 구성도입니다. 

![](/files/2020-07-13-kotlin-webflux/diagram.png)

## R2DBC(Reactive Relational Database Connectivity)
컨텐츠 인증 서버에 앞서 전에도 WebFlux 기반의 서비스를 출시했었지만 <mark>JPA</mark>를 사용해 데이터베이스를 엑세스하고 있었습니다. JPA는 내부적으로 JDBC를 사용하기 때문에 DB I/O가 <mark>블로킹</mark>으로 동작합니다. 기본적으로 리액티브 스택은 블로킹 되는 구간이 있다면 전통적인 MVC 방식에 비해 얻는 이점이 거의 없기 때문에 
[리액터 공식 문서](https://projectreactor.io/docs/core/release/reference/#faq.wrap-blocking)에서 설명하는 것처럼 아래와 같은 패턴을 사용해 해결하고 있었습니다. 
```javascript
Mono blockingWrapper = Mono.fromCallable(() -> { 
    return /* make a remote synchronous call */ 
});
blockingWrapper = blockingWrapper.subscribeOn(Schedulers.boundedElastic());
```
하지만 원칙적으로 리액티브 스택은 <mark>비동기-논블로킹</mark> 형태로 개발하는 것이 자연스럽고 최적의 성능을 보여줍니다. 그리고 때마침 리액티브 기반의 비동기-논블로킹을 지원하는 [R2DBC](https://r2dbc.io/)의 GA 버전이 릴리즈 되면서 새로운 서비스에 적용하게 되었습니다.

### Spring Data R2DBC 적용
R2DBC를 스프링 환경에서 쉽게 사용하는 방법은 [Spring Data R2DBC](https://docs.spring.io/spring-data/r2dbc/docs/1.0.x/reference/html/#reference)를 사용하는 것입니다.  [Spring Data R2DBC 공식 깃헙](https://github.com/spring-projects/spring-data-r2dbc)을 보면  
<mark>This is Not an ORM</mark>이라는 문구가 가장 먼저 눈에 띕니다. 이것은 JPA가 ORM 프레임 워크임을 어필하는 것과 대조적인 부분입니다. 
Spring Data R2DBC는 단순함을 지향하여 일반적인 ORM 프레임 워크가 지원하는 caching, lazy loading, write behind 등을 지원하지 않습니다.
 
#### ReactiveCrudRepository를 상속하는 리파지토리 인터페이스
Spring Data JPA나 Spring Data JDBC을 이미 사용하고 있어, Spring Data R2DBC를 적용할때 큰 어려움이 없었습니다.
Spring Data 프로젝트는 리액티브 패러다임을 지원하는 <mark>ReactiveCrudRepository</mark>를 제공하므로
ReactiveCrudRepository 인터페이스를 상속하는 인터페이스를 만들어 주면 쉽게 Spring Data R2DBC를 사용할 수 있습니다.
```javascript
interface ContentRepository : ReactiveCrudRepository<Content, Long> {
    fun findFirstByUserIdAnContentIdOrderByIdDesc(userId: Long, contentId:Long) : Mono<Content>
}
``` 
### 멀티 데이터 소스 구현
실무에서 서비스를 개발하다 보면 하나의 서버에서 여러 데이터 소스에 대한 접근이 필요할 수 있습니다. Spring Data R2DBC는 이런 경우에 사용할 수 있도록 <mark>AbstractRoutingConnectionFactory</mark>라는 추상 클래스를 지원합니다.
#### MultiTenantRoutingConnectionFactory
<mark>MultiTenantRoutingConnectionFactory</mark>는  AbstractRoutingConnectionFactory를 상속받아서 <mark>determineCurrentLookupKey</mark> 함수를 오버라이드 하였습니다.
```javascript
class MultiTenantRoutingConnectionFactory : AbstractRoutingConnectionFactory() {

    override fun determineCurrentLookupKey(): Mono<Any> {
        return TransactionSynchronizationManager.forCurrentTransaction().map {
            if (it.isActualTransactionActive) {
                if (it.currentTransactionName?.contains(SecondaryDataSourceProperties.BASE_PACKAGE)!!) {
                    SecondaryDataSourceProperties.KEY
                } else {
                    PrimaryDataSourceProperties.KEY
                }
            } else {
                PrimaryDataSourceProperties.KEY
            }
        }
    }
}
```
determineCurrentLookupKey에선 현재 트랜잭션의 이름을 읽어서 <mark>@Transactional</mark>을 선언한 서비스의 패키지 기준으로 분기 처리하였습니다. determineCurrentLookupKey의 상세 구현은 개발자가 다양한 방법을 사용할 수 있으므로 이것과 같은 방법을 사용하지 않아도 됩니다.
예를 들면 <mark>@Transactional(readOnly=true)</mark>인 경우엔 리플리케이션으로 라우팅하는 경우도 있을 수 있습니다. 이런 경우엔 현재 트랜잭션이 readOnly인지 판단하는 로직을 내부에 구현해주면 됩니다.

#### application.yml
application.yml에는 두개의 데이터 소스 설정을 추가하였습니다.
```yaml
datasource:
  primary:
    url:
    username: 
    password: 
  secondary:
    url:
    username:
    password:
```

#### DatasourceProperties
각 데이터 소스의 설정 정보는 DatasourceProperties라는 이름으로 추가하였습니다. <mark>@ConfigurationProperties</mark>는 application.yml에 지정한 설정 정보의 prefix를 기준으로 동일한 이름의 프로퍼티가 존재하면 자동으로 값을 세팅해 줍니다. 
<mark>@ConstructorBinding</mark>은 setter가 아닌 생성자를 사용해 값을 바인딩 해주는 애노테이션입니다.  코틀린의 <mark>Data class</mark>와 조합하면 설정 클래스를 <mark>Immutable</mark>하게 사용할 수 있습니다.
```javascript
@ConstructorBinding
@ConfigurationProperties(prefix = "datasource.primary")
data class PrimaryDataSourceProperties(val username: String, val password: String, val url: String) {

    companion object {
        const val KEY = "primary"
        const val BASE_PACKAGE = "com.lezhin.backend.service.primary"
        const val TRANSACTION_MANAGER = "primaryTransactionManager"
    }
}

@ConstructorBinding
@ConfigurationProperties(prefix = "datasource.secondary")
data class SecondaryDataSourceProperties(val username: String, val password: String, val url: String) {

    companion object {
        const val KEY = "secondary"
        const val BASE_PACKAGE = "com.lezhin.backend.service.secondary"
        const val TRANSACTION_MANAGER = "secondaryTransactionManager"
    }
}
```

#### R2dbcConfig
그 다음 R2dbc 설정 클래스를 만들어서 <mark>connectionFactory</mark>빈을 생성해 주면 됩니다.
```javascript
@Configuration
@EnableR2dbcRepositories
class R2dbcConfig(val primaryDataSourceProperties: PrimaryDataSourceProperties,
                  val secondaryDataSourceProperties: SecondaryDataSourceProperties) : AbstractR2dbcConfiguration() {
    @Bean
    override fun connectionFactory(): ConnectionFactory {
        val multiTenantRoutingConnectionFactory = MultiTenantRoutingConnectionFactory()

        val factories = HashMap<String, ConnectionFactory>()
        factories[PrimaryDataSourceProperties.KEY] = primaryConnectionFactory()
        factories[SecondaryDataSourceProperties.KEY] = secondaryConnectionFactory()

        multiTenantRoutingConnectionFactory.setDefaultTargetConnectionFactory(primaryConnectionFactory())
        multiTenantRoutingConnectionFactory.setTargetConnectionFactories(factories)
        return multiTenantRoutingConnectionFactory
    }

    @Bean
    fun primaryConnectionFactory() =
        parseAndGet(Triple(primaryDataSourceProperties.url, primaryDataSourceProperties.username, primaryDataSourceProperties.password))

    @Bean
    fun secondaryConnectionFactory() =
        parseAndGet(Triple(secondaryDataSourceProperties.url, secondaryDataSourceProperties.username, secondaryDataSourceProperties.password))

    private fun parseAndGet(propertiesAsTriple: Triple<String, String, String>): ConnectionFactory {
        val (url,username,password) = propertiesAsTriple

        val properties = URLParser.parseOrDie(url)
        return JasyncConnectionFactory(MySQLConnectionFactory(
            com.github.jasync.sql.db.Configuration(
                username = username,
                password = password,
                host = properties.host,
                port = properties.port,
                database = properties.database,
                charset = properties.charset,
                ssl = properties.ssl
            )))
    }

    @Bean
    fun primaryTransactionManager(@Qualifier("primaryConnectionFactory") connectionFactory: ConnectionFactory?) =
        R2dbcTransactionManager(connectionFactory!!)

    @Bean
    fun secondaryTransactionManager(@Qualifier("secondaryConnectionFactory") connectionFactory: ConnectionFactory?) =
        R2dbcTransactionManager(connectionFactory!!)
}
```

## Reactive Redis를 사용한 캐시 적용
저희는 인프라에 따라서 Redis와 Memcached를 모두 사용하고 있습니다. 이번 컨텐츠 인증 서비스에선 Redis를 사용해 DB에서 읽어온 데이터를 캐시하였습니다.
 WebFlux를 적용하면서 <mark>@Cacheable</mark> 사용이 불가하여 별도로 Reactor 호환 캐시 유틸을 만들어서 사용했었습니다만 이번에는 <mark>Spring Data Redis Reactive</mark>를 직접 사용하는 방법으로 구현하게 되었습니다.

#### RedisConfig
Redis 클라이언트로 사용될 Lettuce 설정과 ReactiveRedisTemplate에 대한 설정 입니다.
```javascript
@Configuration
class RedisConfig(@Value("\${spring.redis.host}") val host: String,
                   @Value("\${spring.redis.port}") val port: Int,
                   @Value("\${spring.redis.database}") val database: Int) {

    @Primary
    @Bean("primaryRedisConnectionFactory")
    fun connectionFactory(): ReactiveRedisConnectionFactory? {
        val connectionFactory = LettuceConnectionFactory(host, port)
        connectionFactory.database = database
        return connectionFactory
    }

    @Bean
    fun contentReactiveRedisTemplate(factory: ReactiveRedisConnectionFactory?): ReactiveRedisTemplate<String, Content>? {
        val keySerializer = StringRedisSerializer()
        val redisSerializer = Jackson2JsonRedisSerializer(Content::class.java)
            .apply {
                setObjectMapper(
                    jacksonObjectMapper()
                        .registerModule(JavaTimeModule())
                )
            }
        val serializationContext = RedisSerializationContext
            .newSerializationContext<String, Content>()
            .key(keySerializer)
            .hashKey(keySerializer)
            .value(redisSerializer)
            .hashValue(redisSerializer)
            .build()
        return ReactiveRedisTemplate(factory!!, serializationContext)
    }
}
```

#### ContentService
구현은 일반적인 캐시처리 방식으로 <mark>cache hit</mark> 여부를 판단하여 fallback 처리 하는 구조입니다.

```javascript
@Service
class ContentService(val contentRepository: ContentRepository,
                      val contentRedisOps: ReactiveRedisOperations<String, Content>) {

    companion object {
        const val DAYS_TO_LIVE = 1L
    }

    @Transactional("primaryTransactionManager")
    fun findById(id: Long): Mono<Content> {
        val key = "content:${id}"
        return contentRedisOps.opsForValue().get(key).switchIfEmpty {
            contentRepository.findById(id).doOnSuccess {
                    contentRedisOps.opsForValue()
                        .set(key, it, Duration.ofDays(DAYS_TO_LIVE))
                        .subscribe()
            }.onErrorResume {
                Mono.empty()
            }
        }
    }
}
```   

1. Redis에 캐시된 데이터가 있는지 확인하여 존재하지 않으면 <mark>switchIfEmpty</mark> 내부 코드 동작
   - 이때 사용하는 switchIfEmpty는 Mono.defer로 감싸진 Reactor 코틀린 확장 함수이므로 Mono.defer를 직접 사용하지 않아도 됩니다.
   - `fun <T> Mono<T>.switchIfEmpty(s: () -> Mono<T>): Mono<T> = this.switchIfEmpty(Mono.defer { s() })`
2. switchIfEmpty 내부 코드에는 우선 DB에서 조회하여 데이터가 존재하면 <mark>doOnSuccess</mark>에서 내부 코드 동작
3. 데이터가 존재하면 Redis에 캐시

위와 같은 방식으로 캐시 레이어를 리액티브하게 구현할 수 있었습니다.  
## RestTemplate 대신 WebClient
외부 서비스와 HTTP로 통신해야 하는 경우 가장 흔한 방법은 <mark>RestTemplate</mark>을 사용하는 것입니다. RestTemplate은 Spring 애플리케이션에서 가장 일반적인 웹 클라이언트지만 블로킹 API이므로 리액티브 기반의 애플리케이션에서 ***성능을 떨어트리는 원인***이 될 수 있습니다. 
이런 이유로 Spring5에서 추가된 <mark>WebClient</mark>를 사용해 리액티브 기반의 비동기-논블로킹 통신을 구현하였습니다.

### UserTokenRepositoryImpl
UserTokenRepositoryImpl은 유저의 토큰을 가지고 `WebClient`를 사용해 유저 서비스를 호출해 받아온 결과를 유저 객체 매핑합니다. 이러한 동작은 모두 리액티브 하게 비동기-논블로킹 형태로 동작합니다. 
```javascript
@Repository
class UserTokenRepositoryImpl(val webClientBuilder: WebClient.Builder) : UserTokenRepository {

    private lateinit var webClient: WebClient

    @PostConstruct
    fun setWebClient() {
        webClient = webClientBuilder.build()
    }

    override fun fetchUser(uri: String, accessToken: String) =
        webClient.get()
            .uri(uri)
            .header("Authorization", "Bearer $accessToken")
            .retrieve()
            .onStatus(HttpStatus::isError) {
                Mono.error(ForbiddenException("Connection Failed"))
            }
            .bodyToMono(User::class.java)
}
```
## @Scheduled 대신 Flux.interval
WebFlux로 서비스를 만들다 보면 기존에는 당연하게 사용하던 기능이 지원되지 않는 경우가 많습니다. <mark>@Scheduled</mark>도 그중 하나입니다. 
만약 일정 간격으로 처리할 작업이 있는 경우 @Scheduled의 대안으로 <mark>Flux.interval</mark>을 사용할 수 있습니다. 

### Flux.interval 예시
아래 예제는 90초 간격으로 로그를 출력하도록 만든 예제입니다.
```javascript
    @PostConstruct
    fun doProcess() = Flux.interval(Duration.ofSeconds(90))
            .map {
                // 구현
                logger.info("hello world")
            }
            .subscribe()
```
## 쿠버네티스 환경 모니터링 시스템 구축
저희 레진은 새로 개발하는 서비스는 모두 쿠버네티스 환경에서 운영 중 이고 [prometheus](https://prometheus.io/)를 쿠버네티스 환경에서 기본 모니터링 툴로 사용하고 있습니다. 
prometheus는 ***풀*** 방식 으로 데이터를 수집합니다. Spring Boot2 부터 메트릭 표준이 된 [micrometer](https://micrometer.io/docs/concepts)를 사용해 prometheus를 지원하는 메트릭을 추가하였습니다.

### build.gradle.kts
우선 메트릭 생성에 필요한 의존성을 build.gradle.kts에 추가하였습니다.
```javascript
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation(group = "io.micrometer", name = "micrometer-registry-prometheus", version = "1.5.1")
}
```

### application.yml
그다음 아래와 같은 형태로 메트릭 엔드포인트를 추가해줍니다. 기본적으로 Spring Boot Actuator는 include에 포함된 엔드포인트만 엑세스가 가능합니다. 
```javascript
management:
  endpoints:
    web:
      exposure:
        include: metrics, prometheus
```
더 많은 엔드포인트에 대한 정보는 [엔드포인트 공식 문서](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html#production-ready-endpoints)에서 확인할 수 있습니다.

### prometheus 엔드포인트
웹 브라우저에서 `/actuator/prometheus`로 접속해보면 이미지와 같이 prometheus 형식의 메트릭 정보가 출력되는 것을 확인 할 수 있습니다.
![](/files/2020-07-13-kotlin-webflux/metric.png)

### Grafana 대쉬보드
최종적으로 엔드포인트에서 출력된 정보를 prometheus에서 10초 간격으로 데이터를 풀링해가고 <mark>Grafana</mark> 대쉬보드에서 시각화된 정보를 관측할 수 있게되었습니다.

![](/files/2020-07-13-kotlin-webflux/grafana1.png)
![](/files/2020-07-13-kotlin-webflux/grafana2.png)

## 회고
이번 컨텐츠 인증 서버 개발은 리액티브 프로그래밍과 WebFlux에 대해 좀 더 익숙해지는 기회가 되었습니다. 또 Spring Data R2DBC의 GA 버전이 릴리즈되면서 모든 구간에서 리액티브 스택을 적용할 수 있었습니다.
이외에도 WebFlux와 R2DBC에 대해 공유하고 싶은 주제들이 더 있지만 한편의 블로그로 작성하기엔 너무 길어지는 내용이 될 것 같아서 생략하였습니다.
기회가 된다면 얕은 지식이지만 저의 [개인 블로그](https://devsh.tistory.com/)나 [팝잇](https://www.popit.kr/author/tony_sanghoon)에서 공유를 이어가도록 하겠습니다.   

마지막으로 저희 서비스 개발팀은 실력 있는 팀원들과 함께 도전하며 성장할 분들을 모시고 있습니다. 많은 지원 부탁드리며 긴 글 읽어주셔서 감사합니다.


- [백엔드 개발자 지원하기](https://lezhin.recruiter.co.kr/app/applicant/registResume)
- [원티드로 지원하기](https://www.wanted.co.kr/wd/25346) 






