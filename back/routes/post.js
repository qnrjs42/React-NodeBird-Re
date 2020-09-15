const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { isLoggedIn } = require("./middlewares");

const { Post, Image, Comment, User, Hashtag } = require("../models");

const router = express.Router();

try {
  // uploads 폴더가 없으면 생성, 있으면 선택
  fs.accessSync("uploads");
} catch (err) {
  console.log("uploads 폴더가 없으므로 생성합니다.");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads"); // uploads라는 폴더에 저장
    },
    filename(req, file, done) {
      // 똑같은 파일명 방지, 파일명 뒤에 시간 추가
      const ext = path.extname(file.originalname); // 확장자 추출(.png)
      const basename = path.basename(file.originalname, ext); // 파일명 (제로초)
      done(null, basename + "_" + new Date().getTime() + ext); // 제로초15184712891.png
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// POST /post
router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(
          (tag) =>
            // DB에는 소문자로만 저장 (찾기 쉽게)
            Hashtag.findOrCreate({
              where: { name: tag.slice(1).toLowerCase() },
            }) // findOrCreate: 있으면 가져오고 없으면 등록
          // findOrCreate 결과: [[노드, true], [리액트, true]]
        )
      );
      await post.addHashtags(result.map((v) => v[0]));
    }
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        // 이미지를 여러 개 올리면 image: [제로초.png, 부기초.png] 배열식으로 올라간다
        const images = await Promise.all(
          req.body.image.map((image) => Image.create({ src: image }))
        );
        await post.addImages(images);
      } else {
        // 이미지를 하나만 올리면 image: 제로초.png 배열이 아님
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }
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

// upload.array("image")에서 image는 PostForm의 input name="image"
// upload.single('image') | 이미지 1개만 올릴 때
// upload.none() | 텍스트나 json
router.post(
  "/images",
  isLoggedIn,
  upload.array("image"),
  async (req, res, next) => {
    try {
      console.log(req.files);
      res.json(req.files.map((v) => v.filename));
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
);

// GET /post/1
router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(404).send("존재하지 않는 게시글입니다.");
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
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
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
      ],
    });
    res.status(200).json(fullPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// POST /post/1/retweet
router.post("/:postId/retweet", isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [
        {
          model: Post,
          as: "Retweet",
        },
      ],
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }

    // req.user.id === post.UserId : 자기 게시글 리트윗
    // post.Retweet && post.Retweet.UserId === req.user.id : 자기 게시글을 리트윗한 다른 게시글을 다시 자기가 리트윗
    if (
      req.user.id === post.UserId ||
      (post.Retweet && post.Retweet.UserId === req.user.id)
    ) {
      return res.status(403).send("자신의 글은 리트윗할 수 없습니다.");
    }
    // 남의 게시글을 리트윗한 다른 사람의 게시글을 다시 리트윗
    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    // 이미 리트윗한 게시글을 또 리트윗 막음
    if (exPost) {
      return res.status(403).send("이미 리트윗했습니다.");
    }
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: "retweet",
    });
    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
      include: [
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
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
      ],
    });
    res.status(201).json(retweetWithPrevPost);
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
