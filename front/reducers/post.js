export const initialState = {
  mainPosts: [],
};

const reducer = (state = initialState, action) => {
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

    default:
      return state;
  }
};

export default reducer;
