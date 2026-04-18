const express = require("express");
const cors = require("cors");

const app = express();

// 🔹 Middlewares
app.use(cors());
app.use(express.json());

// 🔹 Rota teste
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// 🔥 IMPORTANTE: manter servidor ativo
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
});

app.listen(3001, "127.0.0.1", () => {
  console.log("🚀 Backend rodando na porta 3001");
});