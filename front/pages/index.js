import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { END } from "redux-saga";

import AppLayout from "../components/AppLayout";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const {
    mainPosts,
    hasMorePosts,
    loadPostsLoading,
    retweetError,
  } = useSelector((state) => state.post);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    function onScroll() {
      // console.log(
      //   window.scrollY, // 현재 스크롤 위치(얼마나 내렸는지)
      //   document.documentElement.clientHeight, // 화면이 보이는 길이
      //   document.documentElement.scrollHeight // 총 길이
      // );

      // 화면 끝까지 내리면 LOAD_POSTS
      if (
        window.scrollY + document.documentElement.clientHeight >=
        document.documentElement.scrollHeight - 600
      ) {
        // 로딩이 되고 있을 때는 실행이 안 되게 막음
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }
    window.addEventListener("scroll", onScroll);

    return () => {
      // remove 하지 않으면 add한게 계속 메모리에 쌓임
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, mainPosts]);

  return (
    <AppLayout>
      {me && <PostForm />} {/* 로그인한 사람만 보임 */}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

// getServerSideProps가 Home보다 먼저 실행된다
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    console.log("context", context);

    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });

    // REQUEST가 SUCCESS가 될 때까지 기다려줌
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise(); // 해당 코드는 store/configureStore - store.sagaTask = sagaMiddleware.run(rootSaga);
  }
);

export default Home;
