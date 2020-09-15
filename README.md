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

_-------------------------------------------------------------------------------------------------------------------------_

styled-components 태그안에 태그 접근할 때

```javascript
import styled from "styled-components";

const ImgWrapper = styled.div`
  padding: 32px;
  text-align: center;

  & img {
    margin: 0 auto;
    max-height: 750px;
  }
`;

{
  images.map((v) => (
    <ImgWrapper key={v.src}>
      <img src={v.src} alt={v.src} />
    </ImgWrapper>
  ));
}
```

_-------------------------------------------------------------------------------------------------------------------------_

www.regexr.com

게시글 안에서 해시태그 추출하는 방법

```javascript
{
  postData.split(/(#[^\s#]+)/g).map((v, index) => {
    if (v.match(/(#[^\s#]+)/g)) {
      return (
        <Link href={`/hashtag/${v.slice(1)}`} key={index}>
          <a>{v}</a>
        </Link>
      );
    }
    return v;
  });
}
```

//g
-> g가 붙으면 여러개

/#/g
-> 모든 # 선택

/#/
-> 첫 번째 #만 선택

/#./g
-> 모든 #뒤에 첫문자 선택

/#.../g
-> # 뒤에 세문자 선택

/#.+/g
-> #뒤에 모든 문자 선택

/#[해익제]+/g
-> #뒤에 첫문자가 해, 익, 제인 문자 선택

/#[^해익제]+/g
-> #뒤에 첫문자가 해, 익, 제인 문자 제외한 모든 문자 선택

/#[^\s]+/g
-> 공백이 들어간 문자 제거

/#[^\s#]+/g
-> 공백과 #이 들어간 문자 제거
즉, 문자가 '#첫번째 #두번째', '#가나다#라마바'인 경우 #첫번째 #두번째 #가나다 #라마바
이렇게 잘라낼 수 있다

