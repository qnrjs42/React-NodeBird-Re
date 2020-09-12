const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");

const router = express.Router();

// POST /user
router.post("/", async (req, res, next) => {
  try {
    // DB에 이메일 중복 검사
    await User.findOne({
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
