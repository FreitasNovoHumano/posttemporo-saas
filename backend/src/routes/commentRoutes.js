const express = require("express");
const router = express.Router();

const commentService = require("../services/commentService");
const auth = require("../middlewares/authMiddleware");

router.post("/comments", auth, async (req, res) => {
  const { postId, content } = req.body;

  const comment = await commentService.createComment(
    postId,
    content,
    req.userId
  );

  res.json(comment);
});

router.get("/comments/:postId", auth, async (req, res) => {
  const comments = await commentService.getComments(req.params.postId);
  res.json(comments);
});

module.exports = router;