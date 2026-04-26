const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * =====================================================
 * 🤖 GERAR POST COM IA (IMAGEM + TEXTO)
 * =====================================================
 */
router.post("/generate-post", async (req, res) => {
  try {
    const { type } = req.body;

    if (!type) {
      return res.status(400).json({ error: "Tipo é obrigatório" });
    }

    /**
     * 🧠 PROMPT (IMAGEM)
     */
    const prompt = `Food photography of ${type}, realistic, professional lighting, instagram style`;

    /**
     * 🎨 GERAR IMAGEM
     */
    const image = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    /**
     * 📝 TEXTO SIMPLES (pode evoluir depois)
     */
    const texts = {
      pizzaria: {
        title: "🍕 Hoje é dia de pizza",
        content: "Massa perfeita e recheio caprichado 😍",
        cta: "Peça já!",
      },
      hamburgueria: {
        title: "🍔 Hambúrguer artesanal",
        content: "Suculento e irresistível 🤤",
        cta: "Peça agora!",
      },
      marmitex: {
        title: "🍱 Marmitex quentinha",
        content: "Comida caseira deliciosa ❤️",
        cta: "Peça já!",
      },
    };

    return res.json({
      image: image.data[0].url,
      ...(texts[type] || {
        title: "🔥 Post incrível",
        content: "Seu cliente vai amar!",
        cta: "Peça agora!",
      }),
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro IA" });
  }
});

module.exports = router;