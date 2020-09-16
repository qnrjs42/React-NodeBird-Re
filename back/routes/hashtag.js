const express = require("express");
const { Op } = require("sequelize");

const { Post, Hashtag, Image, Comment, User } = require("../models");
const router = express.Router();

// GET /hashtag/노드
router.get("/:hashtag", async (req, res, next) => {
  try {
    const where = {};

    if (parseInt(req.query.lastId, 10)) {
      // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; // id가 lastId보다 작은 조건
    }
    const posts = await Post.findAll({
      // limit과 offset은 게시글 중간에 추가, 삭제 문제로 사용하지 않는다
      where,
      limit: 10, // 10개씩 불러오기
      //   offset: 0, // 0번 게시글부터 9번게시글까지(시작 범위)
      order: [
        // 최신순으로 정렬
        ["createdAt", "DESC"],
      ],
      include: [
        {
          model: Hashtag,
          where: {
            name: decodeURIComponent(req.params.hashtag),
          },
        },
        {
          model: User, // 작성자 정보
          attributes: ["id", "nickname"], // id, nickname만 가져옴
        },
        {
          model: Image, // 게시글의 이미지
        },
        {
          model: Comment, // 게시글의 댓글
          include: [
            {
              model: User, // 댓글의 작성자
              attributes: ["id", "nickname"], // id, nickname만 가져옴
              order: [["createdAt", "DESC"]],
            },
          ],
        },
        {
          model: User, // 좋아요 작성자
          as: "Likers",
          attributes: ["id"],
        },
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
