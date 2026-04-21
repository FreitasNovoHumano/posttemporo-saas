const express = require("express");
const router = express.Router();

const commentService = require("../services/commentService");

const auth = require("../middlewares/authMiddleware");
const company = require("../middlewares/companyMiddleware");
const role = require("../middlewares/roleMiddleware");

/**
 * =====================================================
 * 💬 COMMENT ROUTES (MULTI-TENANT)
 * =====================================================
 */

/**
 * 🔹 Criar comentário
 */
router.post(
  "/comments",
  auth,
  company,
  role("ADMIN", "EDITOR", "VIEWER"),
  async (req, res) => {
    try {
      const { postId, content } = req.body;

      const comment = await commentService.createComment({
        postId,
        content,
        userId: req.user.userId,
        companyId: req.companyId,
      });

      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

/**
 * 🔹 Listar comentários de um post
 */
router.get(
  "/comments/:postId",
  auth,
  company,
  role("ADMIN", "EDITOR", "VIEWER"),
  async (req, res) => {
    try {
      const comments = await commentService.getComments({
        postId: req.params.postId,
        companyId: req.companyId,
      });

      res.json(comments);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

module.exports = router;