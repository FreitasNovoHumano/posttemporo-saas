const prisma = require("../lib/prisma");

/**
 * =====================================================
 * 🔐 AUTHORIZE (RBAC REAL)
 * =====================================================
 */
function authorize(permission) {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const companyId = req.headers["x-company-id"];

      if (!companyId) {
        return res.status(400).json({
          error: "Empresa não informada",
        });
      }

      /**
       * 🔎 Busca membership + role + permissões
       */
      const membership = await prisma.membership.findFirst({
        where: {
          userId,
          companyId,
        },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });

      if (!membership) {
        return res.status(403).json({
          error: "Sem acesso à empresa",
        });
      }

      /**
       * 🔐 Verifica permissão
       */
      const hasPermission = membership.role.permissions.some(
        (p) => p.permission.name === permission
      );

      if (!hasPermission) {
        return res.status(403).json({
          error: "Sem permissão",
        });
      }

      next();

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Erro de autorização",
      });
    }
  };
}

module.exports = authorize;