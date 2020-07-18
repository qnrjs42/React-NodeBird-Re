import {
  all,
  fork,
  takeLatest,
  put,
  delay,
} from "redux-saga/effects";


function addPostAPI(data) {
  return axios.post("/api/post", data);
}

function* addPost(action) {
  try {
    yield delay(1000); // 가짜 데이터
    // const result = yield call(addPostAPI, action.data);

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

function* watchAddPost() {
  yield takeLatest("ADD_POST_REQUEST", addPost);
}

export default function* postSaga() {
    yield all([
        fork(watchAddPost)
    ])
}