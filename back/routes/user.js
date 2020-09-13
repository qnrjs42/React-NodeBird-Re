const express = require("express");
const bcrypt = require("bcrypt");
const { User, Post } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const passport = require("passport");

const router = express.Router();

// POST /user/login
// err: 서버 에러
// user: 성공
// info: 클라이언트 에러
router.post("/login", isNotLoggedIn, (req, res, next) => {
  // middleware에서 next()한 미들웨어는 다음 코드를 실행
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

    // passport/index - serializeUser로 'user' 넘겨줌
    return req.login(user, async (loginErr) => {
      // 로그인하다가 에러나면
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }

      // 비밀번호만 제외한 유저 정보
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        // attributes: ['id', 'nickname', 'email'], // user 테이블에서 id, nickname, email만 가져오기
        attributes: {
          exclude: ["password"], // user 테이블에서 password만 안 가져오기
        },
        include: [
          // 합쳐주기
          {
            model: Post, // 게시글
          },
          {
            model: User, // 팔로잉
            as: "Followings",
          },
          {
            model: User, // 팔로워
            as: "Followers",
          },
        ],
      });

      // 사용자 정보 프론트로 넘겨줌
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

// POST /user
router.post("/", isNotLoggedIn, async (req, res, next) => {
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

router.post("/logout", isLoggedIn, (req, res, next) => {
  req.logOut();
  req.session.destroy();
  res.send("로그아웃 성공");
});

module.exports = router;
