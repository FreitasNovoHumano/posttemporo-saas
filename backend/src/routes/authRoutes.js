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
 * 🧪 DEBUG (remover depois)
 */
console.log("🔎 DEBUG AUTH ROUTES:");
console.log("register:", typeof authController.register);
console.log("login:", typeof authController.login);
console.log("me:", typeof authController.me);
console.log("refresh:", typeof authController.refresh);
console.log("logout:", typeof authController.logout);
console.log("middleware:", typeof authMiddleware);

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
 * 🔄 REFRESH TOKEN
 */
router.post("/refresh", authController.refresh);

/**
 * 🚪 LOGOUT
 */
router.post("/logout", authController.logout);

/**
 * 💓 HEALTH CHECK
 */
router.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
    service: "auth",
    timestamp: new Date(),
  });
});

module.exports = router;