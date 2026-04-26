const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma"); // ajuste o caminho se necessário

/**
 * 📝 REGISTER
 */
async function register(req, res) {
  return res.json({ message: "Register funcionando" });
}

/**
 * 🔐 LOGIN
 */
async function login(req, res) {
  return res.json({ message: "Login funcionando" });
}

/**
 * 👤 USUÁRIO LOGADO
 */
async function me(req, res) {
  return res.json({ user: req.user || "Usuário autenticado" });
}

/**
 * 🔄 REFRESH (ESSENCIAL PARA PERSISTÊNCIA)
 */
async function refresh(req, res) {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({
      error: "NO_REFRESH_TOKEN",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_SECRET
    );

    const membership = await prisma.membership.findFirst({
      where: {
        userId: decoded.id,
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
      return res.status(401).json({
        error: "INVALID_SESSION",
      });
    }

    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        companyId: membership.companyId,
        role: membership.role.name,
        permissions: membership.role.permissions.map(
          (p) => p.permission.name
        ),
      },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({
      accessToken: newAccessToken,
    });

  } catch (error) {
    return res.status(401).json({
      error: "INVALID_REFRESH_TOKEN",
    });
  }
}

/**
 * 🚪 LOGOUT
 */
async function logout(req, res) {
  return res.json({ message: "Logout funcionando" });
}

/**
 * 📦 EXPORTAÇÃO CORRETA (ESSENCIAL)
 */
module.exports = {
  register,
  login,
  me,
  refresh,
  logout,
};