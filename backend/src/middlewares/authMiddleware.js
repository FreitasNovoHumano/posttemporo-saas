/**
 * =====================================================
 * 🔐 AUTH MIDDLEWARE (PADRÃO GLOBAL)
 * =====================================================
 *
 * 🎯 PADRÃO:
 * req.user.id
 * req.companyId
 * req.role
 *
 * =====================================================
 */

const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.ACCESS_SECRET;

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Token não fornecido",
      });
    }

    const [, token] = authHeader.split(" ");

    const decoded = jwt.verify(token, ACCESS_SECRET);

    /**
     * 🔥 PADRÃO GLOBAL
     */
    req.user = {
      id: decoded.id,
    };

    req.companyId = decoded.companyId;
    req.role = decoded.role;

    return next();

  } catch (error) {
    return res.status(401).json({
      error: "Token inválido",
    });
  }
}

module.exports = authMiddleware;