const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * =====================================================
 * 🔐 AUTH ROUTES
 * =====================================================
 */

/**
 * 📝 REGISTER
 */
router.post("/register", authController.register);

/**
 * 🔐 LOGIN
 */
router.post("/login", authController.login);

/**
 * 👤 USUÁRIO LOGADO
 */
router.get("/me", authMiddleware, authController.me);

/**
 * 💓 HEALTH CHECK
 */
router.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
    service: "auth",
    timestamp: new Date(),
  });

  router.post("/auth/refresh", refresh);
  
});

module.exports = router;