const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../config/upload");

// 🔐 Rotas protegidas

// 🔹 Listar posts
router.get("/posts", authMiddleware, postController.getPosts);
router.put("/posts/:id", authMiddleware, postController.updatePost);
router.delete("/posts/:id", authMiddleware, postController.deletePost);
router.put("/posts/:id/schedule", authMiddleware, postController.schedulePost);

async function schedulePost(req, res) {
  try {
    const { id } = req.params;
    const { date } = req.body;

    const post = await postService.schedulePost(
      id,
      date,
      req.userId
    );

    res.json(post);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// 🔹 Criar post (com upload)
router.post(
  "/posts",
  authMiddleware,
  upload.single("image"),
  postController.createPost
);

// 🔹 Métricas
router.get("/metrics", authMiddleware, postController.getMetrics);

// 🔹 Aprovar post
router.put(
  "/posts/:id/approve",
  authMiddleware,
  postController.approvePost
);

// 🔹 Rejeitar post
router.put(
  "/posts/:id/reject",
  authMiddleware,
  postController.rejectPost
);

module.exports = router;