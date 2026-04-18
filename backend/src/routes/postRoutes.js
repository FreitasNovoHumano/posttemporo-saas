const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");

const upload = require("../config/upload");

// 🔐 Rotas protegidas
router.get("/posts", authMiddleware, postController.getPosts);
router.post("/posts", authMiddleware, postController.createPost);
router.post("/posts", upload.single("image"), postController.createPost);

module.exports = router;