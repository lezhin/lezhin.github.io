tech.lezhin.com
===============

> 주의: [GitHub Pages]와 [Jekyll]에 대해서 충분히 숙지할 것.
> 주의: [Collaborating on projects using issues and pull requests](https://help.github.com/categories/collaborating-on-projects-using-issues-and-pull-requests/)을 정독.

### 설치

#### <https://github.com/lezhin/lezhin.github.io> 에 push 권한이 있다면:

1. git fetch or pull or clone
2. [Jekyll] 설치

```console
$ git clone git@github.com:lezhin/lezhin.github.io.git
$ cd lezhin.github.io
$ bundle install
```

#### <https://github.com/lezhin/lezhin.github.io> 에 push 권한이 없다면:

1. <https://github.com/lezhin/lezhin.github.io> 에서 `Fork` 버튼 클릭하고,
2. 포크 저장소 계정(maybe 개인 계정) 선택
3. git fetch or pull or clone
4. 포크 설정 [Configuring a remote for a fork](https://help.github.com/articles/configuring-a-remote-for-a-fork/)
5. 포크 동기화 [Syncing a fork](https://help.github.com/articles/syncing-a-fork/)
6. [Jekyll] 설치

```console
$ git clone git@github.com:YOUR_GITHUB_ACCOUNT/lezhin.github.io.git
$ cd lezhin.github.io
$ git remote add upstream git@github.com:lezhin/lezhin.github.io.git
$ git fetch upstream
$ git checkout master
$ git merge upstream/master
$ bundle install
```

### 실행(로컬)

```
$ bundle exec jekyll serve
$ open http://localhost:4000
```

### 배포(발행)

##### <https://github.com/lezhin/lezhin.github.io> 에 push 권한이 있다면:

```
$ git commit -m '...'
$ git push origin master
````

#### <https://github.com/lezhin/lezhin.github.io> 에 push 권한이 없다면:

1. Fork 동기화 [Syncing a fork](https://help.github.com/articles/syncing-a-fork/)
2. Pull Request 보내기 [Creating a pull request](https://help.github.com/articles/creating-a-pull-request/)

### 새 글 작성

1. `_draft` 디렉토리에 `적당한이름.md` 이름으로 파일을 만들고
2. 글을 마크다운 형식으로 작성
  - [gfm] 문법, [kramdown] 파서, [rouge] 문법강조기 사용

### 글 쓰기

1. `_posts` 디렉토리에 `yyyy-mm-dd-slug.md` 파일로 복사(or 이동).
 - slug: 해당 포스트의 고유 키로 url의 일부로 사용. 왠만하면 특수문자없이 영문자,숫자,-(하이픈),.(점)...만 사용.
 - yyyy,mm,dd: 발행 년,월,일.
 - 참고: 최종적으로 포스트의 url(permalink)는 http://tech.lezhin.com/yyyy/mm/dd/slug/
2. 파일 상단에 [front matter] 작성
 - `---`
 - layout: post # 레이아웃(필수). `page` 레이아웃을 사용하면 목록에 보이지 않는 글을 쓸 수 있음.
 - title: '제목' # 제목(필수).
 - author: `author-name` # 필자(필수).
 - tags: `[tag1,tag2,tag3,...]` # 태그 목록(선택). 왠만하면 특수문자없이 영소문자,숫자,-(하이픈),.(점)...만 사용.
 - date: `YYYY-MM-DD HH:MM:SS` # 발행일(필수)
 - `---`
3. 처음 글을 쓰는 필자이라면 **글쓴이 등록**(필수)
4. 유력한(?) 태그가 새로 등장했다면 **태그 등록**(선택)

### 필자 등록

1. `_authors` 디렉토리에 `author-name.md` 이름으로 필자 정보 파일 추가
 - 참고: 최종적으로 사용자 포스트 목록 페이지의 url은 http://tech.lezhin.com/authors/author-name/
2. 파일 상단에 [front matter] 작성
 - `---`
 - layout: author # 레이아웃(선택).
 - name: `author-name` # post의 author와 매칭(필수). 왠만하면 특수문자없이 영소문자,숫자,-(하이픈),.(점)...만 사용.
 - title: ... # 왠만하면 한글이름 사용( 필수)
 - image: http://... # 프로필 이미지(필수)
 - `---`
3. 내용은 필요없음

### 태그 등록

1. `_tags` 디렉토리에 `tag-name.md` 이름으로 필자 정보 파일 추가
 - 참고: 최종적으로 사용자 포스트 목록 페이지의 url은 http://tech.lezhin.com/tags/tag-name/
2. 파일 상단에 [front matter] 작성
 - `---`
 - layout: tag # 레이아웃(자동)
 - name: `tag-name` # post의 tags 배열의 항목과 매칭(필수). 왠만하면 특수문자없이 영소문자,숫자,-(하이픈),.(점)...만 사용.
 - title: ... # 좀 더 길고 구체적인 설명(필수)
 - image: http://... # 태그 이미지(선택)
 - `---`
3. 내용은 필요없음

---

문의: <tech@lezhin.com>

May the **SOURCE** be with you...

[GitHub Pages]: https://pages.github.com
[Jekyll]: https://jekyllrb.com
[front matter]: https://jekyllrb.com/docs/frontmatter/
[gfm]: https://guides.github.com/features/mastering-markdown/
[kramdown]: http://kramdown.gettalong.org
[rouge]: http://rouge.jneen.net

## License

This software is licensed under the [Apache 2 license](LICENSE.txt), quoted below.

Copyright 2017 LezhinEnt. <http://www.lezhin.com>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this project except in compliance with the License.
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.

