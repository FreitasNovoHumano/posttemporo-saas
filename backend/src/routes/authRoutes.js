/**
 * =====================================================
 * 🔐 AUTH ROUTES (PRO - PADRÃO EMPRESA)
 * =====================================================
 *
 * 🎯 RESPONSABILIDADES:
 * - Delegar lógica para controller
 * - NÃO conter regra de negócio
 *
 * =====================================================
 */

const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// 🔐 AUTH
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

// 👤 USER
router.get("/me", authController.me);

module.exports = router;