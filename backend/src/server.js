/**
 * =====================================================
 * 🚀 SERVER - API POSTTEMPERO (PRO)
 * =====================================================
 * Responsável por:
 * - Configurar middlewares globais
 * - Registrar rotas
 * - Subir servidor HTTP + WebSocket
 * - Inicializar jobs (cron)
 * =====================================================
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

/**
 * 🔹 App Express
 */
const app = express();

/**
 * 🔹 Criar servidor HTTP (necessário pro socket.io)
 */
const server = http.createServer(app);

/**
 * =====================================================
 * 🔌 SOCKET.IO (TEMPO REAL)
 * =====================================================
 */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

/**
 * 🔹 Conexão WebSocket
 */
io.on("connection", (socket) => {
  console.log("🟢 Usuário conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Usuário desconectado:", socket.id);
  });
});

/**
 * 🔥 EXPORTAR IO (para usar nos controllers/services)
 */
module.exports.io = io;

/**
 * =====================================================
 * 🔐 CORS
 * =====================================================
 */
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 * =====================================================
 * 🔹 MIDDLEWARES
 * =====================================================
 */
app.use(express.json());

/**
 * =====================================================
 * 📦 ROTAS
 * =====================================================
 */
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes"); // 🔥 novo
const commentRoutes = require("./routes/commentRoutes");

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/notifications", notificationRoutes);
app.use("/comments", commentRoutes);

/**
 * =====================================================
 * 📁 ARQUIVOS ESTÁTICOS
 * =====================================================
 */
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "..", "uploads"))
);

/**
 * =====================================================
 * 🧪 HEALTH CHECK
 * =====================================================
 */
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "API funcionando 🚀",
  });
});

/**
 * =====================================================
 * ❌ ERROR HANDLER GLOBAL
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
 * ⏰ JOBS (CRON)
 * =====================================================
 */
const startPublishPostsJob = require("./jobs/publishPosts.job");

startPublishPostsJob(io); // 🔥 passa io para emitir eventos

/**
 * =====================================================
 * 🚀 START SERVER
 * =====================================================
 */
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});