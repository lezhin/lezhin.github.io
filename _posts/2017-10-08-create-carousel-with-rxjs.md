---
title: 'RxJS로 캐러셀(Carousel) UI 만들기'
author: vincent
date: 2017-10-08
tag: [web,frontend,rxjs]
---

UI를 결정짓는 데이터 즉, 상태(State)를 어디에 보관하고 어떻게 필요로 하는 곳으로 전파할 것인가, UI 개발에 있어 상태는 언제나 큰 문제 중 하나입니다. 우리는 상태를 단순히 변수에 보관하거나 비슷한 성질을 가진 데이터끼리 모아서 객체로 분리하기도 합니다.

## 변수

변수는 언제든지 다른 곳에서도 쉽게 접근하고 변경할 수 있는 위험성을 가지고 있습니다. 변경된 값이 예측 가능할 수 있지만 그렇지 않을 수도 있습니다.

```javascript
const totalPageNum = 100;
let currPageNum = 1;

nextButton.addEventListener('click', () => {
    currPageNum = currPageNum + 1;
    renderPaging();
});

prevButton.addEventListener('click', () => {
    currPageNum = currPageNum - 1;
    // renderPaging()를 호출하지 않음.
});

function renderPaging() {
    indicator.innerHTML = '(' + pageNum + ' / ' + totalPageNum + ')';
}
```

`nextButton`을 클릭하면 `currPageNum`을 1 증가시키고 `renderPaging()`를 호출하여 인디케이터 UI를 갱신합니다. 이때 다른 장소에서 `currPageNum` 값을 바꾸고 `renderPaging()`를 호출하지 않으면 어떻게 될까요. 인디케이터 UI는 변경된 데이터를 반영하지 못하고 버그가 발생하게 됩니다. 

어떤 상태를 변경할 때마다 상태를 반영하기 위한 행위를 여러 곳에서 하는 것은 매우 귀찮고 위험한 일입니다.

```javascript
nextButton.addEventListener('click', () => {
    currPageNum = currPageNum + 1;
    renderHeader(); // 수정(추가)
    renderPaging();
});

prevButton.addEventListener('click', () => {
    currPageNum = currPageNum - 1;
    renderHeader(); // 수정(추가)
    renderPaging();
});
```

또, `currPageNum`의 값을 인디케이터 UI뿐만 아니라 다른 UI에서도 사용해야 한다면 어떻게 할까요. `currPageNum` 변수를 변경하는 모든 장소를 찾아 수정해야 합니다.

이처럼 변수에 상태를 저장하면 "동기화" 문제가 발생합니다. 그래서 일반적으로 변수를 사용하지 않고 비슷한 성질을 가진 데이터끼리 모아 객체로 분리합니다.

## 발행 / 구독 패턴

```javascript
const page = new Page(1/* currPageNum */);

nextButton.addEventListener('click', () => page.next());
prevButton.addEventListener('click', () => page.prev());

page.update(() => {
    // 페이지 값이 변경되면 리스너가 호출돼 UI가 갱신됨
    renderHeader();
    renderPaging();
});
```

`nextButton`을 클릭하면 `page.next()`가 호출됩니다. `next()`는 페이지 번호를 1 증가시킵니다. 이어서 `page`는 데이터가 변경됐으므로 등록된 리스너 함수를 호출하여 변경 사실을 통지합니다.

이제 변수를 사용했을 때보다 조금 더 동기화가 수월해졌습니다. 하지만 문제는 데이터 변경과 구독하는 측의 관계가 코드상에 명확하게 드러나지 않는다는 것입니다.

```javascript
nextButton.addEventListener('click', () => page.next());
```

위 코드는 `nextButton`을 클릭했을 때 `page.next()`를 호출하여 데이터를 변경합니다. 코드상에서 얻을 수 있는 정보는 이게 전부입니다. 어디에서 `page`를 구독하고 있는지, 또 `page`의 데이터를 변경하면 어떤 일이 일어나는지 알 수 없습니다.

