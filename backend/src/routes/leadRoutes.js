const express = require("express");
const router = express.Router();

const prisma = require("../lib/prisma");

// 🔥 AUTOMAÇÃO (ADICIONE AQUI)
const { sendWhatsAppLead } = require("../services/leadAutomationService");

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
 *
 * 🎯 OBJETIVO:
 * - Receber leads da landing page
 * - NÃO exige autenticação (rota pública)
 *
 * 🧠 COMPATIBILIDADE:
 * - Aceita tanto:
 *   → { nome, empresa }
 *   → { name, company }
 *
 * =====================================================
 */
router.post("/", async (req, res) => {
  try {
    /**
     * 🔄 MAPEAMENTO FLEXÍVEL (frontend ↔ backend)
     */
    const {
      nome,
      name,
      empresa,
      company,
      documento,
      document,
      whatsapp,
      email,
    } = req.body;

    /**
     * 🧠 NORMALIZAÇÃO DOS CAMPOS
     */
    const finalName = name || nome;
    const finalCompany = company || empresa;
    const finalDocument = document || documento;

    /**
     * 🧠 VALIDAÇÃO
     */
    if (!finalName || !whatsapp) {
      return res.status(400).json({
        error: "Nome e WhatsApp são obrigatórios",
      });
    }

    /**
     * 💾 CRIA LEAD NO BANCO
     */
    const lead = await prisma.lead.create({
      data: {
        name: finalName,
        company: finalCompany,
        document: finalDocument, // opcional
        whatsapp,
        email,
      },
    });

    // 🔥 AUTOMAÇÃO WHATSAPP
await sendWhatsAppLead(lead);

    return res.status(201).json({
      message: "Lead salvo com sucesso",
      lead,
    });

  } catch (error) {
    console.error("Erro ao criar lead:", error);

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
      console.error("Erro ao buscar leads:", error);

      return res.status(500).json({
        error: "Erro ao buscar leads",
      });
    }
  }
);

module.exports = router;