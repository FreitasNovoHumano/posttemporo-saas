const prisma = require("../lib/prisma");

/**
 * =====================================================
 * 🏢 COMPANY MIDDLEWARE (PRO - MULTI-TENANT)
 * =====================================================
 * Responsável por:
 * - Validar autenticação
 * - Identificar empresa via header
 * - Validar membership (user ↔ company)
 * - Injetar contexto seguro na request
 *
 * 🔥 CORE DO SaaS
 * =====================================================
 */

async function companyMiddleware(req, res, next) {
  try {
    /**
     * 🔐 1. VALIDAR USUÁRIO
     */
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado",
      });
    }

    /**
     * 🏢 2. OBTER COMPANY ID
     */
    const companyId = req.headers["x-company-id"];

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Empresa não informada (x-company-id)",
      });
    }

    /**
     * 🔥 3. VALIDAR MEMBERSHIP (MULTI-TENANT)
     */
    const membership = await prisma.membership.findUnique({
      where: {
        userId_companyId: {
          userId: req.user.id,
          companyId,
        },
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    /**
     * 🚫 SEM ACESSO
     */
    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Acesso negado a esta empresa",
      });
    }

    /**
     * 🔥 4. CONTEXTO MULTI-TENANT (PADRÃO GLOBAL)
     */
    req.company = {
      id: membership.company.id,
      name: membership.company.name,
    };

    req.companyId = membership.company.id;
    req.role = membership.role;
    req.membership = membership;

    /**
     * 🧠 FUTURO: permissões granulares
     */
    // req.permissions = await getPermissions(req.user.id, companyId);

    return next();
  } catch (error) {
    console.error("❌ companyMiddleware error:", {
      message: error.message,
      stack: error.stack,
      user: req.user?.id,
      companyId: req.headers["x-company-id"],
    });

    return res.status(500).json({
      success: false,
      message: "Erro interno no middleware",
    });
  }
}

module.exports = companyMiddleware;