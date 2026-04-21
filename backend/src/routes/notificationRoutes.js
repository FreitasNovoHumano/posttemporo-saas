const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * 🔔 LISTAR NOTIFICAÇÕES
 */
router.get("/", auth, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const notifications = await prisma.notification.findMany({
    where: {
      userId: req.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * limit,
    take: Number(limit),
  });

  res.json(notifications);
});

module.exports = router;