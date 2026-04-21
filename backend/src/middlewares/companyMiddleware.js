/**
 * =====================================================
 * 🛡️ COMPANY MIDDLEWARE
 * =====================================================
 * Responsável por:
 * - Garantir que usuário tem empresa
 * - Injetar companyId na request
 * =====================================================
 */

module.exports = function companyMiddleware(req, res, next) {
  try {
    if (!req.user || !req.user.companyId) {
      return res.status(403).json({
        error: "Usuário sem empresa vinculada",
      });
    }

    /**
     * 🔥 Injeta companyId (facilita nos services)
     */
    req.companyId = req.user.companyId;

    next();

  } catch (error) {
    console.error("❌ Erro no companyMiddleware:", error);

    return res.status(500).json({
      error: "Erro interno no middleware",
    });
  }
};