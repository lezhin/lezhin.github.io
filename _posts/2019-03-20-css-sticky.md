---
title: 'CSS { position: sticky }'
author: naradesign
tags: [web,css]
date: 2019-03-20 00:00:00
---

CSS `position: sticky` 속성을 소개합니다.

`position: sticky` 속성을 적용한 박스는 평소에 문서 안에서 `position: static` 상태와 같이 일반적인 흐름에 따르지만 스크롤 위치가 임계점에 이르면 `position: fixed`와 같이 박스를 화면에 고정할 수 있는 속성입니다.

[아직 Working Draft 단계](https://www.w3.org/TR/css-position-3/#sticky-pos)이고요. [IE 11 브라우저와 안드로이드 4.x 이하 버전에서 지원하지 않습니다](https://caniuse.com/#feat=css-sticky). 하지만 점진적 향상 기법의 한 예로 들기에 적절해 보여요. 최신 명세를 지원하는 브라우저에서는 이 속성이 멋지게 동작하지만 그렇지 않은 브라우저에서는 `position: static` 상태만 표시하기 때문에 어색하지 않게 표시할 수 있는 속성입니다.

<iframe height="265" style="width: 100%;" scrolling="no" title="CSS { position: sticky }" src="//codepen.io/naradesign/embed/GeBxqe/?height=265&theme-id=0&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/naradesign/pen/GeBxqe/'>CSS { position: sticky }</a> by Jeong Chan-Myeong
  (<a href='https://codepen.io/naradesign'>@naradesign</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

```css
.sticky {
    position: -webkit-sticky; /* 사파리 브라우저 지원 */
    position: sticky;
    top: 4px;
    background: red;
}
```

## 이 글에서 사용하는 용어
* <mark>fixed 박스</mark>: `position: fixed` 속성을 적용한 박스.
* <mark>sticky 박스</mark>: `position: sticky` 속성을 적용한 박스.
* <mark>scroll 박스</mark>: `overflow: auto` 또는 `overflow: scroll` 속성을 적용한 가장 가까운 조상 박스.

## <mark>sticky 박스</mark>의 특징
* <mark>sticky 박스</mark>는 `top`, `right`, `bottom`, `left` 속성이 필수입니다.
* <mark>fixed 박스</mark>는 뷰포트에 고정하지만 <mark>sticky 박스</mark>는 <mark>scroll 박스</mark>에 고정합니다. 즉, <mark>scroll 박스</mark>가 `offset` 기준입니다.
* 뷰포트와 <mark>scroll 박스</mark>가 동일한 것처럼 보이는 경우도 있겠지만 뷰포트는 하나뿐이고 <mark>scroll 박스</mark>는 문서 안에서 더 많이 생성할 수 있어요.
* <mark>sticky 박스</mark>를 <mark>scroll 박스</mark>에 고정하는 임계점은 스크롤 위치가 결정합니다. <mark>sticky 박스</mark> 자신과 부모의 위치와 크기도 임계점에 영향을 미칩니다.
* <mark>sticky 박스</mark>의 부모 박스가 <mark>scroll 박스</mark>를 벗어나면 <mark>sticky 박스</mark>는 다시 일반적인 흐름에 따릅니다.
* <mark>sticky 박스</mark>와 <mark>scroll 박스</mark> 사이에 `overflow: hidden` 속성을 적용한 박스가 끼어들면 <mark>sticky 박스</mark>는 일반적인 흐름에 따릅니다.

## 지원 브라우저 분기하기
만약 `position: sticky` 속성을 지원하는 브라우저에만 이 스타일을 적용하려면 `@supports` 규칙을 이용할 수 있습니다. `@supports` 규칙은 IE 11 브라우저가 지원하지 않네요.

```css
@supports (position: sticky) or (position: -webkit-sticky) {
    .sticky {
        position: -webkit-sticky; /* 사파리 브라우저 지원 */
        position: sticky;
        top: 4px;
        background: red;
    }
}
```

`position: sticky` 속성은 조만간 [레진코믹스](https://www.lezhin.com/ko) '연재, TOP 100, 완결, 단행본' 페이지 요일과 장르 탭에 적용 예정입니다. 레진코믹스 웹은 IE 11과 안드로이드 4.x 브라우저를 지원하지만 `position: sticky` 속성으로 구현한 UI는 IE 11 브라우저와 안드로이드 4.x 이하 버전에서 지원하지 않습니다.

## position: sticky 참고
* [W3C CSS Positioned Layout Module Level 3](https://www.w3.org/TR/css-position-3/#sticky-pos)
* [W3C CSS Conditional Rules Module Level 3](https://www.w3.org/TR/css3-conditional/#at-supports)
* [MDN CSS position](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
* [MDN @supports](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports)
* [CSS-TRICKS position:sticky](https://css-tricks.com/position-sticky-2/)
* [Can I use CSS position:sticky](https://caniuse.com/#search=sticky)
* [Can I use CSS Feature Queries](https://caniuse.com/#feat=css-featurequeries)
