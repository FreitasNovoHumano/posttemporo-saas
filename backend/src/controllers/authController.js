/**
 * =====================================================
 * 🔐 AUTH CONTROLLER (PRO - SAAS READY)
 * =====================================================
 *
 * 🎯 RESPONSABILIDADES:
 * - Autenticação real com banco
 * - Geração de tokens
 * - Multi-tenant context
 *
 * =====================================================
 */

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");

// 🔐 PADRÃO GLOBAL
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

/**
 * 📝 REGISTER
 */
async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email e senha obrigatórios",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        name,
      },
    });

    return res.status(201).json({
      message: "Usuário criado",
      user,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro ao registrar",
    });
  }
}

/**
 * 🔐 LOGIN
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "Usuário não encontrado",
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        error: "Senha inválida",
      });
    }

    // 🔥 pega primeira empresa (MVP)
    const membership = user.memberships[0];

    const payload = {
      id: user.id,
      companyId: membership?.companyId,
      role: membership?.role?.name,
    };

    const accessToken = jwt.sign(payload, ACCESS_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // true em produção
    });

    return res.json({ accessToken });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro no login",
    });
  }
}

/**
 * 🔄 REFRESH
 */
async function refresh(req, res) {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        error: "NO_REFRESH_TOKEN",
      });
    }

    const decoded = jwt.verify(token, REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        companyId: decoded.companyId,
        role: decoded.role,
      },
      ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({ accessToken: newAccessToken });

  } catch {
    return res.status(401).json({
      error: "INVALID_REFRESH",
    });
  }
}

/**
 * 👤 ME
 */
async function me(req, res) {
  return res.json({
    user: req.user,
  });
}

/**
 * 🚪 LOGOUT
 */
async function logout(req, res) {
  res.clearCookie("refreshToken");

  return res.json({
    message: "Logout realizado",
  });
}

module.exports = {
  register,
  login,
  refresh,
  me,
  logout,
};