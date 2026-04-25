const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");

const auth = require("../middlewares/authMiddleware");
const company = require("../middlewares/companyMiddleware");
const role = require("../middlewares/roleMiddleware");

// ❌ REMOVIDO temporariamente (estava quebrando)
// const audit = require("../middlewares/auditMiddleware");

const upload = require("../config/upload");

/**
 * =====================================================
 * 📝 POST ROUTES (SaaS READY)
 * =====================================================
 */

/**
 * 📄 LISTAR POSTS
 */
router.get(
  "/posts",
  auth,
  company,
  role("ADMIN", "EDITOR", "VIEWER"),
  postController.getPosts
);

/**
 * ➕ CRIAR POST (com upload)
 */
router.post(
  "/posts",
  auth,
  company,
  role("ADMIN", "EDITOR"),
  upload.single("image"),
  // audit("CREATE_POST"), ❌ removido temporariamente
  postController.createPost
);

/**
 * ✏️ ATUALIZAR POST
 */
router.put(
  "/posts/:id",
  auth,
  company,
  role("ADMIN", "EDITOR"),
  // audit("UPDATE_POST"),
  postController.updatePost
);

/**
 * 🗑️ DELETAR POST
 */
router.delete(
  "/posts/:id",
  auth,
  company,
  role("ADMIN"),
  // audit("DELETE_POST"),
  postController.deletePost
);

/**
 * 📅 AGENDAR POST
 */
router.put(
  "/posts/:id/schedule",
  auth,
  company,
  role("ADMIN", "EDITOR"),
  // audit("SCHEDULE_POST"),
  postController.schedulePost
);

/**
 * ✅ APROVAR POST
 */
router.put(
  "/posts/:id/approve",
  auth,
  company,
  role("ADMIN", "EDITOR"),
  // audit("APPROVE_POST"),
  postController.approvePost
);

/**
 * ❌ REJEITAR POST
 */
router.put(
  "/posts/:id/reject",
  auth,
  company,
  role("ADMIN", "EDITOR"),
  // audit("REJECT_POST"),
  postController.rejectPost
);

/**
 * 📊 MÉTRICAS
 */
router.get(
  "/posts/metrics",
  auth,
  company,
  role("ADMIN"),
  postController.getMetrics
);

module.exports = router;