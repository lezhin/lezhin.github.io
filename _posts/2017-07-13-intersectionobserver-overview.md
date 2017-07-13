---
title: 'IntersectionObserver를 이용한 이미지 동적 로딩 기능 개선'
author: fallroot
date: 2017-07-13
tag: [web,frontend]
---

구글 크롬 51 버전부터 DOM 엘리먼트의 노출 여부를 비동기로 처리하는 IntersectionObserver API를 사용할 수 있게 되었습니다. 이 기능을 이용하면 이미지의 동적 로딩이나 광고 배너의 노출 측정 등을 효율적으로 사용할 수 있다고 [구글 개발자 블로그](https://developers.google.com/web/updates/2016/04/intersectionobserver)에서 소개하고 있습니다. 이 글에서는 기존의 이미지 동적 로딩에 대한 문제점을 짚어보고 여러 예제를 통해 IntersectionObserver의 사용 방법을 익혀 기존 기능을 개선할 수 있도록 합니다. 사용한 예제들은 브라우저의 호환성을 고려하지 않고 구글 크롬을 기준으로 작성하였습니다.

## 기존의 이미지 동적 로딩 구현

이미지의 개수가 많거나 용량이 큰 페이지를 불러올 경우 쓸데없는 네트워크 비용이 증가하고 이미지를 불러오는 과정에서 서비스 속도에 문제가 발생할 소지가 있어서 이미지가 사용자에게 보일 때만 불러오는 동적 로딩 기능이 필요합니다. IntersectionObserver를 소개하기 전에 먼저 기존 라이브러리들이 이미지 동적 로딩을 어떤 방법으로 구현하고 있는지 간단하게 알아보도록 합니다.

### 엘리먼트 가시성 판단

이미지 동적 로딩에서 가장 중요한 코드는 해당 엘리먼트가 현재 화면 내에 보이는지 알아내는 것입니다. 이를 위해 엘리먼트의 크기와 위치 값을 돌려주는 [Element.getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) 함수를 사용하는 경우가 많습니다. 아래는 이 함수를 사용한 간단한 구현 예제입니다.

```js
function isInViewport(element) {
    const viewportHeight = document.documentElement.clientHeight;
    const viewportWidth = document.documentElement.clientWidth;
    const rect = element.getBoundingClientRect();

    if (!rect.width || !rect.height) {
        return false;
    }

    var top = rect.top >= 0 && rect.top < viewportHeight;
    var bottom = rect.bottom >= 0 && rect.bottom < viewportHeight;
    var left = rect.left >= 0 && rect.left < viewportWidth;
    var right = rect.right >= 0 && rect.right < viewportWidth;

    return (top || bottom) && (left || right);
}
```

### 이벤트 처리

위에서 구현한 isInViewport 함수는 언제 호출해야 할까요? 먼저 문서를 처음 불러왔을 때 호출해야 합니다. 그 후에는 동적 로딩이라는 단어에 맞게 사용자의 동작에 따라 보이지 않던 엘리먼트가 보이게 되는 이벤트를 감지해야 합니다. 마우스나 터치로 스크롤을 통해 문서의 위치가 바뀌거나 브라우저의 크기가 바뀔 수도 있고 모바일 기기의 화면을 돌려서 볼 수도 있습니다. 데스크톱의 경우 scroll, resize 이벤트를, 모바일의 경우 orientationchange 이벤트의 처리를 생각해야 합니다.

```js
const images = Array.from(document.querySelectorAll('img'));

document.addEventListener('scroll', () => {
    images.forEach(image => {
        if (isInViewport(image)) {
            image.onload = () => images.splice(images.indexOf(image), 1);
            image.src = 'original_image_path';
        }
    });
});
```

간단하게 위 코드와 같이 구현할 수 있습니다. 물론 실제 서비스를 위해서는 수정할 점이 몇 가지 있습니다. 동적 로딩의 대상이 되는 이미지를 구분하기 위해 해당 엘리먼트에만 특정 클래스를 부여하거나 HTML5에서 지원하는 [data 속성](https://html.spec.whatwg.org/multipage/dom.html#dom-dataset)을 이용하기도 합니다. 스크롤이나 리사이즈 이벤트가 과도하게 발생하는 경우가 많으므로 throttle 또는 debounce 등을 사용해 실행 빈도를 조절할 수도 있습니다. 일부 라이브러리에서는 [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)을 이용해 이벤트 핸들러를 처리하기도 합니다.

### TADA

레진코믹스에서는 이미지 동적 로딩을 위해 서비스 초기에 [Unveil](https://cdn.rawgit.com/luis-almeida/unveil) 라이브러리를 사용했었습니다. 그러나 적용 후 몇 가지 아쉬움이 있어 따로 [TADA](https://cdn.rawgit.com/fallroot/tada) 라이브러리를 제작했습니다. 먼저 마크업 구조상 이미지를 \<img>태그가 아닌 다른 태그에 배경 이미지로 사용하는 경우를 지원해야 했습니다. 그리고 모바일 웹에 주로 많이 적용하는 수평 스크롤 구역에 대한 처리도 필요했습니다. 문서의 스크롤 이벤트로는 처리가 되지 않기 때문에 특정 엘리먼트를 받아 그 엘리먼트의 스크롤 이벤트 핸들러를 등록할 수 있도록 해야 했습니다. 이를 해결하기 위해 만든 라이브러리를 현재 서비스에 적용 중이지만 이 라이브러리 역시 아래와 같은 문제점들을 가지고 있습니다.

## 기존 이미지 동적 로딩의 문제점

### getBoundingClientRect 함수의 문제점

위 코드에서 특정 엘리먼트가 현재 화면 내에 보이는지 검사할 때 사용하던 Element.getBoundingClientRect 함수에는 치명적인 단점이 있습니다. 이 함수를 호출할 때마다 브라우저는 엘리먼트의 크기와 위치값을 최신 정보로 알아오기 위해 문서의 일부 혹은 전체를 다시 그리게 되는 [리플로우(reflow)](https://gist.github.com/paulirish/5d52fb081b3570c81e3a) 현상이 발생한다는 점입니다. 호출 횟수가 적을 경우에는 부담이 되지 않지만, 이 함수는 위에서 구현한 것처럼 스크롤이나 리사이즈 이벤트가 발생할 때마다 등록한 모든 엘리먼트를 순환하면서 호출하게 됩니다. 이 코드들이 하나의 메인 스레드에서 실행되기 때문에 스크롤을 할 때마다 실행 속도가 눈에 띄게 느려질 수도 있습니다.

### 외부 도메인 문서를 사용하는 iframe

최신 브라우저들은 [동일 도메인 정책](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)에 따라 iframe 내의 외부 도메인 문서에서 현재 문서에 접근하지 못 하게 막고 있습니다. 이 제한은 서비스 개발에서 겪게 되는 문제는 아니고 외부 광고 플랫폼 개발자의 입장에서 발생하는 문제입니다. 광고 이미지의 표시나 클릭 이벤트의 처리 등은 iframe 내에서 처리할 수 있지만 광고 이미지를 지연 로딩한다거나 이 광고가 사용자에게 노출이 되었는지 기록하는 등의 기능은 iframe 내에서 불가능합니다. 그래서 광고를 적용하는 서비스 개발자에게 스크립트를 제공하고 서비스 문서 내에 삽입하는 방식으로 처리하고 있습니다. 이러한 외부 광고가 여러 개라면 삽입해야 하는 코드가 늘어날 뿐만 아니라 코드 내에서 스크롤이나 리사이즈 이벤트 등을 각각 사용하기 때문에 위에서 언급한 문제점들이 배가될 수 있습니다.

### 기타 이벤트에 대한 처리

대부분의 동적 로딩 라이브러리들은 적용할 엘리먼트에 특정 클래스 또는 data 속성을 부여하면 코드를 추가 작성하지 않더라도 쉽게 사용할 수 있습니다. 하지만 화면에서 보이지 않던 엘리먼트가 갑자기 나타나는 현상은 스크롤이나 리사이즈 이벤트에서만 발생하는 것이 아닙니다. 더보기 버튼을 눌렀을 때 숨겨져 있던 엘리먼트를 노출할 수도 있고 AJAX 호출 후 엘리먼트를 생성한 후 보여줄 수도 있습니다. 이런 경우 일괄적으로 처리하기가 어렵우므로 해당 이벤트가 발생할 때 수동으로 처리하는 수밖에 없습니다.

## IntersectionObserver

위에 나열한 문제들을 효과적으로 처리하기 위해 크롬 51/엣지 15/파이어폭스 55 버전부터 [IntersectionObserver](https://wicg.github.io/IntersectionObserver/)를 지원하기 시작합니다. 우리말로 번역하면 교차 감시자 정도가 될 이 기능은 등록한 엘리먼트가 보이는 영역에 나타나거나 사라질 때(용어에 충실하자면 대상 엘리먼트의 영역이 루트 엘리먼트 영역과 교차하기 시작하거나 끝났을 때) 비동기로 이벤트를 발생시켜 줍니다. 기본적인 사용법은 아래와 같습니다.

```js
const intersectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // do something
            observer.unobserve(entry.target);
        }
    });
});

intersectionObserver.observe(element);
```

먼저 [IntersectionObserver 생성자](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver)에 콜백 함수를 인자로 넘겨주고 생성한 인스턴스의 [observe](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/observe) 메소드를 통해 동적으로 처리할 엘리먼트를 등록합니다. 콜백 함수는 [IntersectionObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) 객체 목록을 전달받으므로 순환문을 통해 각 엘리먼트에 대한 처리를 완료하고 필요한 경우 [unobserve](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/unobserve) 메소드를 이용해 감시 대상에서 해제할 수 있습니다.

### IntersectionObserver 예제

아래 예제들은 기본적으로 아래 코드를 바탕으로 작성되었습니다. 각 예제들의 최상단에 엘리먼트에 짝을 이룬 표시등을 두었고 콜백 함수가 호출될 때마다 파동 효과를 주었으며 이 때 [isIntersecting](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/isIntersecting) 속성을 기준으로 표시등을 켜지거나 꺼지게 되어 있습니다.

```js
const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        // isIntersecting 속성으로 해당 엘리먼트가 보이는 지 표시
    });
});

Array.from(document.querySelectorAll('.box')).forEach(box => {
    io.observe(box);
});
```

스크롤 이벤트를 다루지 않더라도 엘리먼트의 가시성 여부를 isIntersecting 속성을 통해 알 수 있습니다.

<iframe class="demo" src="https://cdn.rawgit.com/fallroot/intersectionobserver-examples/master/basic-verticalscroll.html" width="600" height="400" frameborder="0"></iframe>

수평 스크롤의 경우에도 overflow 속성이 적용된 컨테이너 엘리먼트의 스크롤 이벤트를 처리하지 않더라도 상관없습니다.

<iframe class="demo" src="https://cdn.rawgit.com/fallroot/intersectionobserver-examples/master/basic-horizontalscroll.html" width="600" height="200" frameborder="0"></iframe>

더보기 버튼에 대한 클릭 이벤트를 따로 등록하지 않아도 동작합니다.

<iframe class="demo" src="https://cdn.rawgit.com/fallroot/intersectionobserver-examples/master/basic-unfold.html" width="600" height="240" frameborder="0"></iframe>

리사이즈 이벤트 역시 따로 처리할 필요가 없습니다. <a href="https://cdn.rawgit.com/fallroot/intersectionobserver-examples/master/basic-resize.html" target="_blank">새 창</a>을 띄운 후 창 크기를 조절하면서 확인할 수 있습니다.

위의 모든 예제들은 \<iframe> 태그 안에서 실행되고 있습니다. 이처럼 작성한 코드가 외부에서 실행이 되더라도 IntersectionObserver API는 문제없이 동작합니다.

### IntersectionObserver 생성자 옵션

#### root

root 옵션에는 가시성의 판단 기준이 될 HTML 엘리먼트를 지정합니다. observe 메소드로 등록하는 엘리먼트들은 반드시 이 루트 엘리먼트의 자식이어야 합니다. 이 옵션을 지정하지 않을 경우 브라우저 화면에서 현재 보이는 영역인 뷰포트가 기본이 됩니다. 아래 예제에서 알 수 있듯이 루트 엘리먼트를 지정하면 현재 화면과는 상관없이 루트 엘리먼트와 등록한 엘리먼트들의 영역이 교차하는 지 판단하게 됩니다.

<iframe class="demo" src="https://cdn.rawgit.com/fallroot/intersectionobserver-examples/master/option-root.html" width="600" height="400" frameborder="0"></iframe>

#### rootMargin

루트 엘리먼트의 마진값을 지정할 수 있습니다. CSS에서 사용하는 형식과 같기 때문에 "10px", "10px 20px", "10px 20px 30px 40px" 형태가 모두 가능하며 음수값으로 지정할 수도 있습니다. 기본값은 0이고 루트 엘리먼트를 지정한 상태라면 퍼센트값을 사용할 수도 있습니다. 이 옵션을 이용하면 이미지 동적 로딩에서 해당 엘리먼트가 화면에 나타나기 전에 이미지를 불러오기 시작해 이미지 공백을 줄이는데 유용하게 이용할 수 있겠습니다.

<iframe class="demo" src="https://cdn.rawgit.com/fallroot/intersectionobserver-examples/master/option-rootmargin.html" width="600" height="400" frameborder="0"></iframe>

위 예제에서는 root 옵션은 지정하지 않고 rootMargin 옵션을 각각 0, 100px, -100px, 50%로 지정했습니다. 하지만 iframe 내에서 실행을 하게 되면 이 옵션이 정상적으로 동작하지 않습니다. 프로젝트 페이지의 [이슈 댓글](https://cdn.rawgit.com/WICG/IntersectionObserver/issues#issuecomment-179073504)에는 동일 도메인의 프레임 안에서는 동작하는 것으로 논의되고 있지만 뷰포트에는 해당하지 않거나 버그 또는 아직 크롬에 반영이 되지 않아 보입니다.

이 예제는 <a href="https://cdn.rawgit.com/fallroot/intersectionobserver-examples/master/option-rootmargin.html" target="_blank">새 창</a>을 띄워 프레임을 벗어나면 정상적으로 동작합니다. 스크롤을 내리다보면 엘리먼트마다 IntersectionObserver 콜백 함수가 다른 위치에서 호출됨을 알 수 있습니다.

#### threshold

threshold 옵션은 엘리먼트가 콜백 함수의 호출 시점을 정하는 옵션입니다. 0과 1을 포함한 그 사이의 숫자 또는 숫자 배열을 지정할 수 있는데 이 숫자는 엘리먼트의 전체 영역 중에 현재 보이는 영역의 비율입니다. 이 비율의 경계를 넘나들 때마다 콜백 함수가 호출됩니다.

<iframe class="demo" src="https://cdn.rawgit.com/fallroot/intersectionobserver-examples/master/option-threshold-value.html" width="600" height="400" frameborder="0"></iframe>

위 예제에서는 threshold 옵션을 각각 0, 0.5, 1, [0, 1]로 지정했습니다. rootMargin 예제처럼 엘리먼트마다 콜백 함수가 다른 위치에서 호출됩니다. 두 번째와 세 번째 상자는 콜백 호출 시점에 isIntersecting 값이 항상 참이기 때문에 표시등이 정상적으로 표시되지 않습니다. isIntersecting 속성을 기준으로 처리해야 할 작업이 있다면 반드시 threshold 속성에 0을 포함시켜야 정상적으로 동작합니다. threshold 속성은 아래 예제처럼 콜백 함수의 인자로 받는 IntersectionObserverEntry 객체의 intersectionRatio 속성과 같이 사용하기에 유용합니다.

<iframe class="demo" src="https://cdn.rawgit.com/fallroot/intersectionobserver-examples/master/option-threshold-ratio.html" width="600" height="400" frameborder="0"></iframe>

위 예제에서는 threshold 옵션을 각각 [0, 1], [0, 0.5, 1], [0, 0.25, 0.5, 0.75, 1]로 지정하고 콜백이 호출되면 intersectionRatio 값을 기준으로 표시등의 배경 투명도를 바꾸도록 했습니다.

## IntersectionObserver의 활용

### 이미지 동적 로딩

지금껏 알아본 IntersectionObserver를 이용해 이미지 동적 로딩을 간단하게 구현해봅니다. 이미지 엘리먼트를 구성할 데이터가 배열로 존재한다고 가정하고 ES6에서 지원하는 템플릿 문자열을 사용해 배열을 순환하면서 이미지 목록을 생성합니다. 그 후 IntersectionObserver를 초기화하고 만들어진 엘리먼트들을 등록합니다. 콜백 함수에서는 엘리먼트가 보이는 상태일 때 이미지를 로딩하고 해당 엘리먼트를 감시 해제합니다.

```html
<ul id="comics"></ul>
```

```js
const comics = [
    {
        alias: 'eunsoo',
        id: 6080299074584576,
        title: '은수'
    },
    ...
];

const template = comics => `
    ${comics.map(comic => `
        <li class="comic" data-id="${comic.id}">
            <a href="https://www.lezhin.com/comic/${comic.alias}" class="info">${comic.title}</a>
        </li>
    `).join('')}
`;

document.getElementById('comics').innerHTML = template(comics);

const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        }

        const target = entry.target;
        const id = target.dataset.id;

        target.querySelector('.info').style.backgroundImage = `url(https://cdn.lezhin.com/v2/comics/${id}/images/wide?width=600)`;

        observer.unobserve(target);
    });
});

Array.from(document.querySelectorAll('.comic')).forEach(el => {
    io.observe(el);
});
```

아래 예제를 실행하면서 브라우저의 개발자 도구를 열고 네트워크 탭을 살펴보면 이미지 엘리먼트가 보이기 시작할 때 불러오기 시작하는 것을 확인할 수 있습니다.

<iframe class="demo" src="https://cdn.rawgit.com/fallroot/intersectionobserver-examples/master/demo-lazyload.html" width="600" height="400" frameborder="0"></iframe>

### 무한 스크롤

IntersectionObserver 기능을 이용하면 무한 스크롤 역시 쉽게 구현할 수 있습니다. 아래 예제에서는 스크롤의 끝부분에 감시를 할 엘리먼트를 두고 그 엘리먼트가 노출이 될 때마다 콘텐츠를 추가로 불러오도록 작성하였습니다.

```html
<div id="items"></div>
<p id="sentinel"></p>
```

```js
const count = 20;
let index = 0;

function loadItems() {
    const fragment = document.createDocumentFragment();

    for (let i = index + 1; i <= index + count; ++i) {
        const item = document.createElement('p');

        item.classList.add('item');
        item.textContent = `#${i}`;

        fragment.appendChild(item);
    }

    document.getElementById('items').appendChild(fragment);
    index += count;
}

const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        }

        loadItems();
    });
});

