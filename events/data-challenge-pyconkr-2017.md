---
title: 레진 데이터 챌린지 2017
---

> [레진코믹스](https://www.lezhin.com/)의 실 서비스에서 추출한 데이터 **65만여건**을 공개합니다!

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
* [테스트셋 다운로드 (label 포함)](https://storage.googleapis.com/lz-insight/pycon17/dataset/lezhin_dataset_v2_test.tsv.gz)
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


## 이벤트 참여자 분들

부족한 이벤트에 많은 분들이 참여해주셨습니다. 총 14분이며 누락되거나 score가 잘못되었다면 리포트 부탁드립니다. [label 포함된 테스트셋](https://storage.googleapis.com/lz-insight/pycon17/dataset/lezhin_dataset_v2_test.tsv.gz) 으로 측정했고 별도로 첨부해주신 분은 그 값으로 score를 계산하였습니다. 두번 제출하셨거나 github 코드가 변경된 분들은 가장 높은 값으로 측정했습니다.

| 성함 | 레파지토리 주소 및 첨부파일 | roc_auc_score | 설명 |
|-----|-----|-----|-----|
| 서상현님 | [Github Repo](https://github.com/sanxiyn/lezhin-data-challenge-2017) | 0.934052999709 |
| 솔리드웨어 | | 0.904481809408 | |
| 김지중님 | [Download Link](https://storage.googleapis.com/lz-insight/pycon17/submissions/jj.kim.zip) | 0.901190532396 | |
| 이상복님 | [Github Repo](https://github.com/echo304/lezhin_data) | 0.897325135346 | |
| 신동렬님 | [Github Repo](https://github.com/SDRLurker/lezhin) | 0.883003050991 | |
| 김성준님 | [Github Repo](https://github.com/withsmilo/lezhin_data_challenge_pyconkr_2017) | 0.879918317131 | |
| 강석천님 | [Download Link](https://storage.googleapis.com/lz-insight/pycon17/submissions/SukChenKang_main.py) | 0.83873685657 | |
| 전영호님 | [Github Repo](https://github.com/ForwardYH/Lezin-Data-Challenge) | 0.823087997728 | |
| John Smith님 | [Github Repo](https://github.com/addjohn/lz-recomm) | 0.721543462361 | |
| 김형준님 | [Github Gist](https://gist.github.com/soeque1/0646dd87367be56c5fa6e025a2e0d422) | |
| 장지수님 | [Github Repo](https://github.com/simonjisu/regincomics_data) | |
| 권경모님 | [Github Gist](https://gist.github.com/kkweon/060ca222250f50d87b53521d874aca49) | | 오류 데이터셋 기준 코드 |
| 신짱님 | [Github Repo](https://github.com/ShinJJang/lezhin-data-challenge) | | 오류 데이터셋 기준 코드 |
| 문상환님 | [Github Gist](https://gist.github.com/cynthia/eeda698121dfd120819bd6ca18472411) | | 오류 데이터셋 기준 코드 |

