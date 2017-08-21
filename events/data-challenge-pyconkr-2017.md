---
title: 레진 데이터 챌린지 2017
---

> [레진코믹스](https://www.lezhin.com/)의 실 서비스에서 추출한 데이터 **65만여건**을 공개합니다!

{% include figure.html src="/assets/img/lezhin_trans_128x128.png" class="noborder" %}

## 목표

TL;DR 공개된 데이터셋을 활용하여, **구매 예측 모델**을 만들어주세요.

## 데이터셋

[레진코믹스](https://www.lezhin.com/)의 실 서비스에서 추출한
유료 에피소드 구매 데이터입니다.

* 파일 포맷: TSV
* 파일 용량: 228M (압축해서 26M)
* 샘플 수: 650,965 건
* feature 수:  167 개
  - 1 : label 해당 유저가 목록에 진입하고 1시간 이내에 구매했는지 여부
  - 2 : 사용 플랫폼 A
  - 3 : 사용 플랫폼 B
  - 4 : 사용 플랫폼 C
  - 5 : 사용 플랫폼 D
  - 6 : 목록 진입시점 방문 총 세션 수 (범위별로 부여된 순차 ID)
  - 7 : 작품을 나타내는 해쉬
  - 8-10 : 개인정보
  - 11-110 :  주요 작품 구매 여부
  - 111 :  작품 태그 정보
  - 112 :  구매할 때 필요한 코인
  - 113 :  완결 여부
  - 114-123 : 스케쥴 정보
  - 124-141 : 장르 정보
  - 142 : 해당 작품의 마지막 에피소드 발행 시점 (범위별로 부여된 순차 ID)
  - 143 : 단행본 여부
  - 144 : 작품 발행 시점 (범위별로 부여된 순차 ID)
  - 145 : 총 발행 에피소드 수 (범위별로 부여된 순차 ID)
  - 146-151 : 작품 태그 정보
  - 152-167 : 유저의 성향 정보 (과거에 구매를 했을 때만 기록)
* [데이터셋 다운로드](https://storage.googleapis.com/lz-insight/pycon17/dataset/lezhin_dataset_v2_training.tsv.gz)
* 참고: [페이스북 Python Korea 그룹 게시물](https://www.facebook.com/groups/pythonkorea/permalink/1444964602253363/)

> 이 데이터셋의 사용은 레진 데이터 챌린지 2017 이벤트로 제한됩니다.
> (이벤트 종료 후 데이터셋을 보강하여 완전 공개할 예정입니다.)

## 평가

* [테스트셋 다운로드](https://storage.googleapis.com/lz-insight/pycon17/dataset/lezhin_dataset_v2_test_without_label.tsv.gz)
* roc auc score

## 제출 방법

* 작성된 소스코드(또는 소스코드 저장소의 주소)를 [data@lezhin.com](mailto:data@lezhin.com)으로 보내주세요.
* 제출 마감: 2017년 8월 31일

> 제출된 모든 코드의 저작권 작성자 본인에게 있습니다.

## 심사 및 결과 발표

* 입상자에게 개별 통보 후, [기술 블로그](http://tech.lezhin.com)를 통해서 심사 결과를 공개할 예정입니다.
* 결과 발표: 2017년 9월 11일

## 상품

1. 돈주고도 못 사는 [**읭읭이 등신대 롱쿠션**](http://teampresent.net/tp/archives/351)(a.k.a. 다키마쿠라) x 1명
2. 요즘 핫한 그 만화 [**그다이 단행본 전5권 세트**](http://www.yes24.com/24/goods/43950133) x 1명
3. 레진코믹스가 출간한 단행본 만화책(랜덤) x O명
4. 레진코믹스의 데이터팀에서 함께 일할 수 있는 기회!!!

> 제품 수급 상황에 따라 더 좋은 상품으로 교체될 수 있습니다.

