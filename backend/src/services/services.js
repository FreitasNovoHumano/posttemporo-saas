const express = require("express");
const cors = require("cors");

const app = express();

const postRoutes = require("./routes/postRoutes");

// ✅ CORS configurado corretamente
app.use(cors({
  origin: "http://localhost:3000"
}));

// ✅ JSON antes das rotas
app.use(express.json());

// ✅ Rotas
app.use(postRoutes);

app.listen(3001, () => {
  console.log("🚀 Backend rodando na porta 3001");
});