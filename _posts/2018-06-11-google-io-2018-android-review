---
title: '구글 I/O 2018 안드로이드 파트 리뷰'
author: gyooha
tags: [google-io-2018, android]
date: 2018-06-11 00:00:00
---

[구글 I/O 2018]에 발표된 안드로이드 기술 관련 내용을 리뷰(Review)합니다. 이번 구글 I/O에서는 약 62개의 크고 작은 세션(Session)들이 준비되었고, 개발자들에게 공개되었습니다. 다양한 세션(Session) 중 이번 글에서는 안드로이드 개발과 관련된 안드로이드의 새로운 기능, 안드로이드 제트팩(Android JetPack), 안드로이드 P(Android P)와 그 밖의 안드로이드 앱(App)에 관해 정리하고자 합니다.


## 새롭게 기능이 더해진 안드로이드

안드로이드에 앱 사이즈(Size)를 효과적으로 줄일 수 있는 앱 번들과 동적 전달(App Bundle & Dynamic Delivery), 안드로이드 개발을 도와주는 라이브러리(Library), 도구등을 제공하는 안드로이드 제트팩(Android JetPack), 안드로이드 스튜디오(Android Studio)가 소개되었고, 그 밖의 새로운 기능들이 추가되어 더 자유롭고 재미있는 개발이 가능해졌습니다.

### [[앱 번들과 동적 전달(App Bundle & Dynamic Delivery)](https://developer.android.com/guide/app-bundle/)]

<img src="https://1.bp.blogspot.com/-lwdb_wiD6vM/WvHRpCJz0TI/AAAAAAAAFWY/kO_wnXli8PUFmEe7ELWpwOu5m-A7TGLPACLcBGAs/s1600/App-Bundle-Animation_GIF.gif" height="300" />

구글은 안드로이드 앱(App)의 크기를 동적으로 줄일 수 있는 앱 번들(App Bundle)과 동적 전달(Dynamic Delivery)을 발표하였습니다. 안드로이드 앱(App)이 모든 기기에서 작동하려면 많은 리소스(Resource)가 필요하게 됩니다. 새로운 번들(Bundle) 시스템(System)을 사용하게 되면, 번들(Bundle)이 모든 리소스(Resource)를 가지고 있는건 기존과 동일한 모습이지만, 앱(App)이 다운로드될 때 플레이스토어(Play Store)가 앱(App) 구동에 필요한 리소스(Resource)만 전달하게 됩니다.

- 이 기술을 먼저 적용한 링크드인은 23%, 트위치는 35%, 조모는 50% 가량 앱의 크기가 줄었다고 합니다.

### [[안드로이드 제트팩(Android JetPack)](https://developer.android.com/jetpack/docs/)]

<img src="https://1.bp.blogspot.com/-dwL58chu7wo/WvD1RrHln3I/AAAAAAAAFUg/cRTc0IZga_wMPTWr3CI53IZ5BwtnZMeYACLcBGAs/s1600/Screen%2BShot%2B2018-05-05%2Bat%2B11.49.30%2BAMimage1.png" height="300" />

안드로이드 제트팩(Android JetPack)은 안드로이드 개발을 도와주는 라이브러리(Library), 도구 들이 포함되어있는 라이브러리(Library) 모음 입니다. 기존의 서포트 라이브러리(Support Library), 안드로이드 아키텍쳐 컴포넌트(Android Architecture Component)와 이번에 추가된 새로운 라이브러리(Library)를 병합하여 크게 4가지 구성요소로 나누게 되었습니다. 기존 안드로이드 버전(Version)들과 호환될 뿐만 아니라 불필요한 코드들(Boiler plate)을 제거하였고, 패키지 이름(Package name)을 AndroidX로 변경하였습니다. 패키지 이름(Package name)이 변경됨에 따라 패키지 패스(Package path) 같은 문제가 발생을 방지 하기 위해 안드로이드 스튜디오 3.2에서 리팩터(Refactor)기능을 지원한다고 합니다.

### [[안드로이드 스튜디오(Android Studio)](https://developer.android.com/studio/preview/)]

