const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");

/**
 * 🔐 LOGIN GOOGLE + VALIDAÇÃO EMPRESA
 */
router.post("/google", async (req, res) => {
  const { email, name } = req.body;

  try {
    let user = await prisma.user.findUnique({
      where: { email },
      include: { companies: true }, // 👈 importante
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
        },
        include: { companies: true },
      });
    }

    return res.json({
      userId: user.id,
      hasCompany: user.companies.length > 0,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Erro ao autenticar com Google",
    });
  }
});

module.exports = router;