.split(/(#[^\s#]+)/g)
split인 경우 중간에 괄호를 포함시켜줘야 한다

_-------------------------------------------------------------------------------------------------------------------------_

next와 redux-saga

redux-saga
next-redux-saga

제너레이터 함수는 중단점이 있는 함수

```javascript
const gen = function* () {
  console.log(1);
  yield; // 멈춤
  console.log(2);
  yield; // 멈춤
  console.log(3);
  yield; // 멈춤
};
const generator = gen();

generator.next(); // 1 | done: false
generator.next(); // 2 | done: false
generator.next(); // 3 | done: false
generator.next(); // done: true
```

금기 되어있는 무한루프 코드
하지만 제너레이터 함수에서는 중단점이 있어서 유용

```javascript
const gen = function* () {
    let i = 0;
  while (true) {
    yield i++;
  }
};

const generator = gen();

generator.next(); // value: 0, done: false
generator.next(); // value: 1, done: false
generator.next(); // value: 2, done: false
generator.next(); // value: 3, done: false
generator.next(); // value: 4, done: false
...
...

```

```javascript
// pages/_app.js

import withReduxSaga from "next-redux-saga";

export default wrapper.withRedux(withReduxSaga(NodeBird));
```

```javascript
import { all, fork, call, take, put } from "redux-saga/effects";
import axios from "axios";

function logInAPI(data) {
  return axios.post("/api/login", data);
}

function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data);
    // 성공 결과: result.data
    // 실패 결과: err.response.data

    yield put({
      type: "LOG_IN_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: "LOG_IN_FAILURE",
      data: err.response.data,
    });
  }
}

function* watchLogIn() {
  yield take("LOG_IN_REQUEST", logIn);
}

export default function* rootSaga() {
  yield all([fork(watchLogIn)]);
}
```

all([fork(watchLogin), fork(watchLogOut)])
all([]) : 배열에 들어있는 코드를 동시에 실행

fork(watchLogin)
fork() : 파라미터의 함수를 실행 (비동기 함수 호출) 결과 상관없이 다음 코드 실행

call(watchLogin)
call() : 파라미터의 함수를 실행 (동기 함수 호출) 결과를 기다린 후 다음 코드 실행

function\* logIn() {}
yield take('LOG_IN', logIn);
take() : 'LOG_IN'이라는 액션이 실행될 때까지 기다림, 하지만 한 번만 실행하면 끝나버림
액션이 실행되면 logIn이라는 제너레이터 함수 실행

function loginAPI(data) {}
call(loginAPI, action.data) : 이부분만 제너레이터 함수가 아닌 일반 함수 사용
첫 번째 파라미터는 함수
두 번째 파라미터부터는 함수의 매개변수로 전달

put(): dispatch라고 보면 된다

take('LOG_IN_REQUEST', logIn): 일회성 동작
takeEvery('LOG_IN_REQUEST', logIn): 비동기 동작
takeLeading('LOG_IN_REQUEST', logIn): 클릭 실수로 두 번했을 때 처음 클릭만 동작
takeLatest('LOG_IN_REQUEST', logIn): 클릭 실수로 두 번했을 때 마지막 클릭만 동작
throttle('LOG_IN_REQUEST', logIn, 2000): 2초 동안은 한 번만 동작

delay(1000) : 1초 동안 대기, 비동기

# 동작 순서

## 1. 코드 동시 실행

```javascript
yield all([fork(watchLogIn)]);
```

-> all([]) 배열에 있는 코드 동시 실행

## 2. REQUEST 액션 감지

```javascript
function\* watchLogIn() {
    yield take("LOG_IN_REQUEST", logIn);
}
```

-> "LOG_IN_REQUEST"이라는 액션이 실행될 때까지 기다림,
액션이 실행되면 logIn 제너레이터 함수 실행

## 3. logIn 제너레이터 함수 실행

```javascript
function\* logIn(action) {
    try {
        const result = yield call(logInAPI, action.data);
        // 성공 결과: result.data
        // 실패 결과: err.response.data
        yield put({
            type: "LOG_IN_SUCCESS",
            data: result.data,
        });
    } catch (err) {
        yield put({
            type: "LOG_IN_FAILURE",
            data: err.response.data,
        });
    }
}
```

-> action 매개변수는 "LOG_IN_REQUEST"이라는 액션이 실행될 때 같이 보내온 data

## 4. call() 동기적 함수, 서버에 결과 값 받을 때까지 대기

```javascript
const result = yield call(logInAPI, action.data);
```

-> logInAPI이라는 함수를 실행하나 결과 값을 받을 때까지 기다림

## 5. 서버에 로그인 data 전송

```javascript
function logInAPI(data) {
  return axios.post("/api/login", data);
}
```

## 6. 서버에서 데이터를 가져온 결과

    성공 결과: result.data
    실패 결과: err.response.data

## 7. 성공 했을 때

```javascript
yield put({
    type: "LOG_IN_SUCCESS",
    data: result.data,
 });
```

## 8. 실패 했을 때

```javascript
yield put({
    type: "LOG_IN_FAILURE",
    data: err.response.data,
});
```

_-------------------------------------------------------------------------------------------------------------------------_

redux 동작 순서

## 1. components/LoginForm.js

```javascript
dispatch(loginRequestAction(data));
```

## 2. reducers/users.js

```javascript
export const loginRequestAction = (data) => {
  return {
    type: "LOG_IN_REQUEST",
    data,
  };
};
```

## 3. reducer/users.js

```javascript
case "LOG_IN_REQUEST":
return {
  ...state,
  isLoggingIn: true,
};
```

## 4. sagas/user.js

```javascript
function* watchLogIn() {
  yield takeLatest("LOG_IN_REQUEST", logIn);
}
export default function* userSaga() {
  yield all([fork(watchLogIn), fork(watchLogOut)]);
}
```

## 5. sagas/user.js

```javascript
function* logIn(action) {
  yield put({
    type: "LOG_IN_SUCCESS",
    data: action.data,
  });
}
```

## 6. reducers/user.js

```javascript
case "LOG_IN_SUCCESS":
return {
  ...state,
  isLoggingIn: false,
  isLoggedIn: true,
  me: { ...action.data, nickname: "zerocho" },
};
```

_-------------------------------------------------------------------------------------------------------------------------_

더미데이터

shortid : 겹치기 힘든 ID 생성
faker : 가짜 데이터들 생성

```javascript
import shortId from "shortid";
import faker from "faker";

id: shortId.generate();

initialState.mainPosts = initialState.mainPosts.concat(
  Array(20)
    .fill()
    .map(() => ({
      id: shortId.generate(),
      User: {
        id: shortId.generate(),
        nickname: faker.name.findName(),
      },
      content: faker.lorem.paragraph(),
      Images: [
        {
          src: faker.image.image(),
        },
      ],
      Comments: [
        {
          User: {
            id: shortId.generate(),
            nickname: faker.name.findName(),
          },
          content: faker.lorem.sentence(),
        },
      ],
    }))
);
```

_-------------------------------------------------------------------------------------------------------------------------_

reudx 불변성 편하기 지키기

immer

```javascript
// reducers/user.js

import produce from 'immer';

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOG_IN_REQUEST:
        draft.logInLoading = true;
        draft.logInError = null;
        draft.logInDone = false;
        break;

        ...
    }
  });
};
```

_-------------------------------------------------------------------------------------------------------------------------_

## Form return

hooks보다 아래에 return을 써줘야 한다

hooks: useCallback, useMemo

_-------------------------------------------------------------------------------------------------------------------------_

## 반복문안에서 데이터를 넘기고 싶을 때 (고차함수)

반복문안에서 onClick()을 통해 반복문에 대한 데이터 넘겨줘야할 때

```react
// /front/component/FollowList.js

const onCancel = () => () => {
  dispatch({
    type: UNFOLLOW_REQUEST,
  });
};

renderItem={(item) => (
  <List.Item style={{ marginTop: 20 }}>
    <Card
      actions={[
        <StopOutlined key="stop" onClick={onCancel(item.id)} />,
      ]}
    >
      <Card.Meta description={item.nickname} />
    </Card>
  </List.Item>
)}
```

_-------------------------------------------------------------------------------------------------------------------------_

## NEXTjs SSR 적용

```javascript
// /front/pages/_app.js

next-redux-saga 모듈 필요 없어짐
```

있어도 상관 없지만 dependencies 모듈이라 배포할 때 껴서 되기때문에 필요없으니깐 지워주도록 한다.

_-------------------------------------------------------------------------------------------------------------------------_

## Component 렌더링 전에 데이터 로드

화면에 그려지기 전에 먼저 데이터를 불러온다면 데이터가 채워진 채로 화면이 그려진다.

Component보다 먼저 렌더링 실행하는 함수: getInitialProps
하지만 곧 없어질 예정

그 대신 Next 9버전 부터 새로운 함수가 나옴

```javascript
// /front/pages/index.js

import wrapper from "../store/configureStore";

const Home = () => {
  ...

  // getServerSideProps를 사용하게 되면 이 부분에서 useEffect는 안 쓰고 getServerSideProps안에서 사용
  //   useEffect(() => {
  //   dispatch({
  //     type: LOAD_MY_INFO_REQUEST,
  //   });
  //   dispatch({
  //     type: LOAD_POSTS_REQUEST,
  //   });
  // }, []);

  return () {
    ...
  }
};

// getServerSideProps가 Home보다 먼저 실행된다
export const getServerSideProps = wrapper.getServerSideProps((context) => {
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
});

export default Home;
```

context.store 정보가 들어있는 것들을 reducers/index.js - HYDRATE 액션이 실행되면서 정보들을 받는다

```javascript
// /front/reducers/index.js

// 아래 코드는 index - index, user, post로 구성 되어있어서 덮어쓰기에 문제가 발생
// const rootReducer = combineReducers({
//   index: (state = {}, action) => {
//     switch (action.type) {
//       case HYDRATE:
//         console.log("HYDRATE", action);
//         return {
//           ...state,
//           ...action.payload,
//         };

//       default:
//         return state;
//     }
//   },
//   user,
//   post,
// });

// 아래 코드를 해야 rootReducer 상태 전체를 덮어씌울 수 있음
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log("HYDRATE", action);
      return action.payload;
    default: {
      const combineReducer = combineReducers({
        user,
        post,
      });
      return combineReducer(state, action);
    }
  }
};
```
