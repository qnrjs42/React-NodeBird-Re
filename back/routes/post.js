const express = require("express");

const { isLoggedIn } = require("./middlewares");

const { Post, Image, Comment } = require("../models");

const router = express.Router();

// POST /post
router.post("/", isLoggedIn, async (req, res) => {
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
        },
        {
          model: User, // 게시글 작성자
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
    const comment = await Post.create({
      content: req.body.content,
      PostId: req.params.postId,
    });
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// DELETE /post
router.delete("/", (req, res) => {
  res.json({
    id: 1,
  });
});

module.exports = router;
