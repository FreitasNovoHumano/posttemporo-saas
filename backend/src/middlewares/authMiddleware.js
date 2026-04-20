const jwt = require("jsonwebtoken");

/**
 * 🔐 Middleware de autenticação
 * Verifica se o usuário está logado via JWT
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // 🔴 Se não tiver token
  if (!authHeader) {
    return res.status(401).json({
      error: "Token não fornecido",
    });
  }

  // 🔹 Formato esperado: Bearer TOKEN
  const token = authHeader.split(" ")[1];

  try {
    // 🔐 Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /**
     * 🔥 AQUI ESTÁ O MAIS IMPORTANTE
     * Salva o usuário na requisição
     */
    req.user = decoded; // { id, role }

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Token inválido",
    });
  }
}

module.exports = authMiddleware;