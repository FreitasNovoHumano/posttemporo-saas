const prisma = require("../lib/prisma");
const { handleNewLead } = require("../services/leadAutomationService");

/**
 * =====================================================
 * 🚀 Criar Lead
 * =====================================================
 * 🎯 OBJETIVO:
 * - Salvar lead vindo da landing page
 * - Agora também salva:
 *   → segmento do negócio
 *   → post gerado (contexto de conversão)
 *
 * 🧠 BENEFÍCIO:
 * - Permite automação personalizada
 * - Melhora conversão no WhatsApp
 * =====================================================
 */
async function createLead(req, res) {
  try {
    /**
     * =====================================================
     * 📥 DADOS RECEBIDOS DO FRONTEND
     * =====================================================
     */
    const {
      empresa,
      documento,
      nome,
      email,
      whatsapp,

      // 🔥 NOVOS CAMPOS (não obrigatórios)
      segment,
      generatedPost,
    } = req.body;
    

    /**
     * =====================================================
     * 💾 CRIAÇÃO DO LEAD
     * =====================================================
     * ⚠️ NÃO ALTERAMOS O QUE JÁ FUNCIONA
     * Apenas adicionamos novos campos opcionais
     */
    const lead = await prisma.lead.create({
      data: {
        empresa,
        documento,
        nome,
        email,
        whatsapp,

        // 🔥 NOVOS DADOS PARA AUTOMAÇÃO
        segment: segment || null,
        generatedPost: generatedPost || null,
      },
    });

    // 🔥 AUTOMAÇÃO
handleNewLead(lead);

return res.status(201).json(lead);

    /**
     * =====================================================
     * 📤 RESPOSTA
     * =====================================================
     */
    return res.status(201).json(lead);

  } catch (error) {
    /**
     * =====================================================
     * ❌ TRATAMENTO DE ERRO
     * =====================================================
     */
    console.error("Erro ao criar lead:", error);

    return res.status(500).json({
      error: "Erro ao salvar lead",
    });
  }
}

/**
 * =====================================================
 * 📦 EXPORTAÇÃO
 * =====================================================
 */
module.exports = {
  createLead,
};