이처럼 발행/구독 패턴으로 데이터 동기화 문제를 해결하면 데이터의 흐름이 명확하지 않다는 또 다른 문제가 필연적으로 발생합니다.

그럼 어떻게 상태를 관리하고 UI를 개발하는게 좋을까요. RxJS가 여러분에게 해답이 되어 줄지도 모르겠습니다.

## RxJS 소개

Reactive Extensions(RxJS)는 함수형 리액티브 프로그래밍(FRP)과 옵저버 패턴 등 다양한 패러다임과 구현 기법을 활용해 개발된 자바스크립트 라이브러리입니다. 일반 데이터뿐만 아니라 이벤트, 통신 등 모든 것을 lodash를 닮은 인터페이스와 순수 함수를 이용해 문제를 해결할 수 있습니다.

RxJS에서 무엇보다 중요한 건 스트림입니다. 모든 것이 스트림에서 시작하고 스트림에서 끝납니다.

```javascript
const button = document.querySelector('button');
button.addEventListener('click', () => console.log('Clicked!'));
```

우리는 흔히 이벤트를 처리할 때 다음과 같이 사고합니다. 

> 클릭이 발생하면 호출될 이벤트 리스너 함수를 등록해야겠다.

```javascript
const button = document.querySelector('button');
const click$ = Rx.Observable.fromEvent(button, 'click');
click$.subscribe(() => console.log('Clicked!'));
```

RxJS에서는 다음과 같이 사고합니다.

> 클릭이 발생하면 값이 흐를 수 있도록 스트림을 만들어야겠다.

어떠한 처리를 하든 가장 먼저 할 일은 스트림을 만드는 일이라는 점을 기억하시길 바랍니다. 스트림의 생성과 조합 그리고 오퍼레이터 체이닝과 순수함수를 이용해 문제를 해결해 나가는 것이 RxJS의 가장 중요한 개념입니다.

