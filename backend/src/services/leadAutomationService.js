const axios = require("axios");
const { generateLocalPost } = require("../utils/copyGenerator");

/**
 * =====================================================
 * ⏱️ UTIL: DELAY ENTRE MENSAGENS (ANTI-SPAM)
 * =====================================================
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * =====================================================
 * 📲 ENVIO WHATSAPP (GENÉRICO)
 * =====================================================
 */
async function sendMessage(number, message) {
  try {
    if (!number) {
      console.warn("⚠️ Número de WhatsApp não informado");
      return;
    }

    await axios.post("https://SEU_ENDPOINT_WHATSAPP", {
      number,
      message,
    });

    console.log("✅ Mensagem enviada para:", number);

  } catch (error) {
    console.error("❌ Erro ao enviar WhatsApp:", error.message);
  }
}

/**
 * =====================================================
 * 🎯 GERA 7 POSTS AUTOMATICAMENTE
 * =====================================================
 */
function generate7Posts(segment, company) {
  const posts = [];

  for (let i = 0; i < 7; i++) {
    posts.push(generateLocalPost(segment, company));
  }

  return posts;
}

/**
 * =====================================================
 * 🧠 PERSONALIZAÇÃO POR SEGMENTO
 * =====================================================
 */
function getIntroMessage(segment) {
  if (segment === "restaurante") {
    return "vou te ajudar a lotar seu restaurante 🍽️";
  }

  if (segment === "lanchonete") {
    return "vamos aumentar seus pedidos hoje 🍔";
  }

  if (segment === "estetica") {
    return "vamos atrair mais clientes para seus serviços 💅";
  }

  return "vamos gerar mais clientes 🚀";
}

/**
 * =====================================================
 * 🚀 AUTOMAÇÃO COMPLETA DO LEAD
 * =====================================================
 */
async function sendWhatsAppLead(lead) {
  try {
    const {
      nome,
      name,
      whatsapp,
      empresa,
      segment,
      generatedPost,
    } = lead;

    const finalName = nome || name || "empreendedor";
    const finalSegment = segment || "negócio";

    /**
     * =====================================================
     * 🧠 MENSAGEM PERSONALIZADA POR SEGMENTO
     * =====================================================
     */
    const introMessage = getIntroMessage(segment);

    /**
     * =====================================================
     * 1️⃣ MENSAGEM INICIAL
     * =====================================================
     */
    await sendMessage(
      whatsapp,
      `🚀 Fala, ${finalName}!

${introMessage}

Vi que você gerou um post para *${finalSegment}* 👀

${generatedPost ? `Esse aqui ficou muito bom:\n"${generatedPost}"\n` : ""}

Já preparei mais 7 ideias prontas pra você 👇`
    );

    await delay(1500);

    /**
     * =====================================================
     * 2️⃣ GERA POSTS
     * =====================================================
     */
    const posts = generate7Posts(finalSegment, empresa || "seu negócio");

    /**
     * =====================================================
     * 3️⃣ ENVIA POSTS (COM DELAY)
     * =====================================================
     */
    for (let i = 0; i < posts.length; i++) {
      await sendMessage(
        whatsapp,
        `🔥 IDEIA ${i + 1}:\n\n${posts[i]}`
      );

      await delay(1200); // 🔥 evita bloqueio
    }

    /**
     * =====================================================
     * 4️⃣ CTA DE VENDA
     * =====================================================
     */
    await delay(1500);

    await sendMessage(
      whatsapp,
      `💡 Se quiser, posso te enviar posts prontos todos os dias.

Menos de R$1 por dia pra gerar clientes.

Quer testar por 7 dias grátis? 🚀`
    );

    /**
     * =====================================================
     * 5️⃣ FOLLOW-UP (10 MIN)
     * =====================================================
     */
    setTimeout(async () => {
      await sendMessage(
        whatsapp,
        `👀 Posso personalizar os posts pro seu negócio e aumentar suas vendas.

Quer que eu faça isso pra você?`
      );
    }, 600000);

  } catch (error) {
    console.error("❌ Erro na automação de lead:", error.message);
  }
}

module.exports = {
  sendWhatsAppLead,
};