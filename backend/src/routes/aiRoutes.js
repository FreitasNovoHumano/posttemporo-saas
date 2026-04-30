/**
 * =====================================================
 * 🤖 AI ROUTES (GERAÇÃO DE POST)
 * =====================================================
 *
 * 🎯 RESPONSABILIDADES:
 * - Gerar legenda + hashtags (OpenAI)
 * - Gerar imagem (OpenAI)
 *
 * =====================================================
 */

const express = require("express");
const router = express.Router(); // 🔥 FALTAVA ISSO

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * =====================================================
 * 🤖 GERAR POST (IMAGEM + TEXTO)
 * =====================================================
 */
router.post("/generate-post", async (req, res) => {
  try {
    console.log("🔥 BODY:", req.body);

    const { type } = req.body;

    if (!type) {
      return res.status(400).json({
        error: "TYPE NÃO ENVIADO",
      });
    }

    /**
     * 🧠 TEXTO
     */
    const textResponse = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: `Crie legenda + hashtags para ${type}`,
        },
      ],
    });

    const text = textResponse.choices[0].message.content;

    console.log("✅ TEXTO OK");

    /**
     * 🎨 IMAGEM
     */
    const imageResponse = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `Foto profissional de comida ${type}`,
      size: "1024x1024",
    });

    console.log("🧪 IMAGE RAW:", imageResponse);

    const image =
      imageResponse.data?.[0]?.url ||
      imageResponse.data?.[0]?.b64_json;

    if (!image) {
      return res.status(500).json({
        error: "IMAGEM NÃO GERADA",
      });
    }

    console.log("✅ IMAGEM OK");

    return res.json({
      text,
      image,
    });

  } catch (error) {
    console.error("❌ ERRO COMPLETO:", error);

    return res.status(500).json({
      error: error.message || "Erro interno IA",
    });
  }
});
/**
 * =====================================================
 * 📦 EXPORT
 * =====================================================
 */
module.exports = router;