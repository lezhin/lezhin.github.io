---
title: '[iOS] Xcode File Template을 이용해 반복작업 줄이기'
author: gyuchan
tags: [ios,template,xcode-template]
date: 2019-12-16 00:00:00
---

우리 모두는 하나의 프로젝트를 만드는데 더 효과적인 구조를 만들기 위해 노력합니다. 어떠한 구조를 완성하게 되면, 그 구조가 다른 프로젝트에 영향을 끼치거나, 심지어 <mark>프로젝트의 시작단계</mark>에서 그 구조의 규약대로 파일을 초기화시켜야할때가 생기게됩니다.

##Template이 왜 필요할까?
###혹시 다음과 같은 고민을 하신적이 있으신가요?

* 우리가 정한 규약대로 <mark>파일을 반복적으로 생성하는 작업</mark>이 귀찮아요
* 새로 입사했는데, 팀내에서 정해진 규약이 있다는데 구조를 한눈에 보기 힘들어서 이게 맞는 규약인지 모르겠어요
* 개발하면서 이게 맞는 규약이었는지 가물가물해요

모든 규약을 모두 정의하긴 어렵지만,
Xcode Template은 <mark>파일 생성단계에서 우리가 정한 규약대로 지켜야할 때</mark> 사용하면 매우 편리해지고, 서로의 약속대로 수행하는데 유리해질 수 있습니다.

###Xcode에는 Template이 크게 두가지로 나뉩니다.

* File

![](/files/2019-12-19-iOS-File-Template/Create-a-file.png)

* Project

![](/files/2019-12-19-iOS-File-Template/Create-a-project.png)

이 글은, 이 중 File Template에 대해서 소개합니다.

##Xcode File Template
사실, Apple은 이미 많은 template들을 xcode application 안에 준비해놓고 있었습니다.

![](/files/2019-12-19-iOS-File-Template/xcode-file-template-path.png)

우리는 이 경로의 파일 구조를 통해 Template을 정의하는데 꼭 필요한 요소들을 확인할 수 있었습니다.
그리고 Template을 만드는 기본 구조를 토대로 Custom Template을 만들면 되겠다는 기쁜 마음으로 구조를 파악해봅시다!

기본적으로 .xctemplate 폴더가 하나의 Template을 의미하며, .xctemplate을 모아둔 상위 group이 template group입니다.

### .xctemplate 폴더에 꼭 필요한 파일
* TemplateIcon.png
* TemplateInfo.plist
* 최종적으로 생성되는 FILEBASENAME.swift

각각 파일이 하는 역할에 대해 자세히 알아봅시다!

