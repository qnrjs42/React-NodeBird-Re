module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      // MYSQL에는 users 테이블 생성, id는 기본적으로 들어감
      email: {
        type: DataTypes.STRING(30),
        allowNull: false, // true: 선택 false: 필수
        unique: true, // 고유한 값
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, // true: 선택 false: 필수
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false, // true: 선택 false: 필수
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", // 한글 저장
    }
  );
  User.associate = (db) => {
    db.User.hasMany(db.Post); // 유저가 여러 개 게시글을 가짐
    db.User.hasMany(db.Comment); // 유저가 여러 개 댓글을 가짐
    db.User.belognsToMany(db.Post, { throuth: "Like", as: "Liked" }); // 유저가 게시글 좋아요 (다:다 관계) | 중간 테이블 이름 지정['Like']
    db.User.belognsToMany(db.User, {
      throuth: "Follow",
      as: "Followers",
      foreignKey: "FollowingId",
    }); // 유저가 팔로워 | 팔로잉 유저 찾을 때
    db.User.belognsToMany(db.User, {
      throuth: "Follow",
      as: "Followings",
      foreignKey: "FollowerId",
    }); // 유저가 팔로잉 | 팔로워 유저 찾을 때
  };

  return User;
};
