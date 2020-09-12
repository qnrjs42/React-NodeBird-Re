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
  Post.associate = (db) => {};

  return Post;
};
