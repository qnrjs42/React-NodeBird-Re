export const initialState = {
  isLoggedIn: false,
  me: null,
  signUpdata: {},
  loginData: {},
};

export const loginAction = (data) => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(loginRequestAction());

    axios.get('/api/login')
    .then((res) => {
      // 로그인 성공
      dispatch(loginSuccessAction(res.data));
    })
    .catch((err) => {
      // 로그인 실패
      dispatch(loginFailureAction(err))
    })
  }
}

export const loginRequestAction = (data) => {
  return {
    type: "LOG_IN_REQUEST",
    data,
  };
};

export const loginSuccessAction = (data) => {
  return {
    type: "LOG_IN_SUCCESS",
    data,
  };
};

export const loginFailureAction = (data) => {
  return {
    type: "LOG_IN_FAILURE",
    data,
  };
};

// END LOG_IN
/////////////////////////////////////////////////////

export const logoutRequestAction = () => {
  return {
    type: "LOG_OUT_REQUEST",
  };
};

export const logoutSuccessAction = () => {
  return {
    type: "LOG_OUT_SUCCESS",
  };
};

export const logoutFailureAction = () => {
  return {
    type: "LOG_OUT_FAILURE",
  };
};

// END LOG_OUT
/////////////////////////////////////////////////////

const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;

    case "LOG_IN":
      return {
        ...state,
        isLoggedIn: true,
        me: action.data,
      };

    case "LOG_OUT":
      return {
        ...state,
        isLoggedIn: false,
        me: null,
      };
  }
};

export default reducer;
