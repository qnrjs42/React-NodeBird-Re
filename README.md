SSR 방식

브라우저 (Blog 페이지 요청) -> 프론트 서버 (post 요청) -> 백엔드 서버 (실제 데이터 요청) -> 데이터베이스
데이터베이스 (실제 데이터 전달)-> 백엔드 서버 (post 전달) -> 프론트 서버 (Blog 페이지 전달) -> 브라우저

_-------------------------------------------------------------------------------------------------------------------------_

SPA[Single Page Application] (CSR) 방식

브라우저 -> 프론트 서버 (어떤 페이지를 요청하던 그 페이지의 HTML, CSS, JS, IMG정도만 전달) -> 브라우저 (화면은 그려지나 데이터가 없음)
한 번더 요청을 보냄 브라우저 -> 백엔드 서버 (post) -> 데이터베이스 -> 백엔드 서버 -> 브라우저

SSR과 코드 스플릿은 무조건 적용시키는게 좋다
검색 엔진 노출, 최적화
적용할 필요 없는 페이지 -> admin 페이지

_-------------------------------------------------------------------------------------------------------------------------_

브라우저 - 백엔드 서버 간에 CORS 설정 해줘야 한다

_-------------------------------------------------------------------------------------------------------------------------_

Next는 기본적으로 Webpack 내장되어 있음
CSS 파일을 보는 순간 스타일태그를 HTML로 넣어준다

모든 페이지에 적용시킬 때 pages/\_app.js 파일에 코드 작성

import "antd/dist/antd.css";

pages/\_app.js의 { Component }는 pages 파일들의(index, profile, signup 등등) 부모라고 생각하면 된다

_-------------------------------------------------------------------------------------------------------------------------_

반응형 디자인할 때 작은거 -> 큰거 순으로 개발
모바일 -> 데스크탑순

_-------------------------------------------------------------------------------------------------------------------------_

```javascript
<a href="https://www.naver.com" target="_blank" rel="noreferrer noopner">
  Made by Naver
</a>
```

rel="noreferrer noopner" 는 보안 위협 제거 해준다

_-------------------------------------------------------------------------------------------------------------------------_

컴포넌트에 props로 넘겨주는 함수는 useCallback을 꼭 써야 최적화가 된다

const onSubmitForm = useCallback(() => {

}, []);

```javascript
<Form onFinish={onSubmitForm}>...</Form>
```

_-------------------------------------------------------------------------------------------------------------------------_

```javascript
<div style={{ marginTop: "10px" }}>
```

이런식으로 코딩하면 리렌더링 될 때마다 페이지 return()함수가 실행되는데
{} === {} : false이기 때문에 이전 버전이랑 검사하면서 바뀐 부분만 리렌더링하는데 저 부분을 바뀐게 없어도 리렌더링해버린다

그래서 쓰는데 styled-components

_-------------------------------------------------------------------------------------------------------------------------_

useCallback: 함수 캐싱
useMemo: 값 캐싱

```javascript
const onChangeId = useCallback((e) => {
  setId(e.target.value);
}, []);

const style = useMemo(
  () => ({
    marginTop: 10,
  }),
  []
);
```

_-------------------------------------------------------------------------------------------------------------------------_

### next와 redux

next-redux-wrapper
redux
react-redux
redux-devtools-extension

```javascript
/_ React에서의 코드
<Provider store={store}>
_/ Next에서는 해당 코드 작성하지 않아도 됨
```

redux 코드 중에
...state는 바뀌지 않는 데이터는 참조관계로 남고,
바뀌는 데이터만 새롭게 만들어낸다 그러므로 메모리 성능에 효과적

```javascript
{
    ...state,   // 바뀌지 않는 데이터는 재사용
    name: action.data, // 바뀐 데이터는 새로 만듦
}
```

배포 모드에서는 히스토리 모드가 필요없어서 메모리 정리는 계속 하기 때문에 메모리 문제가 일어나지 않는다

_-------------------------------------------------------------------------------------------------------------------------_

```javascript
{mainPosts.map((post, index) => <PostCard key={index} post={post} />}
// 게시글이 지워질 가능성이 있을 경우나 중간에 추가, 순서가 달라질 수 있을 때에도 key에 index를 쓰면 안 된다
// 다만 반복문이 있고 바뀔 가능성이 없을 때 key를 index로 사용해도 된다
```

그리고 배열 안에 JSX(컴포넌트, <PostCard>처럼)안에 key를 줘야한다

_-------------------------------------------------------------------------------------------------------------------------_

```javascript
import { useRef } from 'react;
useRef(); // 실제 DOM에 접근하기 위해 사용
```

_-------------------------------------------------------------------------------------------------------------------------_

PropTypes 객체 상세하게 정의해줄 때 PropTypes.shape() 사용

```javascript
PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createAt: PropTypes.object,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};
```

_-------------------------------------------------------------------------------------------------------------------------_

옵셔널 체이닝 (optional chaining)

```javascript
const id = me?.id;

const id = useSelector((state) => state.user.me?.id);
```

풀어서 쓰면

```javascript
const id = me && me.id;

const id = useSelector((state) => state.user.me && state.user.me.id);
```

_-------------------------------------------------------------------------------------------------------------------------_

True -> False
False -> True 만드는 코드는 아래처럼 작성하자

```javascript
const [liked, setLiked] = useState(false);

const onToggleLike = useCallback(() => {
  setLiked((prev) => !prev);
}, []);
```

prev는 liked의 이전 데이터가 담겨져 있다
