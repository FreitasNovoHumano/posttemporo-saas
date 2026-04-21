const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const allowRoles = require("../middlewares/roleMiddleware");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * =====================================================
 * 📊 DASHBOARD ROUTES
 * =====================================================
 * Métricas administrativas
 */

/**
 * 📊 MÉTRICAS DO SISTEMA
 * -----------------------------------------------------
 * GET /dashboard/metrics
 * ❗ Apenas ADMIN
 */
router.get(
  "/metrics",
  authMiddleware,
  allowRoles("ADMIN"),
  async (req, res) => {
    try {
      const posts = await prisma.post.count();

      const scheduled = await prisma.post.count({
        where: { status: "SCHEDULED" },
      });

      const published = await prisma.post.count({
        where: { status: "PUBLISHED" },
      });

      res.json({
        posts,
        scheduled,
        published,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar métricas" });
    }
  }
);

module.exports = router;