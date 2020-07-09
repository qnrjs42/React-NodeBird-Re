import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Menu, Input, Row, Col } from 'antd'

const AppLayout = ({ children }) => {
  return (
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
          <Input.Search enterButton style={{ verticalAlign: "middle" }} />
        </Menu.Item>

        <Menu.Item>
          <Link href="/signup">
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>

      <Row gutter={8}>
        {/*
            gutter : Column 사이 간격
            xs : 모바일
            sm : 태블릿
            md : 작은 데스크탑
          */}

        <Col xs={24} md={6}>
            왼쪽 메뉴
        </Col>

        <Col xs={24} md={12}>
          {children}
        </Col>
        
        <Col xs={24} md={6}>
            <a href="https://www.naver.com" target="_blank" rel="noreferrer noopner">Made by Naver</a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propType = {
    children: PropTypes.node.isRequired,
}

export default AppLayout;
