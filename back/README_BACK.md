프론트 서버에 1초에 1000개의 요청
백엔드 서버에 1초에 10개의 요청
비대칭적으로 요청올 때 서버는 자원 부족으로 펑 터짐 이런 상황을 대비하기 위해 스케일링을 해준다

스케일링이란
서버 자원을 복사해서 늘리는것

하지만 프론트 서버에만 요청이 많고 백엔드 서버엔 요청이 적으면 자원 낭비 발생

그래서 처음부터 컴퓨터는 두 대로 나눈다
작은 컴퓨터 두 대가 큰 컴퓨터 한대보다 싸다

프론트 서버 요청이 많으면 프론트 서버를 늘리고
백엔드 서버 요청이 많으면 백엔드 서버를 늘리는 식으로 자원을 효율적으로 사용

_-------------------------------------------------------------------------------------------------------------------------_

## 자주쓰는 express 명령어

const express = require('express');
const app = express();

app.get -> 게시글이나 사용자 정보 가져오기
app.post -> 생성
app.put -> 전체 수정
app.delete -> 제거
app.patch -> 부분 수정
app.options -> 찔러보기(서버에게 요청 보낼 수 있는지 확인, 요청 보내면 서버가 받을 수 있는지)
app.head -> 헤더만 가져오기

_-------------------------------------------------------------------------------------------------------------------------_

## Node에서는 import대신 require를 사용

프론트에서는 webpack 사용하기 때문에 import -> require가 된다
백엔드에서는 webpack을 사용하지 않기 때문에 그냥 require를 사용

_-------------------------------------------------------------------------------------------------------------------------_

## 라우터 분리 방법

```javascript
// /back/app.js

const express = require("express");
const postRouter = require("./routes/post");
const app = express();

// /post : 프리픽스로 중복되는 것을 빼냄
app.use("/post", postRouter);

app.listen(3065, () => {
  console.log("서버 실행 중");
});
```

```javascript
// /back/routes/post.js

const express = require("express");

const router = express.Router();

// POST /post
router.post("/", (req, res) => {
  res.json({
    id: 1,
    content: "hello",
  });
});

// DELETE /post
router.delete("/", (req, res) => {
  res.json({
    id: 1,
  });
});

module.exports = router;
```

_-------------------------------------------------------------------------------------------------------------------------_

## node와 mysql

mysql2
sequelize
sequelize-cli

npx sequelize init

config/config.json

```json
{
  "development": {
    // 개발용 DB
    "username": "root",
    "password": "1234",
    "database": "react-nodebird-re",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    // 테스트용 DB
    "username": "root",
    "password": null,
    "database": "react-nodebird-re",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    // 배포용 DB
    "username": "root",
    "password": null,
    "database": "react-nodebird-re",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

npx sequelize db:create

_-------------------------------------------------------------------------------------------------------------------------_

## DB 관계

db.User.hasMany(db.Post); // 유저가 여러 개 게시글을 가짐 (1:다 관계)
db.Post.belongsTo(db.User); // 게시글은 유저에게 속해있음

db.Post.belongsToMany(db.Hashtag); // 게시글은 여러 개 해시태그에 속해 있음 (다:다 관계)
db.Hashtag.belongsToMany(db.Post); // 해시태그는 여러 개 게시글에 속해 있음 (다:다 관계)

1번 게시글: #노드 #리액트
2번 게시글: #노드 #익스프레스
3번 게시글: #뷰 #노드 #리액트

1번 해시: 노드
2번 해시: 리액트
3번 해시: 익스프레스
4번 해시: 뷰

다:다 관계일 때 중간 테이블이 생긴다

PostId: 1 - HashtagId: 1
PostId: 1 - HashtagId: 2
PostId: 2 - HashtagId: 1
PostId: 2 - HashtagId: 3
PostId: 3 - HashtagId: 4
PostId: 3 - HashtagId: 1
PostId: 3 - HashtagId: 2

_-------------------------------------------------------------------------------------------------------------------------_

## HTTP 상태 코드

200: 성공
300: 리다이렉트
400: 클라이언트 에러
500: 서버 에러

next(err); : 500 / 서버 에러

_-------------------------------------------------------------------------------------------------------------------------_

## CORS 문제

브라우저(3060 port) - 프론트서버(3060 port) : CORS 문제 없음

브라우저(3060 port) - 백엔드서버(3065 port) : CORS 에러

프론트서버(3060 port) - 백엔드서버(3065 port): CORS 문제 없음

1. 서버에서 헤더 추가

```javascript
// /back/routes/user.js
res.setHeader("Access-Control-Allow-Origin", "http://localhost:3060");
```

2. cors 모듈

```javascript
// /back/app.js
const cors = require("cors");

app.use(
  cors({
    origin: true, // '*'나 true로 해준다
  })
);
```

_-------------------------------------------------------------------------------------------------------------------------_

## passport

네이버, 카카오, 깃허브 등등 Oauth를 이용한 로그인

passport
passport-local : 자신이 만든 로그인

구조분해 이름 바꾸는 방법
const { Strategy: LocalStrategy } = require('passport-local');

_-------------------------------------------------------------------------------------------------------------------------_
