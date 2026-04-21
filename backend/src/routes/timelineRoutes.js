const express = require("express");
const router = express.Router();

const prisma = require("../lib/prisma");

const auth = require("../middlewares/authMiddleware");
const company = require("../middlewares/companyMiddleware");

/**
 * 🔹 Marcar timeline como lida
 */
router.post("/read", auth, company, async (req, res) => {
  await prisma.membership.update({
    where: {
      userId_companyId: {
        userId: req.user.userId,
        companyId: req.companyId,
      },
    },
    data: {
      lastReadAt: new Date(),
    },
  });

  res.json({ success: true });
});

module.exports = router;