위에서 소개드린 앱 번들(App Bundle)과 동적 전달(Dynamic Delivery), 안드로이드 제트팩(Android JetPack)에서 필요한 메뉴들(App Bundle Menu, JetPack Refactor Menu)이 안드로이드 스튜디오에 추가되었습니다. 이 것과는 별개로 기존 에뮬레이터(Emulator)에 스냅샷(Snapshot) 기술을 적용하여 속도를 개선하였고, 에너지 프로파일링(Energy Profiling) 기술을 적용하여 앱(App)의 배터리 소모를 추적할 수 있게 되었습니다.

## 안드로이드 제트팩

<img src="https://developer.android.com/static/images/jetpack/jetpack-hero.svg" height="300" />

안드로이드 제트팩에 새롭게 추가된 라이브러리(Library)에 대해 알아보려 합니다. 

### [[워크매니저(WorkManager)](https://developer.android.com/topic/libraries/architecture/workmanager)]

안드로이드는 UI 작업을 제외한 작업은 백그라운드(Background) 작업으로 분류되어야 합니다. 워크매니저(WorkManager)는 그 백그라운드(Background) 작업을 조금 더 쉽게 하기위해 개발자에게 도움을 주는 라이브러리(Library) 입니다. 워크매니저(WorkManager)는 약 3가지의 백그라운드(Background) 작업을 지원합니다. 

* 연결 작업
* 병렬 작업
* 반복 작업

#### 연결 작업

<img src="https://cdn-images-1.medium.com/max/1600/1*Z-WI-fSc-FkW1pG0d5II4g.png" height="75" width="300" />

```kt
WorkManager.getInstance()
      .beginWith(workA)
      .then(workB)
      .enqueue();
```
#### 병렬 작업

 <img src="https://cdn-images-1.medium.com/max/1600/1*oS0-Fb5RfPLSNCb9V-FqCQ.png" height="150" />

```kt
WorkManager.getInstance()
      .beginWith(workA1, workA2, workA3)
      .then(workB)
      .then(workC1, workC2)
      .enqueue();
```
#### 반복 작업

```kt
val request = PeriodicWorkRequest
      .Builder(RepeatWork::class.java, 6, TimeUnit.HOURS)
      .build()
```

UUID나 TAG를 사용하여 작업 취소가 편리하며, 안드로이드 SDK 버전 14 이상부터 호환되므로 거의 모든 안드로이드 기기에서 사용하실 수 있습니다. 그 밖의 여러가지의 작업을 순차적으로 실행하는 연결 작업, 동시에 여러가지의 작업을 실행하는 병렬 작업, 일정 시간마다 반복해서 실행해야 하는 반복 작업등이 가능하게 되었습니다. 추가로 같은 안드로이드 아키텍쳐 컴포넌트(Android Architecture Component)인 라이브데이터(LiveData)와 함께 사용하실 수 있습니다.

