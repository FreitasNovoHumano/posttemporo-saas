const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

/**
 * =====================================================
 * 🔐 AUTH MIDDLEWARE (PRO)
 * =====================================================
 * Responsável por:
 * - Validar JWT
 * - Buscar usuário no banco
 * - Injetar dados seguros em req.user
 *
 * 🔥 ESSENCIAL para multi-tenant
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
     * 🔹 Formato: Bearer TOKEN
     */
    const token = authHeader.split(" ")[1];

    /**
     * 🔐 Decodifica token
     */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /**
     * 🔥 BUSCA USUÁRIO NO BANCO
     * (NUNCA confie só no token)
     */
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId || decoded.id },
    });

    if (!user) {
      return res.status(401).json({
        error: "Usuário não encontrado",
      });
    }

    /**
     * 🔥 AQUI NASCE O CONTEXTO DO USUÁRIO
     */
    req.user = {
      id: user.id,
      role: user.role,
      companyId: user.companyId, // 🔥 CRÍTICO
    };

    next();

  } catch (error) {
    console.error("❌ Erro no authMiddleware:", error);

    return res.status(401).json({
      error: "Token inválido",
    });
  }
}

module.exports = authMiddleware;