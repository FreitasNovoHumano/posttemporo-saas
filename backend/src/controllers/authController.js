const authService = require("../services/authService");

// 🔹 Registro
async function register(req, res) {
  try {
    const user = await authService.register(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// 🔹 Login
async function login(req, res) {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * 🔹 Retorna usuário logado
 */
async function me(req, res) {
  try {
    const prisma = require("../lib/prisma");

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.json(user);

  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
}

module.exports = {
  register,
  login,
  me
};