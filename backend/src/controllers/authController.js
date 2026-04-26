const authService = require("../services/authService");
const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");

/**
 * =====================================================
 * 🔐 AUTH CONTROLLER (PRO - SAAS READY)
 * =====================================================
 *
 * 🎯 RESPONSABILIDADES:
 * - Registro de usuário + empresa
 * - Login com RBAC (multi-tenant)
 * - Sessão (refresh token HTTP-only)
 * - Restore de sessão (/refresh)
 * - Retorno de empresas do usuário
 *
 * =====================================================
 */

/**
 * 🍪 Config padrão de cookie
 */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, // 🔥 true em produção (HTTPS)
  sameSite: "strict",
  path: "/api/auth/refresh",
};

/**
 * 🔹 REGISTER
 */
async function register(req, res) {
  try {
    const { name, email, password, companyName } = req.body;

    if (!email || !password || !companyName) {
      return res.status(400).json({
        error: "Email, senha e empresa obrigatórios",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Usuário já existe",
      });
    }

    /**
     * 🔥 TRANSACTION
     */
    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: { name: companyName },
      });

      const user = await authService.register({
        name,
        email,
        password,
      });

      const adminRole = await tx.role.findUnique({
        where: { name: "ADMIN" },
      });

      if (!adminRole) {
        throw new Error("Role ADMIN não encontrada");
      }

      await tx.membership.create({
        data: {
          userId: user.id,
          companyId: company.id,
          roleId: adminRole.id,
        },
      });

      return { user, company };
    });

    /**
     * 🔐 LOGIN AUTOMÁTICO
     */
    const { accessToken, refreshToken } =
      await authService.login({
        email,
        password,
        companyId: result.company.id,
      });

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    return res.status(201).json({
      user: result.user,
      companies: [
        {
          id: result.company.id,
          name: result.company.name,
          role: "ADMIN",
        },
      ],
      accessToken,
    });

  } catch (error) {
    console.error("ERRO REGISTER:", error);

    return res.status(400).json({
      error: error.message || "Erro ao registrar",
    });
  }
}

/**
 * 🔹 LOGIN
 */
async function login(req, res) {
  try {
    const { email, password, companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({
        error: "companyId é obrigatório",
      });
    }

    const { user, accessToken, refreshToken } =
      await authService.login({
        email,
        password,
        companyId,
      });

    const memberships = await prisma.membership.findMany({
      where: { userId: user.id },
      include: {
        company: true,
        role: true,
      },
    });

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      companies: memberships.map((m) => ({
        id: m.company.id,
        name: m.company.name,
        role: m.role.name,
      })),
      accessToken,
    });

  } catch (error) {
    return res.status(400).json({
      error: error.message || "Erro no login",
    });
  }
}

/**
 * 🔹 REFRESH (ESSENCIAL PARA PERSISTÊNCIA)
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

    const newAccessToken = jwt.sign(
      { id: decoded.id },
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
 * 🔹 ME
 */
async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        memberships: {
          include: {
            company: true,
            role: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "Usuário não encontrado",
      });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      companies: user.memberships.map((m) => ({
        id: m.company.id,
        name: m.company.name,
        role: m.role.name,
      })),
    });

  } catch (error) {
    console.error("ERRO /me:", error);

    return res.status(500).json({
      error: "Erro ao buscar usuário",
    });
  }
}

/**
 * 🔹 LOGOUT
 */
async function logout(req, res) {
  res.clearCookie("refreshToken");

  return res.json({
    success: true,
  });
}

module.exports = {
  register,
  login,
  refresh, // 🔥 NOVO
  me,
  logout,
};