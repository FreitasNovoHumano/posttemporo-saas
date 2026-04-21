const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");

const auth = require("../middlewares/authMiddleware");
const company = require("../middlewares/companyMiddleware");
const role = require("../middlewares/roleMiddleware");
const audit = require("../middlewares/auditMiddleware");

const upload = require("../config/upload");

/**
 * =====================================================
 * 📝 POST ROUTES (SaaS READY)
 * =====================================================
 * 🔐 Camadas:
 * - auth → autenticação
 * - company → multi-tenant (empresa)
 * - role → autorização por empresa
 * - audit → log automático
 * =====================================================
 */

/**
 * 📄 LISTAR POSTS
 * -----------------------------------------------------
 * GET /posts
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
 * -----------------------------------------------------
 * POST /posts
 */
router.post(
  "/posts",
  auth,
  company,
  role("ADMIN", "EDITOR"),
  authMiddleware,
  companyMiddleware,
  upload.single("image"),
  audit("CREATE_POST"),
  postController.createPost
);

/**
 * ✏️ ATUALIZAR POST
 * -----------------------------------------------------
 * PUT /posts/:id
 */
router.put(
  "/posts/:id",
  auth,
  company,
  role("ADMIN", "EDITOR"),
  audit("UPDATE_POST"),
  postController.updatePost
);

/**
 * 🗑️ DELETAR POST
 * -----------------------------------------------------
 * ❗ Apenas ADMIN
 */
router.delete(
  "/posts/:id",
  auth,
  company,
  role("ADMIN"),
  audit("DELETE_POST"),
  postController.deletePost
);

/**
 * 📅 AGENDAR POST
 * -----------------------------------------------------
 * PUT /posts/:id/schedule
 */
router.put(
  "/posts/:id/schedule",
  auth,
  company,
  role("ADMIN", "EDITOR"),
  audit("SCHEDULE_POST"),
  postController.schedulePost
);

/**
 * ✅ APROVAR POST
 * -----------------------------------------------------
 * ADMIN + EDITOR (workflow real)
 */
router.put(
  "/posts/:id/approve",
  auth,
  company,
  role("ADMIN", "EDITOR"),
  audit("APPROVE_POST"),
  postController.approvePost
);

/**
 * ❌ REJEITAR POST
 * -----------------------------------------------------
 */
router.put(
  "/posts/:id/reject",
  auth,
  company,
  role("ADMIN", "EDITOR"),
  audit("REJECT_POST"),
  postController.rejectPost
);

/**
 * 📊 MÉTRICAS
 * -----------------------------------------------------
 * GET /posts/metrics
 */
router.get(
  "/posts/metrics",
  auth,
  company,
  role("ADMIN"),
  postController.getMetrics
);

module.exports = router;