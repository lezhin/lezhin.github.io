---
title: 'Kotlin 맛보기'
author: lazysoul
date: 2017-06-01 11:10
tags: [kotlin,fp]
---

지난 5월 구글I/O를 통해서 안드로이드 공식 지원 언어가 된
[코틀린]의 인기가 수직 상승 중인데요, 진작에 [코틀린]은 검토하고 사용해 온 레진시 개발동 주민들이 보기엔 왠 뒷북인가 싶지만,
[코틀린]의 인기에 묻어가는 의미로(?) 몇달 전 사내에서 스터디했던 내용을 ~~재활용~~ 요약 정리했습니다.
<!--more-->

<div class="center">
<iframe src="//www.slideshare.net/slideshow/embed_code/key/vSkfxn9tP8EqSi" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/myeonginwoo/kotlinmd" title="Kotlin.md" target="_blank">Kotlin.md</a> </strong> from <strong><a target="_blank" href="//www.slideshare.net/myeonginwoo">Myeongin Woo</a></strong> </div>
</div>

## 코틀린 소개
 
[코틀린]은 [IntelliJ IDEA]로 유명한 [JetBrains]이 개발한 **현대적인 멀티플랫폼 애플리케이션을 위한 정적 타입 프로그래밍 언어(Statically typed programming language for modern multiplatform applications)** ~~뭐래는 거니~~ 입니다.

[코틀린]은 자바에게서 물려받은 **객체지향 프로그래밍**을 위한 구문과
스칼라와 비슷한 **함수형 프로그래밍**을 위한 구문을 동시에 지원하는 **멀티 패러다임 언어**입니다.
또한 ~~여기저기서 베낀~~ 코루틴, 타입 추론, Null Safety, DSL, ... 등의 특성을 갖춘  현대적인 프로그래밍 언어입니다.
특히 **JVM 기반 언어**[^jvm-lang]들 중에서도 단연 돋보이는 최고 수준의 **자바와의 양방향 호환성**을 지원합니다.

초기부터 안드로이드 지원에 공을 들였는데, 드디어 지난 5월 구글I/O를 통해서 **안드로이드 공식 지원 언어**[^android-kotlin]가 되었습니다.

