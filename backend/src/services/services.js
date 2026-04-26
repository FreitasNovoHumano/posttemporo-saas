const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// 🔹 Middlewares
app.use(cors());
app.use(express.json());

// 🔹 IMPORTAR ROTAS
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

// 🔹 USAR ROTAS
app.use("/auth", authRoutes); // 👉 /auth/login
app.use("/", postRoutes);     // 👉 /posts, /metrics

// 🔹 TESTE RÁPIDO
app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

// 🔹 START
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// server.js
const cookieParser = require("cookie-parser");
app.use(cookieParser());