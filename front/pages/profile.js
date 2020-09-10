import React, { useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
import { useSelector } from "react-redux";

const Profile = () => {
  const { me } = useSelector((state) => state.user);

  useEffect(() => {
    // 로그인 안 한 채로 내 프로필 페이지 갔을 때 홈으로 이동
    if (!(me && me.id)) {
      Router.push("/");
    }
  }, [me && me.id]);

  if (!me) {
    return null;
  }

  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={me.followings} />
        <FollowList header="팔로워 목록" data={me.followers} />
      </AppLayout>
    </>
  );
};

export default Profile;
