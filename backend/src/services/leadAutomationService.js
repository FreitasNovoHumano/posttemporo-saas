const axios = require("axios");

async function sendWhatsAppLead(lead) {
  try {
    const message = `
🚀 Fala, ${lead.name || "empreendedor"}!

Vi que você quer melhorar seus posts 👀

Vou te ajudar com ideias que realmente trazem clientes.

👉 Me conta:
Você vende mais pelo Instagram ou WhatsApp hoje?
`;

    await axios.post("https://SEU_ENDPOINT_WHATSAPP", {
      number: lead.whatsapp,
      message,
    });

  } catch (error) {
    console.error("Erro ao enviar WhatsApp:", error.message);
  }
}

module.exports = {
  sendWhatsAppLead,
};