const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const passport = require("passport");

const router = express.Router();

// POST /user/login
// err: 서버 에러
// user: 성공
// info: 클라이언트 에러
router.post("/login", (req, res, next) => {
  // passport/local에서 받아옴
  // 미들웨어 확장
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }

    return req.login(user, async (loginErr) => {
      // 로그인하다가 에러나면
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      // 사용자 정보 프론트로 넘겨줌
      return res.json(user);
    });
  })(req, res, next);
});

// POST /user
router.post("/", async (req, res, next) => {
  try {
    // DB에 이메일 중복 검사
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다.");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });

    return res.status(201).send("ok");
  } catch (err) {
    console.error(err);
    next(err); // next()는 status 500 에러가 발생하면 서버가 브라우저에게 이런 에러가 발생했다고 알림
  }
});

module.exports = router;
