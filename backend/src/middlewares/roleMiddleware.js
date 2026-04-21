/**
 * 🔐 Middleware de autorização por role
 * Permite acesso apenas a perfis específicos
 */
function roleMiddleware(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Acesso negado",
      });
    }

    next();
  };
}

module.exports = function allowRoles(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    next();
  };
};

module.exports = roleMiddleware;