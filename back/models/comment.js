module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
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
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User); // 댓글은 유저에게 속해있음
    db.Comment.belongsTo(db.Post); // 댓글은 게시글에 속해있음
  };

  return Comment;
};
