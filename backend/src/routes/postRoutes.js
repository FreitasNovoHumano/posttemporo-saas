const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");
const allowRoles = require("../middlewares/roleMiddleware");
const companyMiddleware = require("../middlewares/companyMiddleware"); // 🔥 NOVO
const upload = require("../config/upload");

/**
 * =====================================================
 * 📝 POST ROUTES (MULTI-TENANT READY)
 * =====================================================
 * Responsável por:
 * - CRUD de posts
 * - Agendamento
 * - Aprovação / Rejeição
 * - Métricas
 *
 * 🔐 Proteção:
 * - authMiddleware → usuário autenticado
 * - companyMiddleware → isolamento por empresa
 * - allowRoles → controle de permissões
 * =====================================================
 */

/**
 * 📄 LISTAR POSTS
 * -----------------------------------------------------
 * GET /posts
 */
router.get(
  "/posts",
  authMiddleware,
  companyMiddleware, // 🔥 ISOLAMENTO
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
  companyMiddleware,
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
  companyMiddleware,
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
  companyMiddleware,
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
  companyMiddleware,
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
  companyMiddleware,
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
  companyMiddleware,
  allowRoles("ADMIN"),
  postController.rejectPost
);

/**
 * 📊 MÉTRICAS
 * -----------------------------------------------------
 * GET /posts/metrics
 */
router.get(
  "/posts/metrics",
  authMiddleware,
  companyMiddleware,
  allowRoles("ADMIN"),
  postController.getMetrics
);

module.exports = router;