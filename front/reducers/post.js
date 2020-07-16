export const initialState = {
         mainPosts: [
           {
             id: 1,
             User: {
               id: 1,
               nickname: "제로초",
             },
             content: "첫 번째 게시글 #해시태그 #익스프레스",
             Images: [
               {
                 src:
                   "https://images.unsplash.com/photo-1593642633279-1796119d5482?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
               },
               {
                 src:
                   "https://images.unsplash.com/photo-1594614271360-0ed9a570ae15?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
               },
               {
                 src:
                   "https://images.unsplash.com/photo-1594761047926-f0bdbadae552?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
               },
             ],
             Comments: [
               {
                 User: {
                   nickname: "nero",
                 },
                 content: "하이하이",
               },
             ],
           },
         ],
         imagePaths: [],
         postAdded: false,
       };

const ADD_POST = 'ADD_POST';

export const addPost = {
    type: ADD_POST,
}

const dummyPost = {
    id: 2,
    content: '더미데이터',
    User: {
        id: 1,
        nickname: '제로초',
    },
    Images: [],
    Comments: [],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
      case ADD_POST:
        return {
            ...state,
            mainPosts: [dummyPost, ...state.mainPosts],
            postAdded: true
        }
    default:
      return state;
  }
};

export default reducer;
