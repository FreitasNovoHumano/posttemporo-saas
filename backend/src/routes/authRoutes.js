const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * =====================================================
 * 🔐 AUTH ROUTES
 * =====================================================
 * Responsável por:
 * - Registro de usuários
 * - Login (JWT)
 * - Sessão do usuário autenticado
 *
 * Base URL: /auth
 */

/**
 * 📝 REGISTER
 * -----------------------------------------------------
 * Cria um novo usuário
 *
 * POST /auth/register
 *
 * Body:
 * {
 *   "name": "Fábio",
 *   "email": "fabio@email.com",
 *   "password": "123456"
 * }
 */
router.post("/register", authController.register);

/**
 * 🔐 LOGIN
 * -----------------------------------------------------
 * Autentica usuário e retorna token JWT
 *
 * POST /auth/login
 *
 * Body:
 * {
 *   "email": "fabio@email.com",
 *   "password": "123456"
 * }
 *
 * Response:
 * {
 *   user,
 *   token
 * }
 */
router.post("/login", authController.login);

/**
 * 👤 GET CURRENT USER
 * -----------------------------------------------------
 * Retorna dados do usuário autenticado
 *
 * GET /auth/me
 *
 * Headers:
 * Authorization: Bearer TOKEN
 *
 * 🔐 Protegida por JWT
 */
router.get("/me", authMiddleware, authController.me);

/**
 * 💓 HEALTH CHECK
 * -----------------------------------------------------
 * Verifica se o serviço está online
 *
 * GET /auth/health
 */
router.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
    service: "auth",
    timestamp: new Date(),
  });
});

module.exports = router;