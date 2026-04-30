const prisma = require("../lib/prisma");

/**
 * 🚀 Criar Lead
 */
async function createLead(req, res) {
  try {
    const { empresa, documento, nome, email, whatsapp } = req.body;

    const lead = await prisma.lead.create({
      data: {
        empresa,
        documento,
        nome,
        email,
        whatsapp,
      },
    });

    return res.status(201).json(lead);
  } catch (error) {
    console.error("Erro ao criar lead:", error);
    return res.status(500).json({ error: "Erro ao salvar lead" });
  }
}

module.exports = {
  createLead,
};