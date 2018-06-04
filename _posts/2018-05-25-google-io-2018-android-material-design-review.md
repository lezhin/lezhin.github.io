---
title: '구글 I/O 2018 안드로이드 머터리얼 디자인 리뷰'
author: eunsil.jo
tags: [google-io-2018,material-design,android]
date: 2018-05-25 00:00:00
---

[구글 I/O 2018]에서 발표한 안드로이드 머터리얼 디자인(Android Material Design) 관련 내용을 리뷰합니다. 이번 구글 I/O에서는 총 48개의 디자인 관련 앱 리뷰(App Review), 오피스 아워(Office Hour) 세션 등을 준비했고, 그 중 [14개의 세션을 유투브에] 업데이트했습니다. 다양한 디자인 세션 중 이번 글에서는 안드로이드 앱 개발 관련 새로운 머터리얼 디자인 도구(Material Design Tool)들과 주요 컴포넌트(Components)들에 대해 정리하고자 합니다.
<!--more-->

## 새로운 머터리얼 디자인 도구들
{% include youtube.html v="Ty6VjgVHiko" %}

구글은 인기 디자인 툴킷(Toolkit)인 스케치(Sketch)와 연동할 수 있는 머터리얼 플러그인(Material Plugin, macOS High Sierra 10.13 이상 지원)을 새롭게 공개했습니다. 머터리얼 플러그인을 추가하면 머터리얼 테마를 커스터마이징하여 디자인에 쉽게 적용하고 공유할 수 있습니다.

### [머터리얼 테마 에디터(Material theme Editor)]
머터리얼 테마 에디터는 기본(Baseline) 테마와 함께 여행(Crane), 소셜(Fortnightly), 쇼핑(Shrine) 머터리얼 테마를 제공하고 선택한 테마의 색상(Colors), 타이포그래피(Typography), 모양(Shape), 아이콘(Icons)의 커스터마이징을 쉽게 할 수 있도록 도와줍니다. 구글에서 제공하는 머터리얼 색상 팔레트, 모서리 스타일, 서체, 아이콘들을 머터리얼 컴포넌트에 바로 적용할 수 있을뿐만 아니라 나만의 테마를 만들 수도 있습니다.

--- | ---
![](/files/2018-05-25-google-io-2018-android-material-design-review/1.png){: width="414" height="300"} | ![](/files/2018-05-25-google-io-2018-android-material-design-review/2.png){: width="416" height="300"}
![](/files/2018-05-25-google-io-2018-android-material-design-review/3.png){: width="292" height="300"} | ![](/files/2018-05-25-google-io-2018-android-material-design-review/4.png){: width="289" height="300"}

<sup>시계방향으로 색상, 타이포그래피, 아이콘, 모양</sup>

* __색상__ : Primary, Accent, Text 색상을 레진코믹스 안드로이드 앱과 같이 변경 가능합니다.
* __타이포그래피__ : Roboto 서체와 더불어 Body2에 Arial Hebrew, Caption에 Hannotate SC 서체를 적용하고 확인할 수 있습니다.
* __모양__ : 좌측 상단 모서리에 커브를 적용하고 Cards 컴포넌트에 적용된 것을 확인할 수 있습니다.
* __아이콘__ : Filled 테마의 머터리얼 아이콘을 다운로드하여 사용 가능합니다.

![](/files/2018-05-25-google-io-2018-android-material-design-review/16.png){: width="591" height="400"}

나만의 머터리얼 테마 컴포넌트로 빠르게 디자인 작업이 가능합니다.

### [갤러리(Gallery)]
갤러리는 디자이너와 개발자 간 협업할 수 있는 [제플린(Zeplin)]과 같은 도구입니다. 스케치에서 'Upload to Gallery' 버튼만 누르면 작업한 디자인을 동료에게 바로 공유하고 피드백 받을 수 있습니다.

--- | ---
![](/files/2018-05-25-google-io-2018-android-material-design-review/5.png){: width="335" height="300"} | ![](/files/2018-05-25-google-io-2018-android-material-design-review/6.png){: width="531" height="300"}
![](/files/2018-05-25-google-io-2018-android-material-design-review/7.png){: width="385" height="300"} | ![](/files/2018-05-25-google-io-2018-android-material-design-review/8.png){: width="514" height="300"}

