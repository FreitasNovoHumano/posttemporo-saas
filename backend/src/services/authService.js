const prisma = require("../lib/prisma");
const { io } = require("../server"); // 🔥 realtime
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/**
 * =====================================================
 * 📜 AUDIT SERVICE (PRO + REALTIME)
 * =====================================================
 *
 * ⚠️ NOTA:
 * Este serviço está dentro de authService temporariamente.
 * Em refactor futuro → services/audit.service.js
 *
 * 🎯 RESPONSABILIDADES:
 * - Log de ações
 * - Segurança multi-tenant
 * - Emissão em tempo real
 * - Base para auditoria avançada (meta, diff, etc)
 *
 * =====================================================
 */

/**
 * =====================================================
 * 🔐 AUTH (LOGIN - MULTI-TENANT + RBAC)
 * =====================================================
 */

/**
 * 🔹 Login com empresa + permissões
 */
async function login({ email, password, companyId }) {
  if (!email || !password || !companyId) {
    throw new Error("Email, senha e companyId são obrigatórios");
  }

  /**
   * 🔍 Buscar usuário
   */
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  /**
   * 🔐 Validar senha
   */
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new Error("Senha inválida");
  }

  /**
   * 🧠 Buscar membership (multi-empresa)
   */
  const membership = await prisma.membership.findFirst({
    where: {
      userId: user.id,
      companyId,
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
    throw new Error("Usuário não pertence a esta empresa");
  }

  /**
   * 🔐 ACCESS TOKEN (RBAC)
   */
  const accessToken = jwt.sign(
    {
      id: user.id,
      companyId: membership.companyId,
      role: membership.role.name,
      permissions: membership.role.permissions.map(
        (p) => p.permission.name
      ),
    },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  /**
   * 🔄 REFRESH TOKEN
   */
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  /**
   * 💾 Salvar refresh token no banco
   */
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
}

/**
 * 🔹 Registrar ação no sistema
 */
async function logAction({ action, postId, userId, companyId, meta }) {
  if (!action || !postId || !userId || !companyId) {
    throw new Error("Dados obrigatórios para log não informados");
  }

  const parsedPostId = Number(postId);

  const post = await prisma.post.findFirst({
    where: {
      id: parsedPostId,
      companyId,
    },
  });

  if (!post) {
    throw new Error("Post não encontrado ou não pertence à empresa");
  }

  const log = await prisma.auditLog.create({
    data: {
      action,
      postId: parsedPostId,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  try {
    if (io && companyId) {
      io.to(`company:${companyId}`).emit("timeline:update", log);
    }
  } catch (err) {
    console.warn("Erro ao emitir evento realtime:", err.message);
  }

  return log;
}

/**
 * 🔹 Buscar histórico de um post
 */
async function getLogsByPost(postId, companyId) {
  if (!postId || !companyId) {
    throw new Error("Parâmetros inválidos");
  }

  const parsedPostId = Number(postId);

  const post = await prisma.post.findFirst({
    where: {
      id: parsedPostId,
      companyId,
    },
  });

  if (!post) {
    throw new Error("Acesso negado a este post");
  }

  return prisma.auditLog.findMany({
    where: {
      postId: parsedPostId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * 🔹 Buscar logs da empresa inteira (timeline)
 */
async function getCompanyLogs(companyId) {
  if (!companyId) {
    throw new Error("companyId é obrigatório");
  }

  return prisma.auditLog.findMany({
    where: {
      post: {
        companyId,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });
}

module.exports = {
  login, // 🔥 NOVO
  logAction,
  getLogsByPost,
  getCompanyLogs,
};