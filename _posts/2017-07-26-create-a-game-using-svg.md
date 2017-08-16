---
title: 'SVG를 이용해 간단한 웹 게임 만들어보기'
author: vincent
date: 2017-07-26
tag: [web,frontend]
---
<a href="https://github.com/UYEONG/jumping-car" class="forkme"></a>

근래 소규모로 게임 프로그래밍 스터디를 시작했습니다. 서비스 UI를 개발하는 프론트엔드개발자에게 있어 게임 프로그래밍은 언제나 커튼 뒤에 비친 풍경처럼 흐릿하고 형체를 쉽게 알 수 없는 신비한 존재입니다. 이번에 미약하게나마 커튼을 걷어 창문 너머 펼쳐진 풍경을 감상해 보자는 게 이번 스터디의 개인적인 목표입니다.

## 왜 SVG를 선택했나

게임을 만드는 데 어떤 기술을 사용할지 고민했습니다. 일반적인 DOM은 쉽게 객체를 조작할 수 있지만, 문서의 엘리먼트를 추상화한 것에 불과하므로 다양한 도형을 만들거나 좌표계에 사상(寫像, Mapping)[^Mapping]하기 쉽지 않습니다.

캔버스는 그래픽 처리에 환상적인 성능을 보여주고 원, 다각형 등 다양한 도형을 그리기 쉽지만 일일이 객체화해야 하고 이를 관리하기 쉽지 않습니다. 여기에 필자가 캔버스를 좀 처럼 써 본 경험이 없어서 무턱대고 사용하기에도 부담을 느꼈습니다.

하지만 SVG는 이 두 장점을 모두 갖고 있습니다. 확장 가능한 벡터 그래픽(Scalable Vector Graphics)이라는 이름을 통해서 알 수 있듯이 그래픽 요소를 그리는데 적합한 포멧이며 DOM처럼 추상화된 객체도 지원합니다.

## 어떤 게임을 만들었나

