const authService = require("../services/authService");
const prisma = require("../lib/prisma");

/**
 * =====================================================
 * 🔐 AUTH CONTROLLER
 * =====================================================
 * Responsável por:
 * - Registro de usuário + empresa (multi-tenant)
 * - Login
 * - Retornar usuário autenticado
 * =====================================================
 */

/**
 * 🔹 REGISTER (cria empresa + vínculo via Membership)
 */
async function register(req, res) {
  try {
    const { name, email, password, companyName } = req.body;

    // 🔴 Validação
    if (!email || !password || !companyName) {
      return res.status(400).json({
        error: "Email, senha e nome da empresa são obrigatórios",
      });
    }

    /**
     * 🔒 Verifica se usuário já existe
     */
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Usuário já existe",
      });
    }

    /**
     * 🔥 Transação (garante consistência)
     */
    const result = await prisma.$transaction(async (tx) => {
      /**
       * 🏢 Cria empresa (tenant)
       */
      const company = await tx.company.create({
        data: {
          name: companyName,
        },
      });

      /**
       * 👤 Cria usuário
       */
      const user = await authService.register({
        name,
        email,
        password,
      });

      /**
       * 🔗 Cria vínculo (Membership)
       * Usuário vira ADMIN da empresa
       */
      await tx.membership.create({
        data: {
          userId: user.id,
          companyId: company.id,
          role: "ADMIN",
        },
      });

      return { user, company };
    });

    /**
     * 🔐 Login automático após registro
     */
    const { accessToken, refreshToken } = await authService.login({
      email,
      password,
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
      refreshToken,
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
    const { user, accessToken, refreshToken } =
      await authService.login(req.body);

    /**
     * 🔥 Retorna empresas do usuário
     */
    const memberships = await prisma.membership.findMany({
      where: {
        userId: user.id,
      },
      include: {
        company: true,
      },
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
        role: m.role,
      })),
      accessToken,
      refreshToken,
    });

  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

/**
 * 🔹 GET USER LOGADO (/me)
 */
async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        memberships: {
          include: {
            company: true,
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
        role: m.role,
      })),
    });

  } catch (error) {
    console.error("ERRO /me:", error);

    return res.status(500).json({
      error: "Erro ao buscar usuário",
    });
  }
}

module.exports = {
  register,
  login,
  me,
};