<sup>시계방향으로 공유, 이력관리, UI 가이드, 피드백 화면</sup>

보다 상세한 UI 가이드를 공유하고, 작업 이력을 관리할 수 있으며, 디자인 항목에 직접 의견을 작성할 수 있다는 점이 인상적입니다. 현재 사용하고 있는 협업 도구와 장단점을 비교하면서 사용해보면 좋겠습니다.

### [머터리얼 아이콘(Material Icons)]
기존에 제공하던 900개 이상의 머터리얼 아이콘들을 Filled, Outlined, Rounded, Two-Tone, Sharp 5가지 테마로 업데이트했습니다. 안드로이드 해상도별 다양한 크기의 아이콘을 제공하고 있어 아이콘이 필요할 때 유용하게 사용할 수 있습니다.

![](/files/2018-05-25-google-io-2018-android-material-design-review/9.png) ![](/files/2018-05-25-google-io-2018-android-material-design-review/10.png) ![](/files/2018-05-25-google-io-2018-android-material-design-review/11.png) ![](/files/2018-05-25-google-io-2018-android-material-design-review/12.png) ![](/files/2018-05-25-google-io-2018-android-material-design-review/13.png)

<sup>왼쪽부터 Filled, Outlined, Rounded, Two-Tone, Sharp 테마의 delete_forever 아이콘</sup>

## 색상, 타이포그래피, 모양
{% include youtube.html v="3VUMl_l-_fI" %}

세션에서 자주 언급하는 단어는 색상(Color), 타이포그래피(Typography), 모양(Shape) 입니다. 디자이너가 레진코믹스 안드로이드 앱에 어울리는 머터리얼 색상, 타이포그래피, 모양 테마를 안내해주면 개발자가 쉽게 컴포넌트(Components)에 적용할 수 있도록 지원합니다.

### [색상 테마(Color theme)]
일부 컴포넌트에 커스터마이징 색상 테마를 적용할 수 있도록 업데이트했습니다.
* Android 지원<sup>1)</sup> - Bottom Navigation, Buttons, Cards, Chips, FAB, Tabs, Top App Bar, Text Fields

```xml
<style name="Widget.MyApp.MyButton" parent="Widget.MaterialComponents.Button">
  <item name="backgroundTint">?attr/colorPrimary</item>
</style>
```

```xml
<style name="Theme.MyApp" parent="Theme.MaterialComponents.Light">
  ...
  <item name="materialButtonStyle">@style/Widget.MyApp.MyButton</item>
  ...
</style>
```

AppCompat 테마에 기존 제공하던 colorPrimary, colorPrimaryDark, colorAccent 속성과 더불어 colorPrimaryLight, colorSecondary, colorSecondaryDark, colorSecondaryLight 등의 MaterialComponents 속성을 추가할 수 있도록 지원합니다.

--- | ---
![](https://material.io/design/assets/1tMjPWuw0mKBm0FgoF41tWq42m2Q9kJXO/theming-color-primarysecondary.png){: width="407" height="300"} | ![](https://material.io/design/assets/1AAAsWiyKIb-C6OMypeviPSzMSoBwD7m7/theming-color-surfacesbgs.png){: width="407" height="300"}

추가로 Variant 색상, Background, Error, Surface 그리고 'On' 색상을 설정할 수 있도록 업데이트 예정입니다.

### [타이포그래피 테마(Typography theme)]
일부 컴포넌트에 커스터마이징 타이포그래피 테마를 적용할 수 있도록 업데이트했습니다.
 * Android 지원<sup>1)</sup> - Bottom Navigation, Buttons, Chips, FAB, Tabs, Top App Bar, Text Fields

```xml
<style name="TextAppearance.MyApp.Headline1" parent="TextAppearance.MaterialComponents.Headline1">
  ...
  <item name="fontFamily">@font/custom_font</item>
  <item name="android:textStyle">normal</item>
  <item name="textAllCaps">false</item>
  <item name="android:textSize">64sp</item>
  <item name="android:letterSpacing">0</item>
  ...
</style>
```

```xml
<style name="Theme.MyApp" parent="Theme.MaterialComponents.Light">
  ...
  <item name="textAppearanceHeadline1">@style/TextAppearance.MyApp.Headline1</item>
  ...
</style>
```