####TemplateIcon.png
![](/files/2019-12-19-iOS-File-Template/what's-icon-file.png)

File template을 선택하기 전 확인할 수 있는 이미지를 정의할 수 있습니다.

####TemplateInfo.plist
Template이 생성되는데 필요한 아주 중요한 정보가 들어있는 파일입니다.

![](/files/2019-12-19-iOS-File-Template/templateInfo-struct.png)

#####Required field
-
* Kind : template 종류를 정의합니다.
	* File template:  __Xcode.IDEFoundation.TextSubstitutionFileTemplateKind__
	* Project template : __Xcode.Xcode3.ProjectTemplateUnitKind__
* SortOrder : Template이 보여지는 순서를 결정합니다. 하나의 Group에는 여러 template을 만들 수 있는데, template간의 순서를 정의해줄 수 있습니다. Group 또한 최상위로 올리고 싶지만 아쉽게도 Xcode에서 기본 제공하는 template들의 순서 위로 올릴수는 없었습니다.

#####Optional field
-
* Platforms : 어느 플랫폼에서 사용되는 것인지 정의합니다.
	* ios : <mark>com.apple.platform.iphoneos</mark>
	* macosx: <mark>com.apple.platform.macosx</mark>
* DefaultCompletionName :  Default 파일명을 의미합니다.
* Options : 파일 생성시 여러 옵션을 정의할 수 있도록 제공할 수 있습니다.
	* Required : 꼭 필요한 옵션으로 정의할 수 있습니다.
	* Type : 여러 타입으로 UI 제공할 수 있습니다.
		* text
		* class
		* checkbox
		* popup
		* static
		* combobox
	*  NotPersisted : 다음번에 이 속성을 기억할 것인지를 정의할 수 있습니다.

####\_\_\_FILEBASENAME\_\_\_</span>.swift
최종적으로 생성되는 파일을 정의해줍니다.

```
import UIKit
class ___FILEBASENAMEASIDENTIFIER___: UIViewController {
}
```
여기서는 하나만 기억하세요!

* \_\_\_FILEBASENAMEASIDENTIFIER\_\_\_ : 생성하는 파일 명으로 대체됩니다.

##Lezhin File Template
레진코믹스 iOS 서비스의 UIViewController 생성 규약은 다음과 같습니다.

* Indecator, 화면 전환등에 대해 정의되어있는 BaseViewController class를 상속받아야 한다.
* Custom NavigationBar를 따르도록 CustomNavigationProtocol을 상속받아야 한다.



```example-UIViewController create
class SampleViewController: BaseViewController {
	,
	,
	,
}

extension SampleViewController: CustomNavigationProtocol {
	func didTapNavigationButtonItem(_ item: CustomNavigationBar.ButtonType) {
		///버튼 선택
    }
    
	func getCustomNavigationBar() -> CustomNavigationBar {
		///커스텀 네비게이션 바 생성
    }
    
    func getContainerView() -> UIView {
		///최상위 뷰 리턴
    }
    ,
    ,
    ,
}
```
항상 UIViewController를 생성할 때마다 위 코드를 작성해야하고.. 심지어 이 부분을 놓칠때도 생깁니다! 그래서 우리는 Lezhin Template을 만들기로 결심하였습니다.

#### Step1. 폴더 및 필요파일 생성
먼저, Lezhin이라는 Template Group을 만들기 위해 폴더를 생성합니다. 그리고 위에서 배웠던 Template 규약대로 생성해봅니다.

![](/files/2019-12-19-iOS-File-Template/lezhin-custom-template-struct.png)

#### Step2. 파일 정의
우리는 ViewController를 생성할때 xib 사용을 optional하게 가져가고 있습니다. 이에따라 xib 파일포함 유무를 분기시켜줘야 했는데요.
이를 위해 다음과 같은 작업이 추가되었습니다.

1. 탬플릿 폴더 생성 : 아래 __규약대로 폴더를 만들어야 정상적으로 template이 생성됩니다!__
	1. {TemplateName}Swift
	2. {TemplateName}XIBSwift
2. TemplateInfo.plist에서 options에 XIB checkbox option 추가

	```
<dict>
	<key>Identifier</key>
		<string>XIB</string>
	<key>Name</key>
		<string>Also create XIB file</string>
	<key>Description</key>
		<string>Whether to create a XIB file with the same name</string>
	<key>Type</key>
		<string>checkbox</string>
	<key>Default</key>
		<string>true</string>
	<key>NotPersisted</key>
		<true/>
</dict>
```
3. 생성파일 정의
	* \_\_\_FILEBASENAME\_\_\_.swift : 각 폴더에 생성하여 기반 코드작업을 해놓습니다.
	* (xib가 필요한 경우) \_\_\_FILEBASENAME\_\_\_.xib : XIB 폴더에 생성합니다.


#### Step3. 적용

이렇게 생성한 Template을 어디에 적용해야할까요?

Application에 있는 xcode에 복붙하기엔, xcode update시 사라지게되니 의미가 없을 것 같습니다.

따라서, 각자의 머신에 적용토록 합니다!

```copy shell
mkdir -p ~/Library/Developer/Xcode/Templates/File\ Templates/
cp -R Lezhin ~/Library/Developer/Xcode/Templates/File\ Templates
```

#### Step4. 완성

![](/files/2019-12-19-iOS-File-Template/Lezhin-custom-file-template.png)

#### Step5. 팀 내 공유
이 모든걸 갖고 있는 폴더를 압축한 후, 팀내에 공유합니다!

![](/files/2019-12-19-iOS-File-Template/share.png)

이제 우리 구성원 모두는 반복된 파일 생성 후 기초 작업에 대해 번거롭지도 않고, 잊어버리지도 않게 되었습니다!

## 응용
새롭게 정의하는 디자인 패턴 파일형식도 생성이 가능합니다. 이를테면 VCNC에서 공유했던 [크로스플랫폼 코드 아키텍쳐를 위한 RIBs](http://engineering.vcnc.co.kr/2019/05/tada-client-development)도 파일 생성을 Template화 시켰죠.

우리는 앞으로도 프로젝트를 진행하면서 많은 고민들을 할 테지만, 그 결과로 나오는 정의와 규약들에 대해 더욱 편리하고 빠르게 사용할 수 있도록 준비하는 부분은 부족하진 않은지 곱씹어봅시다!

긴 글 함께해주셔서 감사합니다.

## 참고

* [Apple developer documentation](https://developer.apple.com/documentation/xcode/creating_an_xcode_project_for_an_app)
* [How to create own xcode file template for ios and macos](https://medium.com/@popcornomnom/swift-tutorial-how-to-create-own-xcode-file-template-for-ios-and-macos-d2e535ed62c5)