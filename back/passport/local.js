const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcrypt");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // req.body.email
        passwordField: "password", // req.body.password
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            where: { email },
          });
          // 기존에 유저가 없다면
          if (!user) {
            // 첫 번째 파라미터: 서버 에러
            // 두 번째 파라미터: 성공
            // 세 번째 파라미터: 클라이언트 에러
            return done(null, false, {
              reason: "존재하지 않는 이메일입니다. ",
            });
          }
          const result = await bcrypt.compare(password, user.password);

          // 유저가 있으면
          if (result) {
            return done(null, user);
          }
          // 비밀번호 틀렸을 때
          return done(null, false, { reason: "비밀번호가 틀렸습니다. " });
        } catch (err) {
          console.error(err);
          return done(err);
        }
      }
    )
  );
};
