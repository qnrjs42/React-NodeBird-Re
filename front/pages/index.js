import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import AppLayout from "../components/AppLayout";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { LOAD_POSTS_REQUEST } from "../reducers/post";

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state) => state.post
  );

  useEffect(() => {
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []);

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
          dispatch({
            type: LOAD_POSTS_REQUEST,
          });
        }
      }
    }
    window.addEventListener("scroll", onScroll);

    return () => {
      // remove 하지 않으면 add한게 계속 메모리에 쌓임
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePosts]);

  return (
    <AppLayout>
      {me && <PostForm />} {/* 로그인한 사람만 보임 */}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

export default Home;
