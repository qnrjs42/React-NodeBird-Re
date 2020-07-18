import {
  all,
  fork,
  takeLatest,
  put,
  delay,
} from "redux-saga/effects";

function loginAPI(data) {
    return axios.post('/api/login', data)
}

function* logIn(action) {
    try {
      yield delay(1000); // 가짜 데이터
        // const result = yield call(loginAPI, action.data); // 아직 서버가 없어서 요청을 못 보냄

        yield put({
            type: 'LOG_IN_SUCCESS',
            data: action.data
        });
    }
    catch(err) {
        yield put({
            type: 'LOG_IN_FAILURE',
            data: err.response.data
        })
    }
}

function logOutAPI() {
  return axios.post("/api/logout");
}

function* logOut() {
  try {
    yield delay(1000); // 가짜 데이터
    // const result = yield call(logOutAPI);

    yield put({
      type: "LOG_OUT_SUCCESS",
    });
  } catch (err) {
    yield put({
      type: "LOG_OUT_FAILURE",
      data: err.response.data,
    });
  }
}

/*
    watchLogin() - 'LOG_IN_REQUEST' action 들어오면, logIn() - 함수 실행
    logIn() - logInAPI() 실행
    saga에서는 이벤트리스너 느낌

    fork : 비동기 함수 호출 // fork(loginAPI) -> loginAPI 요청 보내놓고 return 상관 없이 다음 명령 진행
    call : 동기 함수 호출 // call(loginAPI) -> loginAPI가 return할 때 까지 기다림

    제너럴 함수의 단점은 한 번 실행하고 함수를 없애버린다
    그래서 yield takeEvery()를 사용 (이게 while(true) 무한 반복문과 동일함)

    takeLatest() -> 실수로 두 번 로그인 눌렀을 때 마지막 이벤트만 실행한다(앞에 이벤트는 무시)
    단점: 프론트에서 두 번 요청했을 때 서버는 응답을 한 번 보낸다
    즉, 요청은 여러 번 보내지만 응답은 하나만 온다
    해결방법: 서버에서 중복된 데이터 검증한다
    보통은 takeLatest 많이 사용

    throttle( , , 2000) -> 2초동안 요청을 한 번만 보내도록한다
*/

function* watchLogin() {
    yield takeLatest('LOG_IN_REQUEST', logIn);
}

function* watchLogOut() {
  yield takeLatest("LOG_OUT_REQUEST", logOut);
}

export default function* userSaga() {
    yield all([
        fork(watchLogin),
        fork(watchLogOut),
    ])
}