const prisma = require("../lib/prisma");

/**
 * =====================================================
 * 🏢 COMPANY MIDDLEWARE (PRO - MULTI-TENANT + RBAC)
 * =====================================================
 *
 * 🎯 RESPONSABILIDADES:
 * - Validar autenticação (req.user)
 * - Identificar empresa via header (x-company-id)
 * - Validar vínculo (membership: user ↔ company)
 * - Carregar ROLE + PERMISSIONS
 * - Injetar contexto multi-tenant na request
 *
 * 🔥 IMPORTANTE:
 * - Este middleware é o CORE do controle multi-tenant
 * - Deve SEMPRE vir após authMiddleware
 *
 * 🧠 BOAS PRÁTICAS:
 * - Executa apenas 1 query por request
 * - Centraliza contexto para evitar reconsultas
 * - Facilita RBAC e Permission-based access
 *
 * =====================================================
 */

async function companyMiddleware(req, res, next) {
  try {
    /**
     * 🔐 1. VALIDAR USUÁRIO AUTENTICADO
     */
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado",
      });
    }

    /**
     * 🏢 2. OBTER COMPANY ID DO HEADER
     */
    const companyId = req.headers["x-company-id"];

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Empresa não informada (x-company-id)",
      });
    }

    /**
     * 🔥 3. VALIDAR MEMBERSHIP + CARREGAR ROLE E PERMISSIONS
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
        role: {
          select: {
            id: true,
            name: true,
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    /**
     * 🚫 ACESSO NEGADO
     */
    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Acesso negado a esta empresa",
      });
    }

    /**
     * 🔥 4. EXTRAIR PERMISSIONS (NÍVEL PRO)
     */
    const permissions =
      membership.role?.permissions?.map(
        (rp) => rp.permission.name
      ) || [];

    /**
     * 🔥 5. CONTEXTO MULTI-TENANT
     */
    req.company = {
      id: membership.company.id,
      name: membership.company.name,
    };

    req.companyId = membership.company.id;
    req.role = membership.role?.name;
    req.membership = membership;

    /**
     * 🔐 NOVO: PERMISSIONS DISPONÍVEIS NA REQUEST
     */
    req.permissions = permissions;

    /**
     * 🧠 CONTEXTO CENTRALIZADO
     */
    req.context = {
      userId: req.user.id,
      companyId: membership.company.id,
      role: membership.role?.name,
      permissions,
      membership,
    };

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