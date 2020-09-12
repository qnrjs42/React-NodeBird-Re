module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    "Image",
    {
      src: {
        type: DataTypes.STRING(200),
        allowNull: false, // true: 선택 false: 필수
      },
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  Image.associate = (db) => {
    db.Image.belongsTo(db.Post); // 이미지는 게시글에 속해 있음
  };

  return Image;
};
