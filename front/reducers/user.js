export const initialState = {
  isLoggedIn: false,
  isLoggingIn: false, // 로그인 시도 중    // Logging이면 로딩화면을 띄워주기위한 역할
  isLoggingOut: false, // 로그아웃 시도 중
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

    case "LOG_IN_REQUEST":
      return {
        ...state,
        isLoggingIn: true,
      };

    case "LOG_IN_SUCCESS":
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: true,
        me: { ...action.data, nickname: 'zerocho' },
      };

    case "LOG_IN_FAILURE":
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: false,
      };

    case "LOG_OUT_REQUEST":
      return {
        ...state,
        isLoggingOut: true,
      };

    case "LOG_OUT_SUCCESS":
      return {
        ...state,
        isLoggingOut: false,
        isLoggedIn: false,
        me: null,
      };

    case "LOG_OUT_FAILURE":
      return {
        ...state,
        isLoggingOut: false,
      };
  }
};

export default reducer;