구글 코드랩(CodeLab)예제를 이용해 만든 프로젝트(Project)를 깃허브(Github)에 정리하였습니다. [이곳](https://github.com/gyooha/WorkManagerExample.git) 을 참고해주세요.

### [[네비게이션(Navigation)](https://developer.android.com/topic/libraries/architecture/navigation/)]

<img src="/files/2018-06-11-google-io/1.png" height="300" alt>

네비게이션 아키텍쳐 컴포넌트(Navigation Architecture Component)는 액티비티(Activity) 및 프래그먼트(Fragment) 전환, 스택(Stack), 값 전달(Passing Argument), 딥링크(Deep Links), 테스트(Test)와 그 밖의 여러가지 등을 더욱 편하게 관리할 수 있도록 도와주는 라이브러리(Library) 입니다.

네비게이션 XML파일(File)을 이용하여 화면의 동작을 정의하여 메타데이터(MetaData)를 작성할 수 있으며, 작성된 메타데이터(MetaData)를 이용하여 바텀네비게이션뷰(BottomNavigationView), 네비게이션 드로워(Navigation Drawer)의 각 메뉴(Menu)에 화면을 바인드(Bind) 할 수 있고, 그 뿐만 아니라 코드(Code)상에서 프래그먼트(Fragment)의  영원한 서포터인 서포트프래그먼트매니저(SupportFragmentManager), 차일드프래그먼트매니저(ChildFragmentManager)가 하는 역할을 네비게이션 아키텍쳐 컴포넌트(Navigation Architecture Component)에 위임할 수 있습니다.

#### 네비게이션 정의

```xml
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    app:startDestination="@id/mainFragment">

    <fragment
        android:id="@+id/mainFragment"
        android:name="com.seroo.gyooha.navigationexample.ui.main.MainFragment"
        android:label="fragment_main"
        tools:layout="@layout/fragment_main" >
        <deepLink app:uri="test://main" />
        <argument
            android:name="test"
            android:defaultValue="0"
            app:type="integer" />
    </fragment>
</navigation>
```

#### 액티비티(Activity) 정의

```xml
<fragment
      android:id="@+id/fm_activity_main"
      android:name="androidx.navigation.fragment.NavHostFragment"
      android:layout_width="match_parent"
      android:layout_height="match_parent"
      app:defaultNavHost="true"
      app:navGraph="@navigation/nav_graph"
```

```kt
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        tb_activity_main.title = getString(R.string.app_name)

        setUpBottomNavigation((supportFragmentManager
            .findFragmentById(R.id.fm_activity_main) as NavHostFragment).navController)
    }

    private fun setUpBottomNavigation(navController: NavController) {
        NavigationUI.setupWithNavController(bn_activity_main, navController)
    }
}
```

#### 프래그먼트(Fragment) 이동

```kt
 // 이곳의 프래그먼트 Id는 네비게이션 XML에서 행동을 정의한 프래그먼트의 Id 입니다.
 button.setOnClickListener { Navigation.findNavController(it).navigate(R.id.mainFragment, null) }
```

* 엔드포인트(EndPoint)로 프래그먼트(Fragment)에서 액티비티(Activity)로 지정할 수 있습니다.
* 네비게이션(Navigation)내의 액티비티(Activity)간의 이동은 허용되지 않습니다. (아래 그림과 같은 상황입니다.)
<img src="/files/2018-06-11-google-io/error1.png" height="300" alt>

더 자세한 코드는 깃허브(Github)에 정리하였습니다. [이곳](https://github.com/gyooha/NavigationExample.git) 을 참고해주세요.

### [[슬라이스(Slices)](https://developer.android.com/guide/slices/)]

<img src="http://img.youtube.com/vi/a7IVH5aNwwc/0.jpg" height="300" />

슬라이스(Slices)는 외부에 컨텐트를 공유하거나, 공유받아 사용할 수 있는 라이브러리(Library) 입니다. 슬라이스 컨텐트(Slices Content)가 정의되어 있는 다른 앱(App)의 컨텐트(Content)를 슬라이스 프로바이더(Slices Provider)를 통해 가져올 수 있으며, 화면에 출력된 컨텐트(Content)는 정의된것에 한해서 자유롭게 사용할 수 있습니다. 

#### 슬라이스 URI 분류

```kt
override fun onBindSlice(sliceUri: Uri?): Slice {
        return when (sliceUri?.path) {
            "/temperature" -> createTemperatureSlice(sliceUri)
            else -> throw IllegalStateException("is Not exist")
        }
    }
```

#### 슬라이스 펜딩인텐트(PendingIntent) 제작

```kt
  private fun getChangeTempIntent(value: Int): PendingIntent =
        Intent(ACTION_CHANGE_TEMP).apply {
            setClass(context, MyBroadcastReceiver::class.java)
            putExtra(EXTRA_TEMP_VALUE, value)
        }.let {
            PendingIntent.getBroadcast(context, reqCode++, it, PendingIntent.FLAG_UPDATE_CURRENT)
        }
```
#### 슬라이스 UI 

```kt
  private fun createTemperatureSlice(uri: Uri): Slice {
        val tempUp = SliceAction(getChangeTempIntent(sTemperature + 1),
            IconCompat.createWithResource(context, R.drawable.ic_temp_up).toIcon(),
            "Increase temperature")
        val tempDown = SliceAction(getChangeTempIntent(sTemperature - 1),
            IconCompat.createWithResource(context, R.drawable.ic_temp_down).toIcon(),
            "Decrease temperature")

        val listBuilder = ListBuilder(context, uri, 0)

        val temperatureRow = ListBuilder.RowBuilder(listBuilder)

        temperatureRow.setTitle(getTemperatureString(context))

        temperatureRow.addEndItem(tempDown)
        temperatureRow.addEndItem(tempUp)

        val intent = Intent(context, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(context, uri.hashCode(),
            intent, 0)
        val openTempActivity = SliceAction(pendingIntent,
            IconCompat.createWithResource(context, R.drawable.ic_home).toIcon(),
            "Temperature controls")
        temperatureRow.setPrimaryAction(openTempActivity)

        listBuilder.addRow(temperatureRow)

        return listBuilder.build()
    }
```

<img src="/files/2018-06-11-google-io/6.png" height="300" alt><img src="/files/2018-06-11-google-io/7.png" height="300" alt>

* 왼쪽과 같은 이미지의 앱(App)을 오른쪽 화면에 떠있는 URI를 이용하여 원격으로 접근이 가능해지고, 미리 정의해놓은 컨텐트(Content)까지 이용이 가능합니다.

### [[KTX(Kotlin Extention)](https://developer.android.com/kotlin/ktx)]

<img src="http://img.youtube.com/vi/st1XVfkDWqk/0.jpg" height="300" />

KTX는 코틀린 익스텐션(Kotlin Extention)을 이용하여 안드로이드에 앱(App)을 개발하는데 불필요한 코드를 줄여 프로젝트(Project)의 이해를 높이기 위한 라이브러리(Library) 입니다.

##### 쉐어드 프리퍼런스(SharedPreferences)

```kt
sharedPreferences.edit()
           .putBoolean(key, value)
           .apply()
```

```kt
sharedPreferences.edit { 
    putBoolean(key, value) 
}
```

##### 프리드로우리스너(PreDrawListener)

```kt
view.viewTreeObserver.addOnPreDrawListener(
    object : ViewTreeObserver.OnPreDrawListener {
        override fun onPreDraw(): Boolean {
            viewTreeObserver.removeOnPreDrawListener(this)
            actionToBeTriggered()
            return true
        }
    }
)
```

```kt
view.doOnPreDraw {
     actionToBeTriggered()
}
```

##### 데이터베이스 트랜잭션(DataBase Transaction)

```kt
db.beginTransaction()
try {
    // insert data
    db.setTransactionSuccessful()
} finally {
    db.endTransaction()
}
```

```kt
db.transaction {
    // insert data
}
```

위와 같이 많은 코드(Code)가 줄어든것을 보실 수 있습니다. 항상 많은 코드(Code)를 적어야 했던 것들이 줄어들었으니 가독성은 물론, 편한 개발이 가능해졌습니다.

## 안드로이드 P

<img src="https://1.bp.blogspot.com/-h5VkDfYHQLY/WvHgLtM2tKI/AAAAAAAAFW8/dCttkCxx-Icg6ZpgE36MNfT_YvIHnj8JgCLcBGAs/s1600/icon-simple-for-light-bgimage1.png" height="300" alt>

안드로이드 P 버전의 가장 큰 변화는 안드로이드 코어(Core)부분에 추가된 AI 입니다. AI가 사용자의 모바일(Mobile) 사용경험을 분석하여 사용자의 편의성을 증대시킴과 동시에 새로운 기능들을 지원하게 되었고, 보안에 관련된 기능들이 추가되었습니다. 그 중 크게 변화한것이라고 생각되는 것들만 골라 조금 정리해보았습니다.

### 어답티브 배터리(Adaptive Battery)

<img src="/files/2018-06-11-google-io/4.gif" height="300" alt>

어답티브 배터리(Adaptive Battery)는 기계학습과 사용자의 모바일(Mobile) 사용경험을 병합하여 자주 사용하는 앱(App) 부터 자주 사용하지 않는 앱(App)에 순서대로 우선순위를 매깁니다. 이 우선순위에 따라 Active, Working Set, Frequent, Rare 라고 하는 버킷(Buckets)에 담기며 Active 버킷(Buckets)에 담기지 않은 앱(App)은 Jobs, Alarms, Network, FCM 등에 제약이 걸리게 됩니다.

### 앱 액션(App Action)

<img src="https://1.bp.blogspot.com/-M1NHQ9hwhOM/WvHg025z1MI/AAAAAAAAFXI/Wts_GkYTUqoXuvhLWOAj3fj-H1NQ--ewwCLcBGAs/s1600/App-Actions-2image3.gif" height="300" alt>

앱 액션(App Action)은 어답티브 배터리(Adaptive Bettery)와 비슷하게 사용자의 모바일(Mobile) 사용경험과 기계학습을 기반으로 사용자에게 앱(App)을 추천해주는 새로운 시스템입니다. 예를들어 이어폰이 꽂혀있는경우 사용자에게 음악 앱(App)을 추천해줄 수 있습니다. 앱 액션(App Action)은 가장 최근의 사용자 경험을 기반으로 하며, 별도의 액션(Action)을 개발자가 정의할 수 있고, 구글 어시스턴스(Google Assistant)를 이용하듯 진행되는 대화식 작업에 사용되는 공통 인텐트(Common Intent)를 기본으로 사용하고 있습니다.

### 새로운 네비게이션 시스템

<img src="/files/2018-06-11-google-io/5.gif" height="300" alt>

안드로이드 P에서 새로운 네비게이션 시스템(Navigation System)을 소개하였습니다. 모든 화면을 버튼 하나로 이동할 수 있으며, 실행중인 작업을 한눈에 볼 수 있습니다. 또한 스위핑(Sweeping)을 이용하여 작업을 이동할 수 있고, 원하는 앱을 빠르게 재개할 수 있습니다.

### 지문인식

<img src="/files/2018-06-11-google-io/2.png" height="300" alt> <img src="/files/2018-06-11-google-io/3.png" height="300" alt>

사용자와 앱(App)사이의 신뢰도를 높이기 위해 위와같이 새로운 지문인식 다이얼로그(Dialog)를 지원하게 되었습니다.

### 컷아웃(Cut out)

<img src="/files/2018-06-11-google-io/8.png" height="300" alt>

안드로이드 진영에 악명높은 탈모 디자인이 덮쳤습니다. 탈모 디자인(Design)에 대비하여 안드로이드 P부터 위의 사진과 같이 지원하게 되었습니다.

### 방해금지모드(Do Not Disturb Mode)

<img src="/files/2018-06-11-google-io/10.png" height="300" alt>

안드로이드 P 부터 모바일(Mobile) 화면을 책상에 마주보듯이 덮어높으면 알림이 울리지 않는 방해금지모드가 추가되었습니다.

### 사용자 대시보드와 앱 타이머(User DashBoard & App Timer)

<img src="/files/2018-06-11-google-io/9.gif" height="300" alt>

사용자의 모바일(Mobile) 사용기록을 확인할 수 있는 대시보드(DashBoard)가 안드로이드 P 부터 추가되었으며, 모바일(Mobile) 중독을 방지하기위해 화면이 켜지고 일정시간뒤에 사용자의 모바일(Mobile) 사용 욕구를 저하하기 위한 앱 타이머(App Timer) 기능이 추가되었습니다.

### 마치며

Google I/O 2017 보다 많고 다양한것들이 안드로이드(Android)에 추가되거나 변화되었습니다. 특히 안드로이드 제트팩을 포함 그 안에서 새로운 기능들이 많이 추가되었고, 그 밖의 안드로이드 P 버전의 기능들이나, 안드로이드 스튜디오에도 많은 기능들이 추가되었습니다. 이제 개발자들은 입맛에 맞는것들만 골라 즐겁게 개발할일만 남았습니다.

### 참조
* https://android.jlelse.eu/exploring-jetpack-scheduling-tasks-with-work-manager-fba20d7c69bf
* https://android.jlelse.eu/exploring-jetpack-the-power-of-chains-in-the-workmanager-apis-30509ca4b2c
* https://www.youtube.com/playlist?list=PLWz5rJ2EKKc9Gq6FEnSXClhYkWAStbwlC
* https://medium.com/exploring-android/exploring-android-p-fingerprint-dialog-fa672ae62c6f
* https://vivekc.xyz/whats-new-in-android-p-the-breaking-changes-and-amazing-features-8f4e864802a9
* https://medium.com/@elye.project/android-p-whats-new-summary-fa8af407f6f3
* https://hackernoon.com/google-i-o-2018-all-you-need-to-know-about-the-key-announcements-8adc9e10f774
* https://medium.com/the-gadget-flow/google-i-o-2018-keynote-had-a-lot-of-ai-and-immersive-tech-in-store-5d5186a30e39
