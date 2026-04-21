const prisma = require("../lib/prisma");

/**
 * =====================================================
 * 🏢 COMPANY MIDDLEWARE (MULTI-TENANT REAL)
 * =====================================================
 * Responsável por:
 * - Identificar a empresa via header
 * - Validar acesso do usuário à empresa
 * - Injetar contexto multi-tenant na request
 *
 * 🔥 CORE do SaaS
 * =====================================================
 */

async function companyMiddleware(req, res, next) {
  try {
    /**
     * 🔴 Usuário não autenticado
     */
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    /**
     * 🔹 Empresa vem do frontend
     */
    const companyId = req.headers["x-company-id"];

    if (!companyId) {
      return res.status(400).json({
        error: "Empresa não informada (x-company-id)",
      });
    }

    /**
     * 🔥 Verifica vínculo do usuário com a empresa
     */
    const membership = await prisma.membership.findUnique({
      where: {
        userId_companyId: {
          userId: req.user.userId,
          companyId,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({
        error: "Acesso negado a esta empresa",
      });
    }

    /**
     * 🔥 CONTEXTO MULTI-TENANT
     */
    req.companyId = companyId;
    req.role = membership.role;

    return next();

  } catch (error) {
    console.error("❌ Erro no companyMiddleware:", error);

    return res.status(500).json({
      error: "Erro interno no middleware",
    });
  }
}

module.exports = companyMiddleware;