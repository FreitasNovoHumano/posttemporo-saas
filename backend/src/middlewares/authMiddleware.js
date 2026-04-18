const jwt = require("jsonwebtoken");

const JWT_SECRET = "segredo_super_forte"; // depois colocamos no .env

// 🔐 Middleware de proteção de rotas
function authMiddleware(req, res, next) {
  try {
    // 🔹 Pega o header Authorization
    const authHeader = req.headers.authorization;

    // ❌ Se não tiver token
    if (!authHeader) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    // 🔹 Formato esperado: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    // 🔹 Valida o token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 🔹 Injeta dados do usuário na requisição
    req.userId = decoded.userId;

    // 🔥 Libera acesso
    next();

  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

module.exports = authMiddleware;