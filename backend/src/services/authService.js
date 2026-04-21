const prisma = require("../lib/prisma");

/**
 * =====================================================
 * 📜 AUDIT SERVICE (LOG DE AÇÕES)
 * =====================================================
 * Responsável por:
 * - Registrar ações do sistema
 * - Garantir isolamento por empresa (multi-tenant)
 * - Permitir auditoria detalhada
 * =====================================================
 */

/**
 * 🔹 Registrar ação no sistema
 *
 * @param {Object} params
 * @param {string} params.action - Ação realizada (ex: CREATE_POST)
 * @param {number} params.postId - ID do post relacionado
 * @param {string} params.userId - ID do usuário que executou
 * @param {string} params.companyId - ID da empresa (multi-tenant)
 * @param {Object} [params.meta] - Dados extras (opcional)
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

  return prisma.auditLog.create({
    data: {
      action,
      postId,
      userId,
      /**
       * 💡 Se quiser evoluir:
       * adicionar campo JSON no schema → meta Json?
       */
    },
  });
}

/**
 * 🔹 Buscar histórico de um post (multi-tenant seguro)
 *
 * @param {number} postId
 * @param {string} companyId
 */
async function getLogsByPost(postId, companyId) {
  /**
   * 🔒 Garante isolamento por empresa
   */
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
 * 🔹 Buscar logs da empresa inteira (admin/debug)
 *
 * @param {string} companyId
 */
async function getCompanyLogs(companyId) {
  return prisma.auditLog.findMany({
    where: {
      post: {
        companyId,
      },
    },
    include: {
      user: true,
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
  });
}

module.exports = {
  logAction,
  getLogsByPost,
  getCompanyLogs,
};