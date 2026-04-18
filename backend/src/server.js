const express = require("express");
const cors = require("cors");

const app = express();

const postRoutes = require("./routes/postRoutes");

app.use(cors());
app.use(express.json());

app.use(postRoutes);

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

app.use(cors({
  origin: "http://localhost:3000"
}));

app.listen(3001, () => {
  console.log("🚀 Backend rodando na porta 3001");
});

const authRoutes = require("./routes/authRoutes");

app.use(authRoutes);