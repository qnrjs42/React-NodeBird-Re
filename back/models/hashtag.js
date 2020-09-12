module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define(
    "Hashtag",
    {
      name: {
        type: DataTypes.STRING(20),
        allowNull: false, // true: 선택 false: 필수
      },
    },
    {
      charset: "utf8mb4", // mb4는 이모티콘 포함
      collate: "utf8mb4_general_ci", // 이모티콘 저장
    }
  );
  Hashtag.associate = (db) => {
    db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" }); // 해시태그는 여러 개 게시글에 속해 있음 (다:다 관계)
  };

  return Hashtag;
};
