const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");

const auth = require("../middlewares/authMiddleware");
const company = require("../middlewares/companyMiddleware");

// 🔐 RBAC
const authorize = require("../middlewares/authorize");
const { PERMISSIONS } = require("../config/permissions");

const upload = require("../config/upload");

/**
 * =====================================================
 * 📝 POST ROUTES (RBAC - PERMISSIONS)
 * =====================================================
 */

/**
 * 📄 LISTAR POSTS
 */
router.get(
  "/posts",
  auth,
  company,
  authorize(PERMISSIONS.VIEW_DASHBOARD),
  postController.getPosts
);

/**
 * ➕ CRIAR POST
 */
router.post(
  "/posts",
  auth,
  company,
  authorize(PERMISSIONS.CREATE_POST),
  upload.single("image"),
  postController.createPost
);

/**
 * ✏️ ATUALIZAR POST
 */
router.put(
  "/posts/:id",
  auth,
  company,
  authorize(PERMISSIONS.UPDATE_POST),
  postController.updatePost
);

/**
 * 🗑️ DELETAR POST
 */
router.delete(
  "/posts/:id",
  auth,
  company,
  authorize(PERMISSIONS.DELETE_POST),
  postController.deletePost
);

/**
 * 📅 AGENDAR POST
 */
router.put(
  "/posts/:id/schedule",
  auth,
  company,
  authorize(PERMISSIONS.UPDATE_POST),
  postController.schedulePost
);

/**
 * ✅ APROVAR POST
 */
router.put(
  "/posts/:id/approve",
  auth,
  company,
  authorize(PERMISSIONS.APPROVE_POST),
  postController.approvePost
);

/**
 * ❌ REJEITAR POST
 */
router.put(
  "/posts/:id/reject",
  auth,
  company,
  authorize(PERMISSIONS.APPROVE_POST),
  postController.rejectPost
);

/**
 * 📊 MÉTRICAS
 */
router.get(
  "/posts/metrics",
  auth,
  company,
  authorize(PERMISSIONS.VIEW_DASHBOARD),
  postController.getMetrics
);

module.exports = router;