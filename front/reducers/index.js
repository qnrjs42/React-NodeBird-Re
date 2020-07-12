const initalState = {
    user: {
        isLoggedIn: false,
        user: null,
        signUpdata: {},
        loginData: {},
    },
    post: {
        mainPosts: [],
    }
}

export const loginAction = (data) => {
    return {
        type: 'LOG_IN',
        data
    }
}

export const logoutAction = () => {
  return {
    type: "LOG_OUT",
  };
};


// 액션을 만들어주는 함수
// const changeNickname = (data) => {
//     return {
//         type: 'CHANGE_NICKNAME',
//         data
//     }
// }
// store.dispatch(changeNickname('boogicho'));

// state : 이전상태(oldData), action : 다음상태(newData)
const rootReducer = ((state = initialState, action) => {
    switch (action.type) {
      case "LOG_IN":
        return {
          ...state,
          user: {
            ...state.user,
            isLoggedIn: true,
            user: action.data,
          },
        };

      case "LOG_OUT":
        return {
          ...state,
          user: {
            ...state.user,
            isLoggedIn: false,
            user: null,
          },
        };
    }
})

export default rootReducer