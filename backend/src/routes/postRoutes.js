const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");

// 🔹 Rotas
router.get("/posts", postController.getPosts);
router.post("/posts", postController.createPost);

// 🔥 EXPORT CORRETO
module.exports = router;