const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");
const allowRoles = require("../middlewares/roleMiddleware");
const upload = require("../config/upload");

/**
 * =====================================================
 * 📝 POST ROUTES
 * =====================================================
 * Responsável por:
 * - CRUD de posts
 * - Agendamento
 * - Aprovação / Rejeição
 * - Métricas
 *
 * 🔐 Todas rotas protegidas por autenticação
 */

/**
 * 📄 LISTAR POSTS
 * -----------------------------------------------------
 * GET /posts
 */
router.get(
  "/posts",
  authMiddleware,
  allowRoles("ADMIN", "USER"),
  postController.getPosts
);

/**
 * ➕ CRIAR POST (com upload)
 * -----------------------------------------------------
 * POST /posts
 */
router.post(
  "/posts",
  authMiddleware,
  allowRoles("ADMIN", "USER"),
  upload.single("image"),
  postController.createPost
);

/**
 * ✏️ ATUALIZAR POST
 * -----------------------------------------------------
 * PUT /posts/:id
 */
router.put(
  "/posts/:id",
  authMiddleware,
  allowRoles("ADMIN", "USER"),
  postController.updatePost
);

/**
 * 🗑️ DELETAR POST
 * -----------------------------------------------------
 * ❗ Apenas ADMIN
 */
router.delete(
  "/posts/:id",
  authMiddleware,
  allowRoles("ADMIN"),
  postController.deletePost
);

/**
 * 📅 AGENDAR POST
 * -----------------------------------------------------
 * PUT /posts/:id/schedule
 */
router.put(
  "/posts/:id/schedule",
  authMiddleware,
  allowRoles("ADMIN", "USER"),
  postController.schedulePost
);

/**
 * ✅ APROVAR POST
 * -----------------------------------------------------
 * ❗ Apenas ADMIN
 */
router.put(
  "/posts/:id/approve",
  authMiddleware,
  allowRoles("ADMIN"),
  postController.approvePost
);

/**
 * ❌ REJEITAR POST
 * -----------------------------------------------------
 * ❗ Apenas ADMIN
 */
router.put(
  "/posts/:id/reject",
  authMiddleware,
  allowRoles("ADMIN"),
  postController.rejectPost
);

/**
 * 📊 MÉTRICAS
 * -----------------------------------------------------
 * GET /metrics
 */
router.get(
  "/metrics",
  authMiddleware,
  allowRoles("ADMIN"),
  postController.getMetrics
);

module.exports = router;