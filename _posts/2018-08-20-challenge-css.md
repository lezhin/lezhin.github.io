---
title: '레진 챌린지 CSS 개발 후기'
author: naradesign
tags: [web,css]
date: 2018-08-20 00:00:00
---

오늘 [레진 챌린지](https://www.lezhin.com/ko/challenge) 서비스를 오픈하면서 CSS 개발했던 일을 회고합니다. 전처리 도구, BEM, 새로운 CSS 규칙을 활용했던 이야기입니다.

1. [CSS 전처리 도구 활용: CSS 분리, 병합, 재사용](#preprocessor)
2. [BEM 명명 규칙 활용: .block__element-\-modifier](#bem)
3. [BEM 가장 흔한 실수: .a__b__c-\-d, .a__b-\-c-\-d](#bem-mistakes)
4. [냄새나는 CSS 코드: 선택자 특이성을 고려하지 못한](#specificity-mistakes)
5. [새로운 CSS 규칙: @supports, position: sticky;](#supports-and-sticky)



## CSS 전처리 도구 활용: CSS 분리, 병합, 재사용 <a id="preprocessor" href="#preprocessor">#</a>
우리 팀에서는 CSS 전처리 도구로 Sass를 사용하고 있습니다. 전처리 도구의 장점은 콤포넌트 단위로 파일을 쪼개어 관리할 수 있다는 점과 반복하는 코드를 변수처럼 재사용할 수 있다는 점입니다.

```scss
/* 콤포넌트 기반으로 CSS 코드를 나누어 관리하고 있다. */
/assets
    /stylesheets
        /challenge
            /comics.scss
            /episode.scss
            /filter.scss
            /footer.scss
            /global.scss
            /gnb.scss
            /header.scss
            /history.scss
            /pagination.scss
            /terms.scss
            /view.scss
            /work.scss
        /common
            /normalize.scss
            /rwd_break_point.scss
        /challenge.scss

```

콤포넌트 기반으로 관리하는 코드의 이점은 필요한 콤포넌트만 `@import` 해서 하나의 거대한 `*.css` 파일을 생성할 수 있고, 불필요한 콤포넌트만 걸러내어 버릴 수 있다는 점입니다. 레진 챌린지에서는 위에 나열한 파일들을 `challenge.scss` 파일에서 모두 긁어 모은 후 하나의 `challenge.css` 파일로 병합하여 서비스합니다.

```scss
/* challenge.scss => challenge.css */
@import 'common/normalize';
@import 'common/rwd_break_point';
@import 'challenge/global';
@import 'challenge/header';
@import 'challenge/footer';
@import 'challenge/gnb';
@import 'challenge/history';
@import 'challenge/filter';
@import 'challenge/pagination';
@import 'challenge/comics';
@import 'challenge/episode';
@import 'challenge/view';
@import 'challenge/work';
@import 'challenge/terms';
```

빌드 후 실제로 서비스하는 파일은 병합한 `challenge.css` 입니다. 레진 챌린지는 작은 사이트라서 이렇게 하나의 파일로 관리해도 괜찮지만 큰 규모의 사이트라면 이야기가 달라질 수 있어요.

Sass에서 가장 빈번하게 사용했던 문법 규칙은 `@mixin` 과 `@include` 입니다. 모바일에서 데스크톱까지 하나의 페이지로 스타일 처리를 하기 때문에 미디어 쿼리를 상당히 많이 사용하는데요. 레진 챌린지에서는 `@media` 규칙만 269회 사용했네요.

```scss
/* common/rwd_break_point.scss */
@mixin desktop {
    @media (min-width: 961px) { @content; }
}
@mixin desktop-large {
    @media (min-width: 1281px) { @content; }
}
@mixin desktop-small {
    @media (min-width: 961px) and (max-width: 1280px) { @content; }
}
@mixin mobile {
    @media (max-width: 960px) { @content; }
}
```
```scss
/* challenge/header.scss */
.header {
    @include desktop { ... }
    @include desktop-large { ... }
    @include desktop-small { ... }
    @include mobile { ... }
}
```

실제로 사용하지 않았지만 해상도 기준으로 파일을 쪼개는 아래와 같은 방법도 있는데요. `.header` 스타일 변경하려면 `.scss` 파일 4개를 순환해야 하는 번거로움이 있겠네요.

```scss
@include desktop { /* desktop.scss */
    .header { ... }
}
@include desktop-large { /* desktop-large.scss */
    .header { ... }
}
@include desktop-small { /* desktop-small.scss */
    .header { ... }
}
@include mobile { /* mobile.scss */
    .header { ... }
}
/* 그냥 예제입니다. 이건 아닌 것 같죠? */
```



## BEM 명명 규칙 활용: .block__element-\-modifier <a id="bem" href="#bem">#</a>
우리 팀에서는 [BEM](https://en.bem.info/) 명명 규칙을 사용하고 있습니다. [레진 마크업 가이드](https://github.com/lezhin/markup-guide#css-naming)에도 명시해 두었는데요. BEM은 Block(블록), Element(요소), Modifier(변형)의 약자로 HTML, CSS, JavaScript 에서 DOM을 조작하기 위한 용도로 클래스 이름에 한정하여 일관성있게 사용하고 있습니다. 아이디 선택자 이름에는 사용하지 않아요.

이 섹션에 등장하는 '블록'과 '요소'는 CSS 또는 HTML 에서 흔히 사용하는 의미와 다르니 유념하세요. 블록은 '컴포넌트 블록', 요소는 '컴포넌트 요소'의 줄임말입니다. '변형'은 '컴포넌트 변형' 또는 '컴포넌트 확장'으로 이해해도 괜찮습니다. 레진 챌린지에서 사용했던 클래스 이름을 조금만 들여다 볼까요?

```html
<main class="main">
    <p class="main__errorMsg main__errorMsg--403">페이지 접근권한이 없습니다 T.T</p>
    <p class="main__errorMsg main__errorMsg--404">페이지를 찾을 수 없습니다. T.T</p>
    <p class="main__errorMsg main__errorMsg--500">서비스 이용이 원활하지 않습니다 T.T</p>
</main>
```
```scss
.main /* 블록(block) */
.main__errorMsg /* 요소(element) */
.main__errorMsg--403 /* 변형(modifier) */
.main__errorMsg--404
.main__errorMsg--500
```

위 예제는 `.main` 블록 내부에 있는 `.main__errorMsg` 요소에 `.main__errorMsg--*` 이라는 변형을 추가했는데요. 아래 예제와 같이 블록에 직접 변형을 추가할 수도 있어요.

```html
<!-- 블록에 변형 또는 확장이 필요한 경우 -->
<main class="main main--challenge">...</main>
<main class="main main--superChallenge">...</main>
```

`.main` 이라는 기본 블록에 `.main--*` 라는 변형을 추가해 보았습니다. BEM 명명 규칙에서 싱글 하이픈(-)을 사용하는 것에 대한 제약은 없지만 우리 팀에서는 싱글 하이픈 대신 카멜 케이스(camelCase) 규칙을 사용하고 있어요.

```scss
.main__error-msg /* 이렇게 해도 되지만 */
.main__errorMsg /* 우리 팀에서는 이렇게 사용해요 */
```

코드가 길어 보이기는 하지만 누구나 쉽게 읽을 수 있고 선택자 용도를 파악하기 위한 별도의 주석이 필요 없어 보이죠?

## BEM 가장 흔한 실수: .a__b__c-\-d, .a__b-\-c-\-d <a id="bem-mistakes" href="#bem-mistakes">#</a>
BEM 명명 규칙에 따라 선택자를 설계할 때 자주 발견할 수 있는 실수를 한번 살펴 보려고 합니다. 누구나 헷갈릴 수 있고 흔히 발견할 수 있는 예제입니다.

```scss
/* 블록, 요소, 변형은 각각 한 번씩만 사용해야 한다. */
.a__b__c--d (X) /* 두 번째 키워드 'b'는 블록인가? 요소인가? 'a, b, c'는 DOM 구조를 의미하나? */
.a__b--c--d (X) /* 네 번째 키워드 'd'는 새 선택자로 분리해야 한다. '.a__b--c' 그리고 '.a__b--d' */
```

가장 흔한 실수는 하나의 선택자에 블록, 요소, 변형을 여러번 사용하는 것입니다. BEM 명명 규칙은 하나의 선택자에 블록, 요소, 변형 키워드를 각각 한 번씩만 사용할 수 있습니다. 이 규칙을 준수하지 않은 코드는 DOM 구조가 바뀔 때 선택자 의미가 깨집니다.

```scss
/* DOM 구조에 의존하는 명명 규칙 세트. 이렇게 하지 마세요. */
.comics (O)
.comics__list (O)
.comics__list__item (X)
.comics__list__item__link (X)
.comics__list__item__link__title (X)
.comics__list__item__link__thumb (X)

/* DOM 구조에 의존하지 않는 명명 규칙 세트. 이렇게 하세요. */
.comics (O)
.comics__list (O)
.comics__item (O)
.comics__link (O)
.comics__title (O)
.comics__thumb (O)
```

DOM 구조는 여러가지 이유로 언제든 바뀔 수 있기 때문에 선택자 이름을 DOM 구조와 맵핑하는 경우 HTML 코드와 CSS 코드의 관심사 분리 효과는 반감합니다. HTML에는 콘텐츠 구조와 의미를 담고 CSS에는 스타일만 남기는 코드가 좋습니다.



## 냄새나는 CSS 코드: 선택자 특이성을 고려하지 못한 <a id="specificity-mistakes" href="#specificity-mistakes">#</a>

BEM 명명 규칙의 단점은 HTML 코드가 중복 키워드로 너저분해 질 수 있다는 점입니다. 버튼 스타일을 예로 들면 다음과 같습니다.

```html
<!-- .html -->
<button class="btn btn--confirm btn--large">...</button>
```
```scss
/* .scss */
.btn {
    &--confirm { ... }
    &--large { ... }
}
```
```scss
/* .css */
.btn { ... }
.btn--confirm { ... }
.btn--large { ... }
```

HTML 클래스 이름에 `btn` 키워드를 반복하고 있는 것을 보면서 꼭 이래야만 하는지 의문이 생겼어요. 아래 코드는 BEM처럼 보이지만 이것은 BEM 명명 규칙과 다릅니다. 하지만 한번 시도해 봤어요.

```html
<!-- .html -->
<button class="btn__confirm--large">...</button>
```
```scss
/* .scss */
[class*='btn__'] {
    &[class*='__confirm--'] { ... }
    &[class*='--large'] { ... }
}
```
```scss
/* .css */
[class*='btn__'] { ... }
[class*='btn__'][class*='__confirm--'] { ... }
[class*='btn__'][class*='--large'] { ... }
```

결과적으로 HTML 코드는 간결해 졌지만, CSS 코드에서 구린 냄새가 나기 시작했습니다. 선택자 특이성(specificity)이 높아진 겁니다. 선택자 특이성이 높아졌다는 것은 이 버튼 스타일을 유지 보수하거나 새로운 선택자로 덮어 쓰기가 어려워졌다는 것을 의미해요. 다시는 이런 방식으로 작성하지 않으려고 합니다.



## 새로운 CSS 규칙: @supports, position: sticky; <a id="supports-and-sticky" href="#supports-and-sticky">#</a>

`@supports` 규칙은 유저 에이전트가 CSS `property: value;` 쌍을 지원하는지 여부에 따라 CSS 코드를 분기할 수 있도록 만들어 주는 피처 쿼리(feature query)입니다. `position: sticky;` 속성은 화면 스크롤 구간에 따라서 특정 요소의 `position` 값을 `relative` 또는 `fixed` 상태로 전환해 주는 속성([데모](http://html5-demos.appspot.com/static/css/sticky.html))입니다.

이 두 가지 명세를 처음 사용하면서 함께 소개하는 이유는 `position: sticky;` 속성을 아직 모든 브라우저가 지원하지 않아 `@supports` 규칙과 함께 사용했기 때문입니다.

```scss
/* position: sticky 속성을 지원하지 않는 경우 폴백. */
.filter { position: fixed; }

/* position: sticky 속성을 지원하는 경우 .filter 폴백을 오버라이드. */
@supports (position: sticky) or (position: -webkit-sticky) {
    .filter {
        position: -webkit-sticky;
        position: sticky;
    }
}
```

현재 시점(2018-08-20)에서 `@supports` 규칙은 IE, Blackberry 에서 지원하지 않습니다. `position: sticky;` 속성은 IE, Blackberry, Opera Mini 에서 지원하지 않습니다. QA 테스트 과정에서 IE 브라우저가 이 효과를 지원하지 않는다는 보고가 들어왔지만 `Known issue/Won't fix` 상태로 닫아 주었습니다.
