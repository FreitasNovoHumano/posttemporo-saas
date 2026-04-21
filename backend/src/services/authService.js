const prisma = require("../lib/prisma");
const { io } = require("../server"); // 🔥 realtime

/**
 * =====================================================
 * 📜 AUDIT SERVICE (PRO + REALTIME)
 * =====================================================
 * - Log de ações
 * - Multi-tenant seguro
 * - Emissão em tempo real
 * - Preparado para auditoria avançada
 * =====================================================
 */

/**
 * 🔹 Registrar ação no sistema
 */
async function logAction({ action, postId, userId, companyId, meta }) {
  /**
   * 🔒 Segurança: valida se o post pertence à empresa
   */
  const post = await prisma.post.findFirst({
    where: {
      id: Number(postId),
      companyId,
    },
  });

  if (!post) {
    throw new Error("Post não encontrado ou não pertence à empresa");
  }

  /**
   * 📝 Criar log com include (IMPORTANTE pra timeline)
   */
  const log = await prisma.auditLog.create({
    data: {
      action,
      postId,
      userId,
      // 🔥 se adicionar no prisma:
      // meta,
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

  /**
   * 🔥 TEMPO REAL (por empresa)
   */
  if (io && companyId) {
    io.to(`company:${companyId}`).emit("timeline:update", log);
  }

  return log;
}

/**
 * 🔹 Buscar histórico de um post
 */
async function getLogsByPost(postId, companyId) {
  const post = await prisma.post.findFirst({
    where: {
      id: Number(postId),
      companyId,
    },
  });

  if (!post) {
    throw new Error("Acesso negado a este post");
  }

  return prisma.auditLog.findMany({
    where: {
      postId: Number(postId),
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
    take: 50, // 🔥 limite pra performance
  });
}

module.exports = {
  logAction,
  getLogsByPost,
  getCompanyLogs,
};