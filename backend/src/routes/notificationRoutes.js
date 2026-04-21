const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * 🔔 LISTAR NOTIFICAÇÕES
 */
router.get("/notifications", authMiddleware, async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
  });

  res.json({ data: notifications });
});

module.exports = router;