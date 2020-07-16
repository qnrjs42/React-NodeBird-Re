import { all, fork, take, call, put } from "redux-saga/effects";
import axios from 'axios'

function loginAPI(data) {
    return axios.post('/api/login', data)
}

function* logIn(action) {
    try {
        const result = yield call(loginAPI, action.data);

        yield put({
            type: 'LOG_IN_SUCCESS',
            data: result.data
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
    const result = yield call(logOutAPI);

    yield put({
      type: "LOG_OUT_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: "LOG_OUT_FAILURE",
      data: err.response.data,
    });
  }
}

function addPostAPI(data) {
  return axios.post("/api/post", data);
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);

    yield put({
      type: "ADD_POST_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: "ADD_POST_FAILURE",
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
*/

function* watchLogin() {
    yield take('LOG_IN_REQUEST', logIn);
}

function* watchLogOut() {
  yield take("LOG_OUT_REQUEST", logOut);
}

function* watchAddPost() {
  yield take("ADD_POST_REQUEST", addPost);
}

export default function* rootSaga() {
    yield all([
        fork(watchLogin),
        fork(watchLogOut),
        fork(watchAddPost),
    ])
}