textAppearanceHeadline1, textAppearanceBody1 등 MaterialComponents 테마 속성에 서체 이름, 크기, 글자 간격 등을 설정할 수 있습니다.

![](/files/2018-05-25-google-io-2018-android-material-design-review/14.png){: width="550" height="400"}

### [모양(Shape)]
Buttons, Cards 컴포넌트의 모양 변경을 할 수 있도록 업데이트 예정입니다.<sup>1)</sup>
* 기본 모양은 직사각형에 4dp 라운드 모서리를 가집니다.
* 둥근 모서리 또는 잘린 모서리 등의 모양 변경을 지원합니다.

```xml
<style name="Theme.MyApp" parent="Theme.MaterialComponents.Light">
  ...
  <item name="cornerRadiusPrimary">8dp</item>
  <item name="cornerStylePrimary">cut</item>
  <item name="cornerRadiusSecondary">4dp</item>
  <item name="cornerStyleSecondary">cut</item>
  ...
</style>
```

```xml
<style name="Widget.MyApp.MyCard" parent="Widget.MaterialComponents.MaterialCardView">
  <item name="cardCornerRadius">?attr/cornerRadiusSecondary</item>
</style>
```

```xml
<style name="Theme.MyApp" parent="Theme.MaterialComponents.Light">
  ...
  <item name="materialCardViewStyle">@style/Widget.MyApp.MyCard</item>
  ...
</style>
```

MaterialComponents 테마의 cornerRadius, cornerStyle 속성을 설정하여 Cards 컴포넌트의 스타일 및 모양을 변경할 수 있습니다.

