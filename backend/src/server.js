const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

/**
 * 🔐 CONFIGURAÇÃO DE CORS
 * ----------------------------------------
 * Permite comunicação entre frontend (Next.js)
 * e backend (Express)
 */
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

/**
 * 🔹 MIDDLEWARES GLOBAIS
 */
app.use(express.json());

/**
 * 🔹 ROTAS
 */
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

// 🔐 Rotas de autenticação
app.use("/auth", authRoutes);

// 📦 Rotas de posts
app.use("/", postRoutes);

/**
 * 📁 ARQUIVOS ESTÁTICOS
 */
app.use("/uploads", express.static("uploads"));

/**
 * 🧪 HEALTH CHECK
 */
app.get("/", (req, res) => {
  return res.status(200).send("API funcionando 🚀");
});

/**
 * 🚀 START DO SERVIDOR
 */
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});