const authService = require("../services/authService");
const prisma = require("../lib/prisma");
const generateToken = require("../utils/generateToken");

/**
 * 🔹 REGISTER (com criação de empresa)
 */
async function register(req, res) {
  try {
    const { name, email, password, companyName } = req.body;

    // 🔴 Validação básica
    if (!email || !password || !companyName) {
      return res.status(400).json({
        error: "Email, senha e nome da empresa são obrigatórios",
      });
    }

    // 🔥 Cria empresa (tenant)
    const company = await prisma.company.create({
      data: {
        name: companyName,
      },
    });

    // 🔥 Cria usuário vinculado à empresa
    const user = await authService.register({
      name,
      email,
      password,
      companyId: company.id,
    });

    // 🔥 Gera token com companyId
    const token = generateToken(user);

    return res.json({
      user,
      token,
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
    const user = await authService.login(req.body);

    // 🔥 Gera token com companyId
    const token = generateToken(user);

    return res.json({
      user,
      token,
    });

  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

/**
 * 🔹 GET USER LOGADO
 */
async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyId: true, // 🔥 importante agora
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "Usuário não encontrado",
      });
    }

    return res.json(user);

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