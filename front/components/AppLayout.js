import React, { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { Menu, Input, Row, Col } from "antd";
import styled from "styled-components";

import UserProfile from "./UserProfile";
import LoginForm from "./LoginForm";

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const AppLayout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <div>
        <Menu mode="horizontal">
          <Menu.Item>
            <Link href="/">
              <a>노드버드</a>
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link href="/profile">
              <a>프로필</a>
            </Link>
          </Menu.Item>
          <Menu.Item>
            <SearchInput enterButton />
          </Menu.Item>
          <Menu.Item>
            <Link href="/signup">
              <a>회원가입</a>
            </Link>
          </Menu.Item>
        </Menu>
        {/* gutter란 Column 사이에 간격을 조금 넓혀주는것 */}
        <Row gutter={8}>
          <Col xs={24} md={6}>
            {isLoggedIn ? (
              // 로그인단계: LgoinForm에서 넘겨준 setIsLoggedIn이 true로 넘어오면 UserProfile 컴포넌트로 대체
              // 로그아웃단계: UserProfile에서 넘겨준 setIsLoggedIn이 false로 넘어오면 LgoinForm 컴포넌트로 대체
              <UserProfile setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <LoginForm setIsLoggedIn={setIsLoggedIn} />
            )}
          </Col>
          <Col xs={24} md={12}>
            {children}
          </Col>
          <Col xs={24} md={6}>
            <a
              href="https://www.naver.com"
              target="_blank"
              rel="noreferrer noopner"
            >
              Made by Naver
            </a>
          </Col>
        </Row>
      </div>
    </>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