--- | --- | ---
![](https://material.io/design/assets/0B6xUSjjSulxcN21PWXZ6VHZtMFk/shapingmaterial-hero-1.png){: width="407" height="300"} | ![](/files/2018-05-25-google-io-2018-android-material-design-review/15.png){: width="170" height="300"} | ![](https://material.io/design/assets/1KJfYanLvAfjHcqfPuyKgkaLoZVx2l1D2/color-hierarchybrand-hierarchy-colorshape-owl.png){: width="169" height="300"}

## 컴포넌트
{% include youtube.html v="D7LB-QPxH9c" %}

구글은 [머터리얼 디자인 컴포넌트 라이브러리(MDC-Android)]를 오픈소스로 공개했습니다. 아직 알파(Alpha) 버전으로 적극적으로 사용하기에 걱정스럽기는 합니다만, 2018년 7월에 안드로이드 베타(Beta) 버전을 제공하고 2018년 11월까지 지속적인 릴리즈를 진행한다는 [로드맵]을 제공하고 있습니다. 버튼과 같이 기본적인 컴포넌트부터 하나씩 적용해보면 좋겠습니다.

새롭게 공개된 컴포넌트는 Bottom App Bar, Backdrop, Extended FAB 입니다.

### [Bottom App Bar]
Bottom App Bar는 기존 Top App Bar의 액션(Action)을 화면 하단에서 할 수 있으며, FAB(Floating Action Button)과 함께 사용할 수 있도록 디자인했습니다.

* 모바일 장비에서만 사용하도록
* Bottom Navigation Bar와 함께 사용하지 않도록
* 최소 두 개에서 최대 다섯 개의 액션 버튼이 존재하도록 안내하고 있습니다.

```xml
<android.support.design.widget.CoordinatorLayout
    ...>
  <!-- Other components and views -->
  <com.google.android.material.bottomappbar.BottomAppBar
      android:id="@+id/bar"
      ...
      android:layout_gravity="bottom"
      app:navigationIcon="@drawable/ic_menu_24"/>

  <com.google.android.material.floatingactionbutton.FloatingActionButton
      android:id="@+id/fab"
      ...
      app:layout_anchor="@id/bar"/>
</android.support.design.widget.CoordinatorLayout>
```

```xml
style="@style/Widget.MaterialComponents.BottomAppBar"
```

fabAlignmentMode, fabCradleMargin 등 BottomAppBar의 속성에 FAB의 위치, 간격 등을 설정할 수 있습니다.

--- | --- | ---
![](https://www.material.io/design/assets/1jE77atbSz5gSZOwmVjo3dNUs0bLAJhES/usage-when-do.png){: width="300" height="300"} | ![](https://material.io/design/assets/1uMIJeZicJJACwoQquyJO4o0ovLV2yrqx/placement-top-app-bar-do.png){: width="169" height="300"} | ![](https://material.io/design/assets/1G9__hcY_1UtcSpmjlsLCY7ABDEo6owB4/color-hierarchybrand-hierarchy-limitingcolor-posivibes.png){: width="169" height="300"}

### [Backdrop]
Backdrop은 백 레이어(Back layer)에서 프런트 레이어(Front layer)에 관련된 정보를 표시하거나, 제어(필터)할 수 있습니다. Android 지원 예정<sup>1)</sup>

--- | --- | ---
![](/files/2018-05-25-google-io-2018-android-material-design-review/18.png){: width="299" height="300"} | ![](https://www.material.io/design/assets/1ri2zTYAhsUgD0b5v7_CuUNwPCM1gLrL5/usage-05.png){: width="169" height="300"} | ![](https://material.io/design/assets/1ZQ9JTBxsUSJqr3zvnuxpmHSvNeD70Jtz/color-hierarchybrand-hierarchy-surfacecontrast-crane.png){: width="169" height="300"}

### [Extended FAB]
기존 아이콘만 표시하는 FAB(Floating Action Button)의 너비를 키우고 텍스트를 표시할 수 있도록 확장했습니다. Android 지원 예정<sup>1)

* 아이콘(옵션)과 한줄의 텍스트를 가집니다.
* 모바일에서 하단 중앙 혹은 우측에 위치합니다.

--- | ---
![](https://www.material.io/design/assets/1P8peBxVujhfPIPwolj6hPeiSiAZUiKnw/extended-fab-01.png){: width="600" height="300"} | ![](https://www.material.io/design/assets/1AfbKI0cPem2iAZLkUInkJJLz4FRAPWOE/extfab-noicon.png){: width="300" height="300"}

### 샘플
컴포넌트들의 모양과 동작을 직접 확인할 수 있게 MDC-Android는 여러 샘플 앱을 제공합니다.

* __[Material Components(catalog)]__ : Bottom App Bar 외 최신 컴포넌트들을 확인할 수 있습니다.
* __[Shrine(demo)]__ : Top App Bar 스크롤, Bottom Navigation, Cards 등 컴포넌트들을 확인 할 수 있습니다.
* __[Shrine(codelabs)]__ : Backdrop, Outlined Text Fileds, Shape 적용 등을 확인할 수 있습니다.

--- | --- | ---
![](/files/2018-05-25-google-io-2018-android-material-design-review/19.jpg){: width="146" height="300"} ![](/files/2018-05-25-google-io-2018-android-material-design-review/20.jpg){: width="146" height="300"} | ![](/files/2018-05-25-google-io-2018-android-material-design-review/21.jpg){: width="146" height="300"} | ![](/files/2018-05-25-google-io-2018-android-material-design-review/22.jpg){: width="146" height="300"} ![](/files/2018-05-25-google-io-2018-android-material-design-review/23.jpg){: width="146" height="300"}

<sup>왼쪽부터 Material Components, Shrine(demo), Shrine(codelabs)</sup>

## 플러터
{% include youtube.html v="hA0hrpR-o8U" %}

[플러터(Flutter)]는 새롭게 등장한 구글의 모바일 UI 프레임워크입니다. 기존에 안드로이드 UI 구현을 위해 layout, style 등 다수의 관련 XML 파일을 작성했다면, 플러터를 이용해서는 다트(Dart) 언어 코드로 위젯 트리(Widget tree)작성이 가능하며, 뷰의 상태나 이벤트에 따른 UI 변경을 동적으로 쉽게 할 수 있습니다.

* __빠른 개발 가능__ : 몇 초만에 UI 빌드가 가능하여 UI, 버그 수정을 빠르게 할 수 있습니다.
* __아름다운 UI 구현 가능__ : 안드로이드 머터리얼 디자인, iOS 스타일의 쿠퍼티노(Cupertino) 위젯, 다양한 모션 API 등을 제공합니다.
* __리액티브 한 프레임워크__ : 애니메이션, 제스쳐, 효과 등의 UI 구현을 위젯 기반으로 쉽게 가능합니다.
* __네이티브 기능 연동 가능__ : 안드로이드, iOS 플랫폼 네이티브 API, 서드파티(3rd party) SDK 기능들과 연동 가능합니다.


### [머터리얼 스타일 앱(Material-styled app)]

```dart
class SampleApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'Sample App',
      theme: new ThemeData(
        primarySwatch: Colors.blue,
        textSelectionColor: Colors.red
      ),
      home: new SampleAppPage(),
    );
  }
}
```

기존 AndroidManifest.xml 파일의 application에 앱 테마를 설정하는 것 대신, 플러터 MaterialApp 위젯을 생성하여 앞서 디자인한 나만의 머터리얼 테마를 앱에 적용할 수 있습니다.

--- | ---
![](/files/2018-05-25-google-io-2018-android-material-design-review/24.png){: width="480" height="300"} | ![](/files/2018-05-25-google-io-2018-android-material-design-review/25.png){: width="480" height="300"}

## 마무리
구글 머터리얼 디자인은 이제 안드로이드 플랫폼만의 디자인이 아닙니다. 이번 구글 I/O에서는 안드로이드뿐 아니라 iOS, 웹(Web) 샘플 프로젝트 시연이 중점적으로 진행되었고, 컴포넌트 라이브러리도 각 플랫폼별로 제공하고 있습니다. 또한 다양한 플랫폼에서 공통으로 UI 개발이 가능한 플러터 프레임워크도 오픈소스로 제공합니다. 하지만 애플(Apple)에서도 iOS 디자인 가이드를 제공하고 있고, 플랫폼별 디자인에 대해서는 다양한 관점 및 의견이 있어 통합하기에는 시간이 더 필요할 것 같습니다.

이제 레진코믹스 앱을 잘 표현해줄 수 있는, 레진코믹스만의 머터리얼 테마를 디자인하고 개발할 시간입니다. _이츠 디벨롭 타임므~!_

## 참조
* Getting started with Material Theme Editor: [https://youtu.be/BLrgDgd_1c0](https://youtu.be/BLrgDgd_1c0)
* Getting started with Gallery: [https://youtu.be/TIB3q68ZHYw](https://youtu.be/TIB3q68ZHYw)
* [https://design.google/library/making-more-with-material/](https://design.google/library/making-more-with-material/)
* [https://www.material.io/develop/android/](https://www.material.io/develop/android/)
* [https://flutter.io/flutter-for-android/](https://flutter.io/flutter-for-android/)

[구글 I/O 2018]:https://events.google.com/io/
[14개의 세션을 유투브에]:https://www.youtube.com/playlist?list=PLOU2XLYxmsIKzJveaJfgBm6ifuV4N2PPM
[머터리얼 테마 에디터(Material theme Editor)]:https://material.io/tools/theme-editor/
[갤러리(Gallery)]:https://material.io/tools/gallery/
[제플린(Zeplin)]:https://zeplin.io/
[머터리얼 아이콘(Material Icons)]:https://material.io/tools/icons/
[색상 테마(Color theme)]:https://material.io/develop/android/theming/color/
[타이포그래피 테마(Typography theme)]:https://material.io/develop/android/theming/typography/
[모양(Shape)]:https://material.io/develop/android/theming/shape/
[머터리얼 디자인 컴포넌트 라이브러리(MDC-Android)]:https://github.com/material-components/material-components-android
[로드맵]:https://github.com/material-components/material-components/blob/develop/ROADMAP.md
[Bottom App Bar]:https://www.material.io/design/components/app-bars-bottom.html#usage
[Backdrop]:https://www.material.io/design/components/backdrop.html#usage
[Extended FAB]:https://www.material.io/design/components/buttons-floating-action-button.html#extended-fab
[Material Components(catalog)]:https://github.com/material-components/material-components-android/tree/master/catalog/java/io/material/catalog
[Shrine(demo)]:https://github.com/material-components/material-components-android/tree/master/demos/java/io/material/demo/shrine
[Shrine(codelabs)]:https://github.com/material-components/material-components-android-codelabs/tree/master/java/shrine
[플러터(Flutter)]:https://flutter.io/
[머터리얼 스타일 앱(Material-styled app)]:https://flutter.io/flutter-for-android/#how-do-i-theme-my-material-styled-app

---
<sup>1) MDC-Android 라이브러리 지원 여부로 Android 지원여부를 표시했습니다.(2018년 5월 릴리즈 기준)</sup>
