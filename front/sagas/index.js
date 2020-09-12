import { all, fork } from "redux-saga/effects";
import axios from "axios";

import userSaga from "./user";
import postSaga from "./post";

// 요청을 보낼 때 앞에 해당 주소가 붙음
axios.defaults.baseURL = "http://localhost:3065";

export default function* rootSaga() {
  yield all([fork(postSaga), fork(userSaga)]);
}
