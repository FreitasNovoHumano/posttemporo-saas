/**
 * =====================================================
 * 🚀 SERVER - API POSTTEMPERO (Express)
 * =====================================================
 * Responsável por:
 * - Configurar middlewares globais
 * - Registrar rotas
 * - Subir o servidor
 * =====================================================
 */

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

/**
 * =====================================================
 * 🔐 CONFIGURAÇÃO DE CORS
 * =====================================================
 * Permite requisições do frontend (Next.js)
 */
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 * =====================================================
 * 🔹 MIDDLEWARES GLOBAIS
 * =====================================================
 */
app.use(express.json()); // Parse JSON

/**
 * =====================================================
 * 📦 IMPORTAÇÃO DE ROTAS
 * =====================================================
 */
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

/**
 * =====================================================
 * 🔗 REGISTRO DE ROTAS
 * =====================================================
 */

// 🔐 Autenticação
app.use("/auth", authRoutes);

// 📝 Posts
app.use("/posts", postRoutes);

// 📊 Dashboard (métricas)
app.use("/dashboard", dashboardRoutes);

/**
 * =====================================================
 * 📁 ARQUIVOS ESTÁTICOS
 * =====================================================
 * Ex: imagens enviadas (uploads)
 */
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

/**
 * =====================================================
 * 🧪 HEALTH CHECK
 * =====================================================
 * Verifica se API está online
 */
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "API funcionando 🚀",
  });
});

/**
 * =====================================================
 * ❌ HANDLER GLOBAL DE ERROS
 * =====================================================
 */
app.use((err, req, res, next) => {
  console.error("❌ Erro:", err);

  return res.status(500).json({
    message: "Erro interno do servidor",
  });
});

/**
 * =====================================================
 * 🚀 START DO SERVIDOR
 * =====================================================
 */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});