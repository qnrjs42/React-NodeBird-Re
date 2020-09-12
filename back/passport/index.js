const passport = require("passport");
const local = require("./local");
const { User } = require("../models");

// 첫 번째 파라미터: 서버 에러
// 첫 번째 파라미터: 성공
// 첫 번째 파라미터: 클라이언트 에러
// done(null, user.id, { reason: '입력한 정보가 올바르지 않습니다.'})

module.exports = () => {
  passport.serializeUser((user, done) => {
    // 유저 정보 중에 쿠키랑 묶어줄 id를 저장
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      // 위에 id를 통해서 유저 정보를 가져옴
      const user = await User.findOne({ where: { id } });
      done(null, user); // req.user로 정보 보냄 (req.user에 내 정보가 들어있다)
    } catch (err) {
      console.error(err);
      done(err);
    }
  });

  local();
};
