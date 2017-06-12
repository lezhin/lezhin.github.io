---
title: 'Tabnabbing 피싱 공격의 동작 원리와 대응책'
author: vincent
date: 2017-06-12 11:10
tag: [web,frontend,phishing]
---

브라우저에서 사용자의 개인 정보를 가로채는 여러가지 [피싱](https://en.wikipedia.org/wiki/Phishing) 공격 기법이 있습니다.
이 글에서는 그 중에서도 상대적으로 단순해서 과소평가된 [Tabnabbing] 공격의 동작 원리와 대응책을 함께 알아보겠습니다.
<!--more-->

## [Tabnabbing] 의 동작 원리

[Tabnabbing]은 HTML 문서 내에서 링크(target이 `_blank`인 Anchor 태그)를 클릭 했을 때,
새롭게 열린 탭(또는 페이지)에서 기존의 문서의 location을 피싱 사이트로 변경해 정보를 탈취하는 공격 기술을 뜻한다.
이 공격은 메일이나 오픈 커뮤니티에서 쉽게 사용될 수 있습니다.

![](/files/2017-06-tabnabbing/tabnabbing.png)

(출처: [blog.jxck.io](https://blog.jxck.io/entries/2016-06-12/noopener.html) ~~영어 스펠링이 이상해 보이는 것은 기분 탓입니다~~)

공격 절차는 다음과 같습니다:

1. 사용자가 `cg**m**.example.com`에 접속합니다.
1. 해당 사이트에서 `happy.example.com`으로 갈 수 있는 외부 링크를 클릭합니다.
1. 새 탭에 `happy.example.com`가 열립니다.
  - `happy.example.com`에는 `window.opener` 속성이 존재합니다.
  - 자바스크립트를 사용해 `opener`의 `location`을 피싱 목적의 `cg**n**.example.com/login` 으로 변경합니다.
1. 사용자는 다시 본래의 탭으로 돌아옵니다.
1. 로그인이 풀렸다고 **착각**하고 아이디와 비밀번호를 입력한다.
  - `cg**n**.example.com`은 사용자가 입력한 계정 정보를 탈취한 후 다시 본래의 사이트로 리다이렉트합니다.

## 예제: 네이버 메일 vs. Gmail

시나리오를 하나 그려볼까요?

공격자가 네이버 계정을 탈취할 목적으로 여러분에게 세일 정보를 담은 메일을 보냅니다.
그 메일에는 `[자세히 보기]`라는 외부 링크가 포함되어 있습니다.
물론 이 세일 정보는 가짜지만 공격자에겐 중요하지 않습니다.
메일을 읽는 사람이 유혹에 빠져 링크를 클릭하면 그만이죠.

![](/files/2017-06-tabnabbing/naver.gif)

(상단의 주소를 주목하세요)

하지만 Gmail은 이 공격이 통하지 않습니다.
Gmail은 이러한 공격을 막기 위해 Anchor 태그에 `data-saferedirecturl` 속성을 부여해 안전하게 리다이렉트 합니다.

![](/files/2017-06-tabnabbing/gmail.png)

## `rel=noopener` 속성

이러한 공격의 취약점을 극복하고자 `noopener` 속성이 추가됐습니다.
`rel=noopener` 속성이 부여된 링크를 통해 열린 페이지는 `opener`의 `location`변경과 같은 자바스크립트 요청을 거부합니다.
정확히 말해서 `Uncaught TypeError` 에러를 발생시킵니다(크롬 기준).

![](/files/2017-06-tabnabbing/relopener.png)

이 속성은 [Window Opener Demo 페이지](https://labs.jxck.io/noopener/)를 통해 테스트해볼 수 있습니다.
크롬은 버전 49, 파이어폭스 52부터 지원합니다. 파이어폭스 52가 2017년 3월에 릴리즈 된 것을 감안하면 이 속성 만으로 안심하긴 힘들겠네요.
자세한 지원 여부는 [Link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types)를 참고하세요.

따라서, 이러한 공격이 우려스러운 서비스라면 [blankshield](http://danielstjules.github.io/blankshield/) 등의 라이브러리를 사용해야 합니다:

```javascript
blankshield(document.querySelectorAll('a[target=_blank]'));
```

참고로, `noopener` 속성은 이 외에도 성능 상의 이점도 있습니다.
`_blank` 속성으로 열린 탭(페이지)는 언제든지 `opener`를 참조할 수 있습니다.
그래서 부모 탭과 같은 스레드에서 페이지가 동작합니다.
이때 새 탭의 페이지가 리소스를 많이 사용한다면 덩달아 부모 탭도 함께 느려집니다.
`noopener` 속성을 사용해 열린 탭은 부모를 호출할 일이 없죠.
따라서 같은 스레드일 필요가 없으며 새로운 페이지가 느리다고 부모 탭까지 느려질 일도 없습니다.

성능 상의 이점에 대한 자세한 내용은 [The performance benefits of rel=noopener](https://jakearchibald.com/2016/performance-benefits-of-rel-noopener/)을 참고하세요.

## 참고자료

* [Tabnabbing: A New Type of Phishing Attack](http://www.azarask.in/blog/post/a-new-type-of-phishing-attack/)
* [Target="_blank" - the most underestimated vulnerability ever](https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/)
* [링크에 rel=noopener를 부여해 Tabnabbing을 대비](https://blog.jxck.io/entries/2016-06-12/noopener.html)(일어)
* [The performance benefits of rel=noopener](https://jakearchibald.com/2016/performance-benefits-of-rel-noopener/)

[Tabnabbing]:https://en.wikipedia.org/wiki/Tabnabbing
