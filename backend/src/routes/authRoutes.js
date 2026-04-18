const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

// 🔐 usuário logado
router.get("/auth/me", authMiddleware, authController.me);

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

module.exports = router;