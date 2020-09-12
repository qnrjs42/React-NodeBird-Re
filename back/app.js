const express = require("express");
const db = require("./models");

const postRouter = require("./routes/post");
const userRouter = require("./routes/user");

const app = express();
db.sequelize
  .sync()
  .then(() => {
    console.log("DB 연결 성공");
  })
  .catch(console.error);

// app.use("/post", postRouter); <- 라우터들 보다 코드 먼저 작성
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
