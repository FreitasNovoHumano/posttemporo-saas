const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

/**
 * =====================================================
 * 🔐 AUTH MIDDLEWARE (SaaS READY)
 * =====================================================
 * Responsável por:
 * - Validar JWT
 * - Garantir que o usuário existe
 * - Injetar identidade do usuário em req.user
 *
 * ❌ NÃO lida com empresa
 * ❌ NÃO lida com roles
 *
 * 👉 Multi-tenant é tratado no companyMiddleware
 * =====================================================
 */

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    /**
     * 🔴 Token não enviado
     */
    if (!authHeader) {
      return res.status(401).json({
        error: "Token não fornecido",
      });
    }

    /**
     * 🔹 Formato esperado: Bearer TOKEN
     */
    const [, token] = authHeader.split(" ");

    if (!token) {
      return res.status(401).json({
        error: "Formato de token inválido",
      });
    }

    /**
     * 🔐 Decodifica token
     */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /**
     * 🔥 Busca usuário no banco (fonte da verdade)
     */
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "Usuário não encontrado",
      });
    }

    /**
     * 🔥 CONTEXTO SEGURO DO USUÁRIO
     */
    req.user = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };

    return next();

  } catch (error) {
    console.error("❌ Erro no authMiddleware:", error);

    return res.status(401).json({
      error: "Token inválido ou expirado",
    });
  }
}

module.exports = authMiddleware;