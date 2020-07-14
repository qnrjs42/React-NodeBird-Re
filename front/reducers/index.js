import { HYDRATE } from "next-redux-wrapper"
import { combineReducers } from 'redux'

import user from './user'
import post from './post'

// 액션을 만들어주는 함수
// const changeNickname = (data) => {
//     return {
//         type: 'CHANGE_NICKNAME',
//         data
//     }
// }
// store.dispatch(changeNickname('boogicho'));

// state : 이전상태(oldData), action : 다음상태(newData)
const rootReducer = combineReducers({
  index: (state = {}, action) => {
    switch (action.type) {
      case HYDRATE:
        console.log("HYDRYTE", HYDRATE);
        return { ...state, ...action.payload };

      default:
        return state;
    }
  },
  user,
  post,
});

export default rootReducer;