올해 초 코틀린 1.1과 함께 [ECMAScript 5.1](https://www.ecma-international.org/ecma-262/5.1/) 트랜스파일러와 런타임을 포함한 Kotlin for Javascript[^kotlin-javascript]를 정식 출시했~~지만 아무도 관심이 없~~고, 
최근에는 [LLVM](http://llvm.org/) 툴체인을 사용하는 런타임과 네이티브 코드 생성기를 포함한 Kotlin/Native[^kotlin-native]의 Tech Preview도 공개했습니다.

2011년 7월에 처음 공개되었지만, 스칼라에 가려 존재감이 없다가 ~~그렇게 좋다고 떠들어도 들은 척도 안하더니~~ 최근에 주목받고 있습니다.

이 글에서는 문법을 설명하기 보다는 소스 코드를 통해 코틀린의 특징을 살펴보겠습니다:

## 함수형 프로그래밍

### Immutable

```kotlin
object Main {
  @JvmStatic
  fun main(args: Array<String>) {
    val a: String = "immutable" // value -- read-only
    var b: String = "mutable" // variable
    a = "test" // **Compile** Error
    b = "test" // OK
  }
}
```   
    
### Lambda, Higher-Order Function

```kotlin
object Main {
  @JvmStatic
  fun main(args: Array<String>) {
    lambdaFunc { println("hello") }
    lambdaFunc { customFunc("World") }
    println(higherOrderFunc(5, 10))
  }
  fun <T>lambdaFunc(body: ()->T): T {
    body()
  }
  fun customFunc(str: String) {
    println(str)
  }
  val higherOrderFunc: (Int, Int) -> Int = { x, y -> x + y }
}
```   

### Collection APIs

```kotlin
object Main {
  @JvmStatic
  fun main(args: Array<String>) {
    val list = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    println("map")
    list.map { it * 2 }
        .forEach { print("i: $it,") }
    println("filter, map")
    list.filter { it % 2 == 0 }
        .map { it * 2 }
        .forEach { print("i: $it,") }
    println("fold")
    println("fold: ${list.fold(0, { a, b -> a + b })}")
  }
}
```   

### Lazy Evaluation

```kotlin
object Main {
  val normalValue = {
    println("normal value")
    "hello"
  }
  val lazyValue by lazy = {
    println("lazy value")
    "value"
  }
  @JvmStatic
  fun main(args: Array<String>) {
    println("call main")
    println("call normal value")
    println(normalValue.invoke())
    println(normalValue.invoke())
    println("call lazy value")
    println(lazyValue)
    println(lazyValue)
  }
}
```   

## 장점(vs Java)

### Null safe

```kotlin
object Main {
  var nullable: String? = "str"
  var nullsafe: String = "str"
  @JvmStatic
  fun main(args: Array<String>) {
    nullable = null // OK
    nullsafe = null // "Compile" Error
    nullable.length // Error
    nullable?.length // OK
    nullsafe.length // OK
    var length: Int
    length = nullable?.length ?: 0 // OK Elvis Operator
    length = nullsafe.length // OK
  }
}
```   

### Data class

```kotlin
object Main {
  @JvmStatic
  fun main(args: Array<String>) {
    val user = User("lazysoul", "1111", "test@test.com")
    println("user1-1: $user")
    user.email = "change"
    println("user1-2: $user")
    user.apply {
        id = "test"
        password = "test"
        email = "test"
    }
    println("user1-3: $user")
    val user2 = User("id", "password")
    println("user2: $user2")
    val user3 = User(password = "password", id = "id")
    println("user3: $user3")
  }
}
data class User(
    var id: String = "defaultId",
    var password: String = "password",
    var email: String = "defaultEmail")
```   

### Singleton

```kotlin
object Main {
  @JvmStatic
  fun main(args: Array<String>) {
    val first = Singleton
    first.str = "hello"
    val second = Singleton
    println(second.str)
  }
}
object Singleton {
  init {
    println("this ($this) is a singleton")
  }
  var str: String? = null
}
```

### Extensions

```kotlin
object Main {
  @JvmStatic
  fun main(args: Array<String>) {
    println("hello".plusString(" world"))
    println(5.add10())
  }
}
fun String.plusString(str: String): String {
  return this + str
}
fun Int.add10(): Int {
  return this + 10
}
```
 
## 아쉬운 점(vs Scala)
 
### Pattern Matching

* scala

```scala
object Main {
  fun main(args: Array[String]): Unit = {
    val person = Person("lazysoul", 19)
    when(person) {
        Person("lazysoul",_) -> println("name is lazysoul")
    } // Cool!
  }
}
case class Person(name: String, age: Int)
```

* kotlin

```kotlin
object Main {
  @JvmStatic
  fun main(args: Array<String>) {
    val person = Person("lazysoul", 19)
    when (person) {
        Person("lazysoul",_) -> println("name is lazysoul")
    } // Error: 그런 거 없음요
    when {
        person.name == "lazysoul" -> println("name is lazysoul")
    }
  }
}
data class Person(val name: String, val age: Int)
```

### Either, Left and Right

- scala

```scala
import java.net.URL
import scala.io.Source
object Main {
  def main(args: Array[String]): Unit = {
    getContent(new URL("http://google.com")) match {
    case Left(msg) => println(msg) // error case
    case Right(source) => source.getLines.foreach(println) // do something
  }
  def getContent(url: URL): Either[String, Source] =
    if (url.getHost.contains("google"))
      Left("Requested URL is blocked for the good of the people!")
    else
      Right(Source.fromURL(url))
}
```

- kotlin

```kotlin
// Left/Right 흉내만 내는 거야 어렵지 않겠지만... Monad가 출동하면 어떨까?
```

## 요약

> 코틀린 좋아요. 코틀린 쓰세요! 두번 쓰세요!!

* Scala, Clojure, Haskell 등의 FP 언어들과 비교하면 아쉬운 부분이 많지만... 조금은 **만만한 FP**
* 맛깔나는 최신 문법 + 자바와의 양방향 호환성= **더 나은 자바**
* 다른 언어들의 장점을 많이/빨리 흡수 ~~버전업이 무서워~~
* [JetBrains]의 전폭적인 지원 - [IntelliJ IDEA]를 포함한 개발환경, 커뮤니티, 피드백...
* 코틀린 1.1부터 시험적으로 코루틴 지원[^kotlin-coroutine]
* Gradle 3.0에서 코틀린 정식 지원 예정[^kotlin-gradle3]
* 스프링 5.0에서 코틀린 정식 지원 예정[^kotlin-spring5]
* 안드로이드 공식 지원 언어 [^kotlin-android] [^android-kotlin]

## 한편, 레진시 개발동에서는...

<div class="center">
<iframe src="//www.slideshare.net/slideshow/embed_code/key/4UZyrPiEEkPeke" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/jyte/ss-76157630" title="레진코믹스가 코틀린으로 간 까닭은?" target="_blank">레진코믹스가 코틀린으로 간 까닭은?</a> </strong> from <strong><a target="_blank" href="https://www.slideshare.net/jyte">Taeho Kim</a></strong> </div>
</div>

* 안드로이드 앱 소스는 현재 ~~35 ~ 38%~~ ~45% 정도의 소스가 코틀린으로 작성되어 있습니다.
* 자바 백엔드의 일부 코드(지금은 유틸리티 기능 위주로)에서 코틀린을 병행해서 사용하고 있습니다.
* 적용 범위를 점진적으로 확대하고 있습니다.

[코틀린]:https://kotlinlang.org/
[IntelliJ IDEA]:https://www.jetbrains.com/idea/
[JetBrains]:https://www.jetbrains.com/
[^jvm-lang]:https://en.wikipedia.org/wiki/List_of_JVM_languages
[^kotlin-javascript]:https://kotlinlang.org/docs/reference/js-overview.html
[^kotlin-native]:https://blog.jetbrains.com/kotlin/2017/04/kotlinnative-tech-preview-kotlin-without-a-vm/
[^kotlin-android]:https://blog.jetbrains.com/kotlin/2017/05/kotlin-on-android-now-official/
[^android-kotlin]:https://android-developers.googleblog.com/2017/05/android-announces-support-for-kotlin.html
[^kotlin-coroutine]:https://blog.jetbrains.com/kotlin/2016/07/first-glimpse-of-kotlin-1-1-coroutines-type-aliases-and-more/
[^kotlin-gradle3]:https://blog.gradle.org/kotlin-meets-gradle
[^kotlin-spring5]:https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0
