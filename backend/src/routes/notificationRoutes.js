/**
 * =====================================================
 * 🔔 NOTIFICATION ROUTES
 * =====================================================
 * 🎯 Responsável por:
 * - Listar notificações do usuário autenticado
 *
 * 🔐 Segurança:
 * - Requer autenticação (JWT)
 *
 * 📦 Dependências:
 * - Prisma (banco de dados)
 * =====================================================
 */

const express = require("express");
const router = express.Router();

const prisma = require("../lib/prisma");

// 🔐 Middleware de autenticação
const auth = require("../middlewares/authMiddleware");

const { createLead } = require("../controllers/leadController");

/**
 * 📌 POST /leads
 */
router.post("/leads", createLead);

/**
 * =====================================================
 * 🔔 LISTAR NOTIFICAÇÕES
 * -----------------------------------------------------
 * GET /api/notifications
 *
 * 📥 Query Params:
 * - page (opcional) → padrão: 1
 * - limit (opcional) → padrão: 10
 *
 * 📤 Retorno:
 * - Lista paginada de notificações do usuário logado
 * =====================================================
 */
router.get("/", auth, async (req, res) => {
  try {
    // 🔹 Paginação
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const notifications = await prisma.notification.findMany({
      where: {
        userId: req.user.id, // 🔐 vem do middleware auth
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return res.json(notifications);
  } catch (error) {
    console.error("Erro ao buscar notificações:", error);

    return res.status(500).json({
      message: "Erro ao buscar notificações",
    });
  }
});

module.exports = router;