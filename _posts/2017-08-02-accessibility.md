---
title: '모두를 위한 설계. 레진 웹 접근성 가이드라인.'
author: naradesign
date: 2017-08-02
tag: [web,accessibility]
---
<a href="https://github.com/lezhin/accessibility" class="forkme"></a>

레진엔터테인먼트는 글로벌([한국](https://www.lezhin.com/ko/), [일본](https://www.lezhin.com/ja/), [미국](https://www.lezhin.com/en/)) 서비스를 운영하고 있기에 다양한 사람들의 재능과 욕구에 관심이 있습니다. 우리는 웹 접근성에 관심을 기울여 조금 특별한 욕구를 가진 사람들의 문제를 해결하려고 합니다. 소수의 특별한 욕구는 모두의 욕구와 연결되어 있다고 생각하기 때문입니다.

## 조금 특별한 욕구를 가진 사람
[WHO](http://www.who.int/disabilities/world_report/2011/report/en/ "World Helth Organization")는 세계 인구의 15%에 해당하는 사람들이 장애가 있는 것으로 파악하고 있습니다. 그리고 [보건복지부 장애인 실태조사](http://www.mohw.go.kr/front_new/al/sal0301vw.jsp?PAR_MENU_ID=04&MENU_ID=0403&CONT_SEQ=318756&page=1)에 따르면 후천적 장애 발생률은 90% 수준입니다. 이런 통계에 따르면 한 개인이 일생을 살면서 장애인이 되거나 일시적으로 장애를 체험하게 될 확률은 무려 13.5%나 됩니다.

저는 적록 색약입니다. 약한 수준의 장애로 분류할 수 있죠. 채도가 낮은 상태의 적색과 녹색을 쉽게 구별하지 못합니다. 충전 중 적색이었다가 완충이 되면 초록색으로 변하는 LED가 박혀있는 전자제품은 전부 <del>망했으면</del> <ins>개선하면</ins> 좋겠어요. [전 세계 남성의 8%가 색약이고, 여성은 0.5%가 색약입니다.](http://www.colourblindawareness.org/colour-blindness/) 대부분 적록 색약이고 [마크 저커버그도 적록 색약](http://m.inews24.com/view.php?g_serial=745770)입니다. 만화가 이현세 선생님도 적록 색약이고요. 한편 색약인 사람은 빛의 밝고 어두움을 구별하는 능력이 뛰어난 것으로 밝혀져 있어 [저격과 관측에 탁월한 능력](https://cutthecolour.wordpress.com/2014/10/15/snipers-are-no-match-for-the-colour-blind/)을 발휘합니다. 숨어있는 저격수 빨리 찾기 게임을 해 보세요. [위장 사진 1](https://i0.wp.com/static.ijreview.com/wp-content/uploads/2014/10/XKV7h52.jpg?zoom=2), [위장 사진 2](https://i2.wp.com/static.ijreview.com/wp-content/uploads/2014/10/5ZIJi9o.jpg?zoom=2), [위장 사진 3](https://i0.wp.com/static.ijreview.com/wp-content/uploads/2014/10/6ye4CSF.jpg?zoom=2). 색약인 사람이 이길 것입니다.

전맹 시각장애인은 마우스 포인터와 초점을 볼 수 없으므로 키보드만을 사용해서 웹을 탐색합니다. 키보드와 음성 낭독에 의존하지만, 키보드 기능을 정말 잘 다루죠. 그래서 키보드 접근성 문제를 해결하면 시각장애인뿐만 아니라 키보드를 능숙하게 사용하는 사람들의 사용성이 높아집니다. 소수의 특별한 요구사항을 해결하는 것이 모두를 위한 설계와 연결되어 있습니다.

결국, 누구에게나 특별히 다른 측면이 있고 그것을 고려할 때 &quot;**모두를 즐겁게 하라!**&quot;라는 우리의 좌우명에 한 걸음 더 가까워질 수 있다고 믿습니다.

## 도저히 풀 수 없을 것 같은 숙제
웹 접근성을 소개할 때 많이 듣는 질문이 있습니다.
> 1. 장애인이 우리 서비스를 이용해요?
> 2. 매출에 도움이 돼요?
> 3. 시간과 비용이 많이 필요하지 않아요?

이 질문에 대한 제 대답은 다음과 같습니다.

> 1. 이용한다면 기쁠 것 같아요.
> 2. 큰 도움은 안 될 거예요.
> 3. 조금은 그렇죠. 하지만 반환이 있어요.

레진코믹스와 같이 이미지 기반의 콘텐츠를 서비스하는데 웹 접근성을 준수하려고 노력한다는 것은 무모한 도전에 가깝습니다. 왜냐하면, 현재로서는 전맹 시각장애인 고려가 없고 논의조차 쉽지 않기 때문입니다.

하지만 달에 갈 수 없다고 해서 일찌감치 체념할 필요는 없겠지요. 쉬운 문제부터 하나씩 풀어 나아가길 기대합니다. 로켓에 올라탔으니까 금방 갈 수 있지 않을까요?

## W3C 표준을 우리 언어로
W3C에서는 [WCAG 2.1](https://www.w3.org/TR/WCAG21/ "Web Content Accessibility Guidelines 2.1(Working Draft)")이라는 웹 콘텐츠 접근성 지침을 제시하고 있고요. 국내 표준 [KWCAG 2.1](http://www.tta.or.kr/data/ttas_view.jsp?pk_num=TTAK.OT-10.0003%2FR2&rn=1 "Korean Web Content Accessibility Guidelines 2.1") 또한 있습니다. 국내 표준은 W3C 표준에서 중요도가 높은 항목을 우리 언어로 정리한 것이기 때문에 결국 어떤 지침을 선택해서 따르더라도 괜찮습니다.

하지만 표준 문서는 너무 장황하고 전문 용어가 많아 다양한 분야 전문성을 가진 직원들과 함께 보기에는 한계가 있다고 생각했습니다. W3C 표준을 근간으로 하되 비전문가도 15분 정도면 읽고 이해할 수 있을 만큼 정리된 문서가 필요했고 [레진 웹 접근성 가이드라인](https://github.com/lezhin/accessibility) 사내 표준을 제안하고 공개하게 됐습니다.

1. [의미를 전달하고 있는 이미지에 대체 텍스트를 제공한다.](https://github.com/lezhin/accessibility#alt)
2. [전경 콘텐츠와 배경은 4.5:1 이상의 명도 대비를 유지한다.](https://github.com/lezhin/accessibility#contrast)
3. [화면을 400%까지 확대할 수 있다.](https://github.com/lezhin/accessibility#zoom)
4. [키보드만으로 조작할 수 있다.](https://github.com/lezhin/accessibility#keyboard)
5. [사용할 수 있는 충분한 시간을 제공한다.](https://github.com/lezhin/accessibility#time)
6. [발작을 유발하는 콘텐츠를 제공하지 않는다.](https://github.com/lezhin/accessibility#seizure)
7. [반복되는 콘텐츠 블록을 건너뛸 수 있다.](https://github.com/lezhin/accessibility#bypass)
8. [모든 문서의 제목은 고유하고 식별할 수 있다.](https://github.com/lezhin/accessibility#title)
9. [링크 텍스트는 콘텐츠의 목적을 알 수 있다.](https://github.com/lezhin/accessibility#link)
10. [섹션에는 의미있는 마크업과 헤딩이 있다.](https://github.com/lezhin/accessibility#outline)
11. [문서의 휴먼 랭귀지 속성을 제공한다.](https://github.com/lezhin/accessibility#lang)
12. [문맥 변경은 예측할 수 있다.](https://github.com/lezhin/accessibility#predict)
13. [폼 콘트롤 요소에 설명을 제공한다.](https://github.com/lezhin/accessibility#form)
14. [실수를 예방하고 정정하는 것을 돕는다.](https://github.com/lezhin/accessibility#assist)
15. [HTML 문법을 준수한다.](https://github.com/lezhin/accessibility#html)

WCAG 2.1 지침의 1.1.1 항목 예를 들어 볼게요.

> All non-text content that is presented to the user has a text alternative that serves the equivalent purpose, except for the situations listed below.
> 사용자에게 제공되는 모든 텍스트 아닌 콘텐츠는 아래 나열된 상황을 제외하고 같은 목적을 수행하는 대체 텍스트를 제공한다.

원문 표현보다 아래와 같이 다듬은 표현이 좋다고 보는 것이죠.
> 의미를 전달하고 있는 이미지에 대체 텍스트를 제공한다.

물론 사내 지침은 너무 단순하게 표현했기 때문에 지침마다 '부연 설명, 관련 예시, 기대 효과, 관련 표준, 평가 도구' 텍스트와 링크를 간략하게 제공하고 있습니다. 사실상 W3C 표준에 대한 링크 페이지라고 생각해도 괜찮습니다. 사실이 그런걸요.

## 맺음말
레진 웹 접근성 가이드라인은 사내 유관 부서 담당자분들께 공유하고 동의를 얻어 사내 지침으로 결정하고 공개할 수 있게 됐습니다. 긍정적으로 검토해 주신 사우님들 감사합니다.

레진 웹 접근성 가이드라인은 W3C 표준을 요약한 버전에 불과하므로 누구라도 복제([Fork](https://github.com/lezhin/accessibility)), 개선 요청([Pull Requests](https://github.com/lezhin/accessibility/pulls)), 문제 제기([Issues](https://github.com/lezhin/accessibility/issues))할 수 있습니다.

&quot;**Design for all, amuse everyone!**&quot;