io.observe(document.getElementById('sentinel'));

loadItems();
```

실행 결과를 아래 예제에서 확인할 수 있습니다.

<iframe class="demo" src="https://cdn.rawgit.com/fallroot/intersectionobserver-examples/master/demo-infinitescroll.html" width="600" height="400" frameborder="0"></iframe>

## 마무리

IntersectionObserver API는 아직 몇몇 브라우저의 최신 버전에서만 사용할 수 있지만 지원하지 않는 브라우저를 위해 [Polyfill](https://github.com/WICG/IntersectionObserver/tree/gh-pages/polyfill)을 제공하고 있습니다.

IntersectionObserver API는 웹 광고 플랫폼 제공자와 사용자 모두에게도 좋은 소식이라 봅니다. 이 API가 정착된다면 광고 노출 여부를 측정하기가 쉬워지고 서비스에 더해졌던 리소스 낭비를 줄일 수 있을 것이라 생각합니다.

레진코믹스는 크롬 브라우저 사용자의 비중이 높은 편이기 때문에 빠른 시일 안에 적용해 볼 예정입니다. 이미지 동적 로딩 기능의 개선과 정주행 기능과 같이 현재 스크롤 이벤트를 과하게 사용하고 있는 코드에 대한 부담을 덜 수 있기를 기대하고 있습니다.

## 참고자료

- [Intersection Observer API Specification](https://wicg.github.io/IntersectionObserver/)
- [IntersectionObserver’s Coming into View](https://developers.google.com/web/updates/2016/04/intersectionobserver)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