더 자세한 내용은 [RxJS Overview](http://reactivex.io/rxjs/manual/overview.html)를 참고하시길 바랍니다.

## RxJS와 함께 캐러셀 UI 만들기

이제 캐러셀 UI를 만들어봅시다. 우리가 만들 캐러셀의 최종 모습은 다음과 같습니다.

<iframe height='320' scrolling='no' title='Carousel with RxJS' src='//codepen.io/uyeong/embed/mBWggz/?height=320&theme-id=0&default-tab=result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/uyeong/pen/mBWggz/'>Carousel with RxJS</a> by UYeong Ju (<a href='https://codepen.io/uyeong'>@uyeong</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

여러분이 따라 하기 편하도록 플레이그라운드를 만들었습니다. 포크 하여 사용하시길 바랍니다.

<iframe height='320' scrolling='no' title='Carousel with RxJS Playground' src='//codepen.io/uyeong/embed/XeMLaO/?height=265&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/uyeong/pen/XeMLaO/'>Carousel with RxJS Playground</a> by UYeong Ju (<a href='https://codepen.io/uyeong'>@uyeong</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

개발 편의를 위해 몇 가지 변수와 함수도 미리 준비했습니다. 각 코드에 대한 설명은 주석으로 대신합니다.

```javascript
// 캐러셀 UI 개발에 필요한 엘리먼트
const elSwiper = document.querySelector('.swiper');
const elList = elSwiper.querySelector('.swiper__list');
const elIndicator = elSwiper.querySelector('.swiper__indicator');
const elPrevious = elSwiper.querySelector('.swiper__button--prev');
const elNext = elSwiper.querySelector('.swiper__button--next');
// 캐러셀의 아이템 갯수 캐시
const count = elList.querySelectorAll('.swiper__item').length - 1;

// 특정 엘리먼트를 전달된 deltaX 만큼 translate 하는 함수
function translateX(element, deltaX, duration = 0, callback = null) {
    element.style.transition = 'transform ' + duration + 's';
    element.style.transform = 'translate3d(' + deltaX + 'px, 0, 0)';
    if (duration > 0 && callback) {
        element.addEventListener('transitionend', callback, {once: true})
    }
}

// 전달된 index에 해당하는 인디케이션을 활성화하는 함수
function updateIndicator(element, index) {
    element.querySelector('.swiper__indication--active').classList.remove('swiper__indication--active');
    element.querySelector('.swiper__indication:nth-child(' + (index + 1) + ')').classList.add('swiper__indication--active');
}
```

### dragging$ 만들기

우선 카드 UI에 마우스를 클릭한 후 드래그하면 드래그한 폭 만큼 카드 UI가 따라서 움직이도록 해봅시다. 앞 절에서 어떠한 처리를 하든 가장 먼저 할 일은 스트림을 만드는 것이라고 이야기했습니다. 그럼 먼저 `mousedown`, `mousemove` 이벤트가 흐를 두 개의 스트림을 만들어봅시다.

```js
const mousedown$ = Rx.Observable.fromEvent(elList, 'mousedown', {passive: true});
const mousemove$ = Rx.Observable.fromEvent(window, 'mousemove', {passive: true});
```

`mousedown` 이벤트는 `elList` 엘리먼트를 통해 받습니다. 하지만 `mousemove` 이벤트는 window 전역 객체를 통해 받습니다. 만약 `mousemove` 이벤트를 `elList` 엘리먼트를 통해 받게 되면 문제가 발생합니다.

![]({{ site.baseurl }}/files/2017-09-26-create-carousel-with-rxjs/carousel.01.gif){:width="100%" style="display:block;max-width:436px;margin:0 auto"}

마우스 커서가 `elList`를 벗어나는 순간 `mousemove`이벤트가 더 이상 발생하지 않아 매끄럽게 동작하지 않습니다.

자, 마우스를 드래그한 만큼 카드 UI를 움직이려면 `mousedown` 했을때의 포지션과 `mousemove` 했을 때의 표지션을 뺀 값, 즉 `deltaX`가 필요합니다. `mousedown$` 과 `mousemove$`을 조합해 `deltaX` 값을 흘려보낼 스트림을 만들어봅시다.

```javascript
mousedown$
    .mergeMap((start) => mousemove$
        .map(move => move.pageX - start.pageX))
    .subscribe((deltaX) => {
        console.log(deltaX);
    });
```

`mousedown$`에 [`mergeMap`](https://www.learnrxjs.io/operators/transformation/mergemap.html) 오퍼레이터를 사용했습니다. `mergeMap` 오퍼레이터는 전달된 인수를 이용해 새로운 Observable을 생성할 때 사용합니다. 즉, 스트림은 `mousedown$`에서 시작되지만, 값이 흐르는 중간 `mergeMap`에서 반환된 `mousemove$` 로 대체됩니다.

이렇게 하는 이유는 `mousedown`과 별개로  `mousemove` 이벤트는 항상 발생하기 때문입니다. 마우스를 클릭한 후 드래그했을 때 만 `deltaX` 값이 흐르면 되므로 스트림의 시작은 `mousedown$`이 적합합니다.

![]({{ site.baseurl }}/files/2017-09-26-create-carousel-with-rxjs/carousel.02.gif){:width="100%" style="display:block;max-width:436px;margin:0 auto"}

이제 `deltaX`는 마우스를 클릭한 후 드래그 시 흐릅니다. 하지만 드래그가 끝나도 `mousemove$`이 계속해서 발생하는 문제가 있습니다. 이 문제를 해결해 봅시다. 우선 `mouseup` 이벤트가 흐를 스트림을 만듭니다.

```javascript
const mouseup$ = Rx.Observable.fromEvent(window, 'mouseup', {passive: true});
```

그리고 앞서 작성한 코드를 다음과 같이 수정합니다.

```javascript
mousedown$
    .mergeMap((start) => mousemove$
        .takeUntil(mouseup$) // 추가
        .map(move => move.pageX - start.pageX))
    .subscribe((deltaX) => {
        console.log(deltaX);
    });
```

[`takeUntil`](http://reactivex.io/documentation/operators/takeuntil.html)은 인자로 전달된 "부 Observable"에 이벤트가 발생하면 그 후에 생성된 "주 Observable"의 값을 폐기합니다. 즉, `mousemove$`은 `mouseup$`에 이벤트가 발생하기 전까지만 흐르며 `mouseup$` 이벤트 후에 생성된 값은 폐기됩니다.

![]({{ site.baseurl }}/files/2017-09-26-create-carousel-with-rxjs/carousel.03.gif){:width="100%" style="display:block;max-width:436px;margin:0 auto"}

이제 의도한 대로 정확히 동작합니다. 마우스를 클릭한 후 드래그하면 `deltaX` 값이 흐르며 `mouseup` 이벤트가 발생하면 스트림이 중단됩니다.

이제 우리가 만든 드래그 스트림을 변수로 할당하고 이 스트림을 subsicrbe하여 흘러오는 `deltaX` 값을 이용해 UI를 움직여 봅시다.

```javascript
const dragging$ = mousedown$
    .mergeMap((start) => mousemove$
        .takeUntil(mouseup$)
        .map(move => move.pageX - start.pageX));

// 아래 코드는 재대로 동작하는지만 확인하고 삭제하세요.
dragging$.subscribe((deltaX) => {
    translateX(elList, deltaX);
});
```

### dragend$ 만들기

이제 드래그 후 마우스를 떼면 드래그한 방향에 따라 자동 슬라이드 되도록 해봅시다.  이를 위해선 드래그가 시작된 후 마우스를 떼면 값을 흘려보낼 `dragend$`을 만들어야 합니다. 이를 실현하기 위해선 앞서 우리가 만든 `dragging$`에서 시작해야 합니다.

```javascript
dragging$
    .switchMap(() => mouseup$
        .take(1))
	.subscribe(() => {
        console.log('dragend!')
    });
```

`dragging$`에 [`switchMap`](https://www.learnrxjs.io/operators/transformation/switchmap.html) 오퍼레이터를 사용했습니다. `switchMap` 오퍼레이터 역시 `mergeMap` 오퍼레이터처럼 새로운 Observable을 생성할 때 사용합니다. 단, `switchMap`은 마지막에 종결된 이벤트만 흐르도록 합니다. 

만일 `dragend$`을 만드는데 `mergeMap`을 사용한다면 드래그 시 발생한 모든 이벤트를 흘려보내는 스트림이 만들어집니다. `switchMap` 을 이용해 `dragging$` 에서 마지막으로 발생한 드래그 이벤트만 흘려보내는 스트림을 만들 수 있습니다.

그리고 `switchMap`에서 `mouseup$`을 반환하여 마우스를 뗀 시점에 이벤트가 흐를 수 있도록 작성합니다.

![]({{ site.baseurl }}/files/2017-09-26-create-carousel-with-rxjs/carousel.04.gif){:width="100%" style="display:block;max-width:436px;margin:0 auto"}

드래그를 완료한 시점에서 어느 쪽으로 슬라이드 할지 결정하기 위해선 `dragging$`의 마지막 `deltaX` 값이 필요합니다. `deltaX`가 음수라면 다음, `deltaX`가 양수라면 이전으로 자동 슬라이드 합니다.

```javascript
dragging$
    .switchMap(() => mouseup$
        .take(1))
    .withLatestFrom(dragging$)
    .subscribe(([, deltaX]) => {
         console.log(deltaX);
    });
```

`dragging$`에서 마지막에 내보내진 값을 흘려보낼 수 있도록 [`withLatestFrom`](https://www.learnrxjs.io/operators/combination/withlatestfrom.html) 오퍼레이터를 사용했습니다.

![]({{ site.baseurl }}/files/2017-09-26-create-carousel-with-rxjs/carousel.05.gif){:width="100%" style="display:block;max-width:436px;margin:0 auto"}

일단 여기에서 `dragend$` 마무리 합니다. 우리가 만든 스트림을 변수로 할당합니다.

```javascript
const dragend$ = dragging$
    .switchMap(() => mouseup$
        .take(1))
    .withLatestFrom(dragging$)
    .map(([, deltaX]) => {
        // index 계산
    });
```

### 상태 스토어

`dragend$`이 발생하면 index를 증가시키거나 감소시켜야 합니다. 이때 index는 저장될 필요가 있습니다. 다행히 RxJS에서는 [`scan`](http://reactivex.io/documentation/operators/scan.html) 오퍼레이터를 사용하여 [상태 스토어(State store)](http://reactivex.io/rxjs/manual/tutorial.html#state-stores)를 만들 수 있습니다.

다음과 같이 `dragging$`, `dragend$`을 합쳐봅시다.

```javascript
Rx.Observable.merge(dragging$, dragend$)
    // State store
    .scan((state, changeFn) => changeFn(state), {deltaX: 0, index: 0})
    .subscribe(({deltaX, index}) => {
        const margin = 10;
        const width = -(index * (parseInt(window.getComputedStyle(elSwiper).width, 10) + margin));
        // deltaX 값이 있다면 deltaX 값 만큼 translate 한다.
        if (deltaX !== undefined) {
            translateX(elList, width + deltaX);
        // deltaX 값이 없다며 index에 해당하는 위치로 자동 슬라이드한다.
        } else {
            translateX(elList, width, .2, () => {
                // 자동 슬라이드가 완료된 후 인디케이션을 갱신한다.
                updateIndicator(elIndicator, index);
            });
        }
    });
```

`scan` 오퍼레이터는 자바스크립트 Array의 [`reduce`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)와 같습니다. `scan` 오퍼레이터의 첫 번째 인자로는 콜백 함수를 전달합니다. 콜백에 전달되는 첫 번째 인수는 `accumulator`로 이전의 값 즉, 누산값이 전달됩니다. 두 번째 인수는 새롭게 대체될 값으로 여기에서는 함수가 전달된다고 가정하고 있습니다. `scan` 오퍼레이터의 두 번째 인자는 초깃값을 전달합니다.

이제 `dragging$`과 `dragend$`을 각각 다음과 같이 수정합니다.

```javascript
const dragging$ = mousedown$
    .mergeMap((start) => mousemove$
        .takeUntil(mouseup$)
        .map(move => move.pageX - start.pageX))
    // State에 deltaX 값을 합친 새로운 상태 값을 반환한다.
    .map(deltaX => (state) => Object.assign({}, state, {deltaX}));

const dragend$ = dragging$
    .switchMap(() => mouseup$
        .take(1))
    .withLatestFrom(dragging$)
    .map(([, fn]) => ({index}) => {
        // dragging$의 changeFn()을 호출하여 deltaX 값을 꺼낸다.
        const {deltaX} = fn();
        // deltaX 값에 따라 index를 증감 또는 감소 시킨다.
        index = index < count && deltaX < -50 ? index + 1 : index;
        index = index > 0 && deltaX > 50 ? index - 1 : index;
        // 새로운 상태 값을 반환한다.
        return {index};
    });
```

이제 잘 동작하는지 테스트 해봅니다.

![]({{ site.baseurl }}/files/2017-09-26-create-carousel-with-rxjs/carousel.06.gif){:width="100%" style="display:block;max-width:436px;margin:0 auto"}

### [NEXT], [PREV], 인디케이션 버튼

마지막으로 [NEXT] 버튼을 누르면 다음으로 [PREV] 버튼을 누르면 이전으로 특정 인디케이션을 클릭하면 적절한 위치로 자동 슬라이드 되도록 수정합니다.

앞 절에서 우리는 `scan` 오퍼레이터를 사용해 index 값을 갖는 State store를 만들었습니다. 이 상태 값을 변경하는 스트림을 만들면 이벤트 발생 시 변경된 상태가 흐르게 되고 최종적으로 UI에 반영될 것입니다.

```javascript
const previous$ = Rx.Observable.fromEvent(elPrevious, 'click')
	// index가 0보다 클때만 1을 감소시킨다.
    .map(() => ({index}) => ({index: index > 0 ? index - 1 : index}));

const next$ = Rx.Observable.fromEvent(elNext, 'click')
    // index가 캐러셀 아이템 갯수보다 작을때만 1을 증가시킨다.
    .map(() => ({index}) => ({index: index < count ? index + 1 : index}));

const indication$ = Rx.Observable.fromEvent(elIndicator, 'click')
    .map(el => el.target.closest('.swiper__indication'))
    .filter(el => el !== null)
	// 클릭된 인디케이션의 index 데이터 값을 상태 값으로 할당한다.
    .map(el => () => ({index: parseInt(el.dataset.index, 10)}));
```

[NEXT], [PREV], 인디케이션을 클릭하면 값이 흐를 스트림을 만들고 [`map`](http://reactivex.io/documentation/operators/map.html)을 이용해 상태를 적절히 변경하도록 코드를 작성했습니다.

그리고 `previous$`, `next$`, `indication$`을 다음과 같이 최종 스트림에 연결합니다.

```javascript
Rx.Observable.merge(dragging$, dragend$, /* >> */ previous$, next$, indication$ /* << */)
    .scan((state, changeFn) => changeFn(state), {deltaX: 0, index: 0})
    .subscribe(({deltaX, index}) => {/* ... */});
```

이제 잘 동작하는지 테스트 해봅니다.

![]({{ site.baseurl }}/files/2017-09-26-create-carousel-with-rxjs/carousel.07.gif){:width="100%" style="display:block;max-width:436px;margin:0 auto"}

여기까지 RxJS를 이용해 캐러셀 UI를 간단히 만들어 봤습니다. 여기에서 작성한 전체 코드는 다음과 같습니다.

```javascript
// 캐러셀 UI 개발에 필요한 엘리먼트
const elSwiper = document.querySelector('.swiper');
const elList = elSwiper.querySelector('.swiper__list');
const elIndicator = elSwiper.querySelector('.swiper__indicator');
const elPrevious = elSwiper.querySelector('.swiper__button--prev');
const elNext = elSwiper.querySelector('.swiper__button--next');
// 캐러셀의 아이템 갯수 캐시
const count = elList.querySelectorAll('.swiper__item').length - 1;
// 캐러셀 UI 구현에 필요한 이벤트 스트림 생성
const mousedown$ = Rx.Observable.fromEvent(elList, 'mousedown', {passive: true});
const mousemove$ = Rx.Observable.fromEvent(elList, 'mousemove', {passive: true});
const mouseup$ = Rx.Observable.fromEvent(window, 'mouseup', {passive: true});

// 특정 엘리먼트를 전달된 deltaX 만큼 translate 하는 함수
function translateX(element, deltaX, duration = 0, callback = null) {
    element.style.transition = 'transform ' + duration + 's';
    element.style.transform = 'translate3d(' + deltaX + 'px, 0, 0)';
    if (duration > 0 && callback) {
        element.addEventListener('transitionend', callback, {once: true})
    }
}

// 전달된 index에 해당하는 인디케이션을 활성화하는 함수
function updateIndicator(element, index) {
    element.querySelector('.swiper__indication--active').classList.remove('swiper__indication--active');
    element.querySelector('.swiper__indication:nth-child(' + (index + 1) + ')').classList.add('swiper__indication--active');
}

const dragging$ = mousedown$
    .mergeMap((start) => mousemove$
        .takeUntil(mouseup$)
        .map(move => move.pageX - start.pageX))
    // State에 deltaX 값을 합친 새로운 상태 값을 반환한다.
    .map(deltaX => (state) => Object.assign({}, state, {deltaX}));

const dragend$ = dragging$
    .switchMap(() => mouseup$
        .take(1))
    .withLatestFrom(dragging$)
    .map(([, fn]) => ({index}) => {
        // dragging$의 changeFn()을 호출하여 deltaX 값을 꺼낸다.
        const {deltaX} = fn();
        // deltaX 값에 따라 index를 증감 또는 감소 시킨다.
        index = index < count && deltaX < -50 ? index + 1 : index;
        index = index > 0 && deltaX > 50 ? index - 1 : index;
        // 새로운 상태 값을 반환한다.
        return {index};
    });

const previous$ = Rx.Observable.fromEvent(elPrevious, 'click')
    // index가 0보다 클때만 1을 감소시킨다.
    .map(() => ({index}) => ({index: index > 0 ? index - 1 : index}));

const next$ = Rx.Observable.fromEvent(elNext, 'click')
    // index가 캐러셀 아이템 갯수보다 작을때만 1을 증가시킨다.
    .map(() => ({index}) => ({index: index < count ? index + 1 : index}));

const indication$ = Rx.Observable.fromEvent(elIndicator, 'click')
    .map(el => el.target.closest('.swiper__indication'))
    .filter(el => el !== null)
    // 클릭된 인디케이션의 index 데이터 값을 상태 값으로 할당한다.
    .map(el => () => ({index: parseInt(el.dataset.index, 10)}));

Rx.Observable.merge(dragging$, dragend$, previous$, next$, indication$)
    .scan((state, changeFn) => changeFn(state), {deltaX: 0, index: 0})
    .subscribe(({deltaX, index}) => {
        const width = -(index * (parseInt(window.getComputedStyle(elSwiper).width, 10) + 10));
        // deltaX 값이 있다면 deltaX 값 만큼 translate 한다.
        if (deltaX !== undefined) {
            translateX(elList, width + deltaX);
        // deltaX 값이 없다며 index에 해당하는 위치로 자동 슬라이드한다.
        } else {
            translateX(elList, width, .2, () => {
                // 자동 슬라이드가 완료된 후 인디케이션을 갱신한다.
                updateIndicator(elIndicator, index);
            });
        }
    });
```

## 끝으로

RxJS를 사용하면 스트림내 모든 값이 흐르기 때문에 코드를 읽고 동작을 파악하기 쉽습니다. 전체 코드를 스트림을 따라 읽어보세요. 상태는 외부에 존재하지 않으며 순수 함수를 이용해 값을 다시 생산하므로 부작용이 없습니다. 항상 스트림의 정상에서 값이 출발해 마지막까지 흐를 뿐이며 UI는 그저 값에 "반응"할 뿐입니다.

위 예제를 순수 자바스크립트로만 작성하면 오히려 코드의 양은 적습니다. 하지만 상태는 외부에 존재하고 어디에서 어떻게 값을 변경하고 있는지 또 값을 변경하면 어떤 부작용이 따르는지 쉽게 예측하기 어렵습니다.

이러한 측면에서 RxJS는 확실히 매력을 가진 도구입니다. 하지만 어느 정도 경지에 도달하기까지의 학습 곡선이 높고 개발 패러다임의 전환을 요구합니다. 그리고 다양한 오퍼레이터를 숙지하고 적절히 사용하기 쉽지 않습니다. 그래서 "꼭 이렇게 까지해야 하는지" 의문이 드는 것도 사실입니다.

그러나 기존 개발 방식에 여전히 문제가 있으며 유지보수 간 괴로움이 뒤 따른다면 RxJS에서 제시하는 패러다임을 한번 즈음 살펴보고 사고를 확장하여 새로운 문제 해결 방법을 도모하는 것은 분명 의미가 있을 것입니다.