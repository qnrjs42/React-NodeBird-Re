const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

const db = require("./models");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const passportConfig = require("./passport");
const passport = require("passport");

dotenv.config();
const app = express();
db.sequelize
  .sync()
  .then(() => {
    console.log("DB 연결 성공");
  })
  .catch(console.error);

// app.use("/post", postRouter); <- 라우터들 보다 코드 먼저 작성
passportConfig();
app.use(morgan("dev"));
app.use(
  cors({
    origin: true, // cors 에러 해결
    credentials: true, // cors 쿠키도 같이 전송
  })
);
app.use("/", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// /post : 프리픽스로 중복되는 것을 빼냄
app.use("/posts", postsRouter); // 여러개 단위 (게시글 불러오기)
app.use("/post", postRouter); // 1개 단위, (게시글 생성, 삭제, 댓글 생성, 삭제)
app.use("/user", userRouter);

// 에러 처리 미들웨어
// app.use((err, req, res, next) => {

// });

app.listen(3065, () => {
  console.log("서버 실행 중");
});
