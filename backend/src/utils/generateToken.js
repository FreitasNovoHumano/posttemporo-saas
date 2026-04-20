const jwt = require("jsonwebtoken");

/**
 * 🔐 Gera token JWT (com multi-tenant)
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      companyId: user.companyId, // 🔥 AQUI!
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

module.exports = generateToken;