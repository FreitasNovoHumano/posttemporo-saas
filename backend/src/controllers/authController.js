const authService = require("../services/authService");
const prisma = require("../lib/prisma");

/**
 * =====================================================
 * 🔐 AUTH CONTROLLER (PRO - SAAS READY)
 * =====================================================
 *
 * 🎯 RESPONSABILIDADES:
 * - Registro de usuário + empresa
 * - Login com RBAC (multi-tenant)
 * - Sessão (refresh token)
 * - Retorno de empresas do usuário
 *
 * =====================================================
 */

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
      // 🏢 empresa
      const company = await tx.company.create({
        data: { name: companyName },
      });

      // 👤 usuário
      const user = await authService.register({
        name,
        email,
        password,
      });

      /**
       * 🔐 buscar role ADMIN (RBAC)
       */
      const adminRole = await tx.role.findUnique({
        where: { name: "ADMIN" },
      });

      if (!adminRole) {
        throw new Error("Role ADMIN não encontrada");
      }

      // 🔗 membership
      await tx.membership.create({
        data: {
          userId: user.id,
          companyId: company.id,
          roleId: adminRole.id, // 🔥 corrigido
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
        companyId: result.company.id, // 🔥 obrigatório agora
      });

    /**
     * 🍪 COOKIE SEGURO
     */
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // 🔥 true em produção
      sameSite: "strict",
      path: "/api/auth/refresh",
    });

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
      error: error.message,
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

    /**
     * 🔥 BUSCAR EMPRESAS (MULTI-TENANT)
     */
    const memberships = await prisma.membership.findMany({
      where: { userId: user.id },
      include: {
        company: true,
        role: true,
      },
    });

    /**
     * 🍪 REFRESH TOKEN
     */
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/api/auth/refresh",
    });

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      companies: memberships.map((m) => ({
        id: m.company.id,
        name: m.company.name,
        role: m.role.name, // 🔥 corrigido
      })),
      accessToken,
    });

  } catch (error) {
    return res.status(400).json({
      error: error.message,
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
  me,
  logout,
};