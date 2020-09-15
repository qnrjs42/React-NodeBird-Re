import { useRouter } from "next/router";
import { END } from "redux-saga";
import axios from "axios";
import { useSelector } from "react-redux";

import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { LOAD_POST_REQUEST } from "../../reducers/post";
import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";
import wrapper from "../../store/configureStore";
import Head from "next/head";

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const { singlePost } = useSelector((state) => state.post);

  return (
    <AppLayout>
      <Head>
        <title>{singlePost.User.nickname}님의 글</title>
        <meta name="description" content={singlePost.content} />
        {/* og는 공유했을 때 미리보기같은 것에 이미지, 게시글 제목이나 설명, 링크 눌렀을 때 가는 주소  */}
        <meta
          property="og:title"
          content={`${singlePost.User.nickname}님의 게시글`}
        />
        <meta property="og:description" content={singlePost.content} />
        <meta
          property="og:image"
          content={
            singlePost.Images[0]
              ? singlePost.Images[0].src
              : "http://localhost:3060/favicon.ico"
          }
        />
        <meta property="og:url" content={`http://localhost:3060/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
  );
};

// getServerSideProps가 Home보다 먼저 실행된다
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    // 쿠키 공유 방지
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }

    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });

    context.store.dispatch({
      type: LOAD_POST_REQUEST,
      data: context.params.id, // router.query의 id와 똑같이 접근이 가능하다
    });

    // REQUEST가 SUCCESS가 될 때까지 기다려줌
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise(); // 해당 코드는 store/configureStore - store.sagaTask = sagaMiddleware.run(rootSaga);
  }
);

export default Post;
