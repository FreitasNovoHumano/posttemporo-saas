/**
 * =====================================================
 * 🚀 SERVER - API POSTTEMPERO (SaaS PRO)
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
 * 🔹 HTTP Server (necessário para WebSocket)
 */
const server = http.createServer(app);

/**
 * =====================================================
 * 🔌 SOCKET.IO (TEMPO REAL MULTI-TENANT)
 * =====================================================
 */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

/**
 * 🔥 EXPORT GLOBAL (services/controllers)
 */
module.exports.io = io;

/**
 * 🔹 Conexão WebSocket
 */
io.on("connection", (socket) => {
  console.log("🟢 Socket conectado:", socket.id);

  /**
   * 🏢 Entrar em uma empresa (ROOM)
   */
  socket.on("join_company", (companyId) => {
    if (!companyId) return;

    const room = `company:${companyId}`;
    socket.join(room);

    console.log(`📦 Socket ${socket.id} entrou na sala ${room}`);
  });

  /**
   * ❌ Desconexão
   */
  socket.on("disconnect", () => {
    console.log("🔴 Socket desconectado:", socket.id);
  });
});

/**
 * =====================================================
 * 🔐 CORS
 * =====================================================
 */
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-company-id", // 🔥 IMPORTANTE pro multi-tenant
    ],
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
 * 📦 ROTAS (PADRÃO API)
 * =====================================================
 */
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const commentRoutes = require("./routes/commentRoutes");
const timelineRoutes = require("./routes/timelineRoutes"); // 🔥 novo
const inviteRoutes = require("./routes/inviteRoutes"); // 🔥 novo

/**
 * 🔥 Prefixo global (recomendado)
 */
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/invite", inviteRoutes);

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

startPublishPostsJob(io);

/**
 * =====================================================
 * 🚀 START SERVER
 * =====================================================
 */
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});