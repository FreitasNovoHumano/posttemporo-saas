/**
 * =====================================================
 * 🛡️ ROLE MIDDLEWARE (RBAC POR EMPRESA)
 * =====================================================
 * Responsável por:
 * - Validar permissões baseadas na role da empresa
 *
 * ⚠️ Depende do companyMiddleware
 * =====================================================
 */

function roleMiddleware(...allowedRoles) {
  return (req, res, next) => {
    /**
     * 🔴 Verifica autenticação
     */
    if (!req.user) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    /**
     * 🔴 Verifica contexto da empresa
     */
    if (!req.role) {
      return res.status(400).json({
        error: "Contexto de empresa não definido",
      });
    }

    /**
     * 🔒 Verifica permissão
     */
    if (!allowedRoles.includes(req.role)) {
      return res.status(403).json({
        error: "Acesso negado",
      });
    }

    return next();
  };
}

module.exports = roleMiddleware;