import { all, fork } from "redux-saga/effects";

import postSaga from './post'
import userSaga from './user'


/*
  redux-sage 실행순서
  1. components/LoginForm.js에서 로그인을 시도 dispatch(loginRequestAction()) 실행
  2. sagas/user.js에서 watchLogIn() { yield takeLatest('LOG_IN_REQUEST' ,logIn)} 실행

  { 
    3. saga와 reducer 동시 실행 (reducer가 먼저 실행 된다)
    3-1. sagas/user.js에서 function* logIn(action {}) 실행
    3-2. reducers/user.js에서 const reducer = () => { case 'LOG_IN_REQUEST'} 실행
  }

  4. sagas/user.js에서 function* logIn(action {
    yield put({
      type: 'LOG_IN_SUCCESS
    })
  }) 실행

  5. reducers/user.js const reducer = () => { case 'LOG_IN_SUCCESS'} 실행

  6. components/AppLoayout.js에서 {me ? <UserProfile /> : <LoginForm />}
  로그인에 성공하면 me가 true가 되어 <UserProfile /> 컴포넌트를 생성한다
*/

export default function* rootSaga() {
  // saga도 코드가 길어져서 나눠줘야한다
    yield all([
        fork(postSaga),
        fork(userSaga),
    ])
}