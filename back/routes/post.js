const express = require("express");

const { isLoggedIn } = require("./middlewares");

const { Post, Image, Comment, User } = require("../models");

const router = express.Router();

// POST /post
router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image, // 게시글에 달린 이미지
        },
        {
          model: Comment, // 게시글에 달린 댓글
          include: [
            {
              model: User, // 댓글의 작성자
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User, // 게시글 작성자
          attributes: ["id", "nickname"],
        },
        {
          model: User, // 좋아요 작성자
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(201).json(fullPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// POST /post/1/comment
router.post("/:postId/comment", isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User, // 댓글의 작성자 정보 가져오기
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullComment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// PATCH /post/1/like
router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    // 게시글이 없는데 좋아요 눌렀을 때
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }
    console.log("여기까진 오나요?");
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// DELETE /post/1/like
router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
  try {
    try {
      const post = await Post.findOne({ where: { id: req.params.postId } });
      // 게시글이 없는데 좋아요 눌렀을 때
      if (!post) {
        return res.status(403).send("게시글이 존재하지 않습니다.");
      }

      await post.removeLikers(req.user.id);
      res.json({ PostId: post.id, UserId: req.user.id });
    } catch (err) {
      console.error(err);
      next(err);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// DELETE /post
router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      where: {
        id: req.params.postId, // 게시글 Id
        UserId: req.user.id, // 내 아이디, 즉 내 아이디로 쓴 게시글이면
      },
    });
    res.json({ PostId: parseInt(req.params.postId, 10) });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
