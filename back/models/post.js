module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      content: {
        type: DataTypes.TEXT, // 길이 제한 없음
        allowNull: false, // true: 선택 false: 필수
      },
    },
    {
      charset: "utf8mb4", // mb4는 이모티콘 포함
      collate: "utf8mb4_general_ci", // 이모티콘 저장
    }
  );
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); // 게시글은 유저에게 속해있음 | 게시글의 작성자
    db.Post.belongsToMany(db.Hashtag); // 게시글은 여러 개 해시태그에 속해 있음 (다:다 관계)
    db.Post.hasMany(db.Comment); // 게시글에 여러 개 댓글을 가짐 (1:다 관계)
    db.Post.hasMany(db.Image); // 게시글에 여러 개 이미지를 가짐
    db.Post.belongsToMany(db.User, { throuth: "Like", as: "Likers" }); // 게시글은 좋아요 누른 사람 가져옴 (다:다 관계) | 중간 테이블 이름 지정['Like']
    db.Post.belongsTo(db.Post, { as: "Retweet" }); // 게시글 리트윗
  };

  return Post;
};