필자가 만든 게임은 크롬에 내장된 [Running T-Rex](http://apps.thecodepost.org/trex/trex.html)와 비슷한 것으로 JUMPING CAR라고 이름을 붙였습니다. 플레이해보고 싶은 분은 [uyeong.github.io/jumping-car](https://uyeong.github.io/jumping-car/)를 방문하시기 바랍니다.

규칙은 단순합니다. 게임을 시작하면 자동차가 달려나가고 이윽고 장애물을 만나게 됩니다. 장애물을 뛰어넘으면 점수가 1씩 증가하지만 부딪히면 게임이 종료됩니다.

![](/files/2017-07-26-create-a-game-using-svg/jumping-car.01.jpg){:width="100%" style="max-width:550px"}

이 글에서는 게임을 만드는 과정을 소개하기보다 SVG를 이용하면서 알게 된 몇 가지 주요한 내용을 다룹니다.

## Pattern을 사용한 요소는 느리다

이미지를 반복해서 출력할 때 HTML에서는 CSS의 [background-url](https://developer.mozilla.org/ko/docs/Web/CSS/background) 속성으로 간단히 해결할 수 있습니다. 하지만 SVG에서는 [Pattern 요소](https://developer.mozilla.org/ko/docs/Web/SVG/Element/pattern)를 이용해야 합니다.

아래 그림처럼 `pattern#pat-land` 요소를 만들고 이를 `rect.parallax`에서 사용하여 그림을 반복 출력되도록 합니다. 그리고 `rect.parallax`를 조금씩 Transform 하여 앞으로 이동하도록 구현합니다.

![](/files/2017-07-26-create-a-game-using-svg/jumping-car.02.jpg){:width="100%" style="max-width:550px"}

코드는 다음과 같습니다(예제: [svg-parallax-test/parallax1](https://uyeong.github.io/svg-parallax-test/parallax1/)).

```javascript
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="...">
    <defs>
        <pattern id="pat-land" x="0" y="0" width="..." height="100%" patternUnits="userSpaceOnUse">
            <image x="0" y="0" xlink:href="../images/land.png" width="..." height="100%"></image>
        </pattern>
    </defs>
    <g>
        <rect class="parallax" x="0" y="0" width="..." height="100%" fill="url(#pat-land)" transform="translate(0,0)"></rect>
    </g>
</svg>
```

표면상으론 전혀 문제가 없는 코드지만 크롬 브라우저에서 이 코드를 실행하면 프레임이 50 이하로 떨어지는 경우도 발생합니다. 이 정도면 육안으로도 화면의 움직임이 매끄럽지 않게 느껴지는 수치입니다.

![](/files/2017-07-26-create-a-game-using-svg/jumping-car.03.png){:width="100%" style="max-width:550px"}

따라서 성능에 영향을 주는 `pattern`을 제거하고 `image` 요소로 대체합니다. `image` 요소는 자동으로 반복할 수 없으므로 두 개의 요소를 이어 붙여 사용합니다(예제: [svg-parallax-test/parallax2](https://uyeong.github.io/svg-parallax-test/parallax2/)).

```javascript
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="...">
    <g>
        <image x="0"   y="0" xlink:href="../images/land.png" width="..." height="100%"></image>
        <image x="..." y="0" xlink:href="../images/land.png" width="..." height="100%"></image>
    </g>
</svg>
```

실행 결과 프레임이 안정적이고 육안으로도 이질감을 느낄 수 없습니다. 이처럼 Pattern을 이용한 SVG 요소를 애니메이션 처리할 때에는 주의가 필요합니다.

![](/files/2017-07-26-create-a-game-using-svg/jumping-car.04.png){:width="100%" style="max-width:550px"}

## 일부 안드로이드 기종에서의 성능 문제

`pattern`을 제거하고 `image`로 대체하면서 Parallax 처리 시 발생한 문제를 해결할 수 있습니다. 하지만 `image`로 대체하더라도 일부 안드로이드 기종에서는 여전히 성능 문제가 발생합니다.

아래 영상처럼 `image` 요소를 Transform 할 경우 프레임이 급격하게 떨어집니다. 이는 크롬 개발자 도구에서도 쉽게 발견하기 힘든데 CPU 성능을 10배 줄여 테스트해도 수치상으로는 크게 차이 나지 않기 때문입니다.

<style>.video-container { position: relative; padding-bottom: 56.25%; padding-top: 30px; height: 0; overflow: hidden; } .video-container iframe, .video-container object, .video-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style>

<div class="video-container"><iframe width="560" height="315" src="https://www.youtube.com/embed/F_-zXf1jb8I?rel=0" frameborder="0" allowfullscreen></iframe></div>

이 처리를 DOM으로 바꿔보면 어떻게 될까. 놀랍게도 큰 차이를 보여줍니다(예제: [svg-parallax-test/parallax3](https://uyeong.github.io/svg-parallax-test/parallax3/)).

<div class="video-container"><iframe width="560" height="315" src="https://www.youtube.com/embed/VXQ1aT79D2s?rel=0" frameborder="0" allowfullscreen></iframe></div>

SVG에 대한 최적화 상황은 브라우저마다 조금씩 다릅니다. DOM은 과거부터 최적화 노력이 많이 이뤄졌지만, SVG는 `pattern` 요소나 다음 절에서 이야기할 리페인팅 문제 등 성능 문제를 일으키는 부분이 아직 남아있습니다.

따라서 충돌 계산처럼 특별히 좌표계 연산이 필요 없는 배경은 DOM으로 옮기고 자동차, 장애물만 SVG로 구현했습니다(예제: [svg-parallax-test/parallax4](https://uyeong.github.io/svg-parallax-test/parallax4/)).



## SVG는 항상 페인트를 발생시킨다

SVG는 이상하게도 `svg` 요소의 크기를 고정하더라도 자식 요소를 변경하면 페인팅이 발생합니다. 아래는 `svg` 요소의 자식 요소인 `rect`의 좌표를 수정하는 예제 코드입니다.

```html
<svg xmlns="http://www.w3.org/2000/svg" width="500px" height="500px" viewBox="0 0 500 500">
   <rect width="500" height="500" x="0" y="0"></rect>
</svg>
<script>
    setTimeout(() => {
        rect.setAttribute('x', '100');
    }, 3000);
</script>
```

![](/files/2017-07-26-create-a-game-using-svg/jumping-car.05.png){:width="100%" style="max-width:550px"}

`svg`는 viewBox로 설정한 사이즈 만큼 내부에 그림을 그립니다. 즉, 내부의 어떠한 그래픽적 변화가 문서에 변화를 일으킬 가능성이 없습니다. 그래서 개인적으로 쉽게 이해가 되지 않는 렌더링 흐름입니다.

그러면 SVG 요소의 크기나 좌표를 바꾸지 않고 색상 또는 투명도를 변경하면 어떨까요. 이번에는 `rect` 요소의 좌표가 아니라 색상을 바꿔봅니다.

```html
<svg xmlns="http://www.w3.org/2000/svg" width="500px" height="500px" viewBox="0 0 500 500">
   <rect width="500" height="500" x="0" y="0"></rect>
</svg>
setTimeout(() => {
    rect.setAttribute('fill', '#ebebeb');
}, 3000);
```

![](/files/2017-07-26-create-a-game-using-svg/jumping-car.06.png){:width="100%" style="max-width:550px"}

그래도 페인트가 발생합니다. 하지만 앞서 진행한 테스트의 페인팅 시간은 수십 마이크로세컨드로 크게 의미가 없어 보입니다. 그래서 현재 서비스 중인 레진코믹스의 메인페이지에 SVG를 넣고 테스트했습니다.

![](/files/2017-07-26-create-a-game-using-svg/jumping-car.07.png){:width="100%" style="max-width:550px"}

페인팅에 0.51ms가 소요됐습니다. 작다고 느낄 수 있지만 페이지 전반적으로 영향을 줄 수 있으며, 애니메이션 처리 중인 SVG라면 성능적 문제를 발생시킬 수 있는 부분입니다.

그래서 `svg` 요소에 `null transforms 핵`을 선언해 문서 상위 레벨까지 페인팅이 전파되지 않도록 합니다. 

```html
<svg xmlns="http://www.w3.org/2000/svg" width="500px" height="500px" viewBox="0 0 500 500" style="transform:translate3d(0,0,0)">
   <rect width="500" height="500" x="0" y="0"></rect>
</svg>
```

또는 아예 `svg` 내부의 요소를 개별로 분리하는 방법도 있습니다(참고: [Doubling SVG FPS Rates at Khan Academy](http://www.crmarsh.com/svg-performance/)).

```html
<svg>
  <circle fill="red" transform="translate(2px, 3px)"></circle>
  <circle fill="blue" transform="scale(2)"></circle>
</svg>
```

```html
<div style="transform:translate(2px, 3px)">
  <svg>
    <circle fill="red"></circle>
  </svg>
</div>
<div style="transform:scale(2)">
  <svg>
    <circle fill="blue"></circle>
  </svg>
</div>
```

## 끝으로

여기까지 SVG를 이용해 게임을 개발하면서 만나게 된 이슈와 해결 방법을 간단히 정리했습니다.

필자는 간단한 게임은 SVG로 만들 수 있고 괜찮은 성능을 보장할 것이라고 기대했습니다. 하지만 현실은 달랐습니다. 이 글에서 다룬 문제 외에도 사파리와 크롬 브라우저의 성능 차이, 자동차를 움직일 때 버벅이는 현상 등 다양한 문제를 해결해야 했습니다. 객체의 개수도 적고 애니메이션도 복잡하지 않은 단순한 게임이었는데 말이죠.

다음 게임은 캔버스로 시작하고자 합니다.


[^Mapping]: 공간(空間)의 한 점에 대(對)하여, 다른 공간(空間) 또는 동일(同一)한 공간(空間)의 한 점(點)을 어떤 일정(一定)한 법칙(法則)에 의(依)하여 대응(對應)시키는 일
