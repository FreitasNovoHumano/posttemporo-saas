/**
 * =====================================================
 * 📩 INVITE ROUTES
 * =====================================================
 * 🎯 Responsável por:
 * - Convidar usuários para empresa (multi-tenant)
 *
 * 🔐 Segurança:
 * - auth → usuário autenticado
 * - company → empresa selecionada
 * - role → apenas ADMIN pode convidar
 * =====================================================
 */

const express = require("express");
const router = express.Router();

// 🔐 Middlewares
const auth = require("../middlewares/authMiddleware");
const company = require("../middlewares/companyMiddleware");
const role = require("../middlewares/roleMiddleware");

/**
 * =====================================================
 * 📩 ENVIAR CONVITE
 * -----------------------------------------------------
 * POST /api/invite
 * =====================================================
 */
router.post(
  "/invite",
  auth,
  company,
  role("ADMIN"),
  async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          message: "Email é obrigatório",
        });
      }

      // 🔥 Aqui você pode implementar lógica real depois
      console.log("📨 Convite enviado para:", email);

      return res.status(201).json({
        message: "Convite enviado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao enviar convite:", error);

      return res.status(500).json({
        message: "Erro ao enviar convite",
      });
    }
  }
);

module.exports = router;