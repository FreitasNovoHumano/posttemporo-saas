const express = require("express");
const router = express.Router();

const prisma = require("../lib/prisma");

// 🔐 middlewares
const auth = require("../middlewares/authMiddleware");
const company = require("../middlewares/companyMiddleware");
const authorize = require("../middlewares/authorize");

// 🔐 permissions
const { PERMISSIONS } = require("../config/permissions");

/**
 * =====================================================
 * 📥 CREATE LEAD (PÚBLICO)
 * =====================================================
 */
router.post("/", async (req, res) => {
  try {
    const { name, company, whatsapp, email } = req.body;

    if (!name || !whatsapp) {
      return res.status(400).json({
        error: "Nome e WhatsApp são obrigatórios",
      });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        company,
        whatsapp,
        email,
      },
    });

    return res.status(201).json({
      message: "Lead salvo",
      lead,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro ao salvar lead",
    });
  }
});

/**
 * =====================================================
 * 🔐 LISTAR LEADS (ADMIN ONLY)
 * =====================================================
 */
router.get(
  "/",
  auth,
  company,
  authorize(PERMISSIONS.VIEW_LEADS),
  async (req, res) => {
    try {
      const leads = await prisma.lead.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.json(leads);

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Erro ao buscar leads",
      });
    }
  }
);

module.exports = router;