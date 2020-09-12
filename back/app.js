const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const db = require("./models");
const postRouter = require("./routes/post");
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
app.use(
  cors({
    origin: true,
    credentials: false,
  })
);
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

app.get("/", (req, res) => {
  res.send("hello express");
});

app.get("/", (req, res) => {
  res.send("hello api");
});

app.get("/posts", (req, res) => {
  res.json([
    {
      id: 1,
      content: "hello",
    },
    {
      id: 2,
      content: "hello2",
    },
    {
      id: 3,
      content: "hello3",
    },
  ]);
});

// /post : 프리픽스로 중복되는 것을 빼냄
app.use("/post", postRouter);
app.use("/user", userRouter);

app.listen(3065, () => {
  console.log("서버 실행 중");
});
