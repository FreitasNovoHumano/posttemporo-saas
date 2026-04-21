const prisma = require("../lib/prisma");

/**
 * =====================================================
 * 📦 POST SERVICE (PRO - MULTI-TENANT + RBAC)
 * =====================================================
 * - Isolamento por empresa
 * - Controle por role
 * - Validações centralizadas
 * =====================================================
 */

/**
 * 🔹 LISTAR POSTS
 */
async function getPosts({
  userId,
  role,
  companyId,
  status,
  search,
}) {
  return prisma.post.findMany({
    where: {
      companyId,

      /**
       * 🔒 VIEWER só vê próprios posts
       */
      ...(role === "VIEWER" && { authorId: userId }),

      ...(status && { status }),

      ...(search && {
        title: { contains: search, mode: "insensitive" },
      }),
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * 🔹 BUSCAR POST POR ID
 */
async function getPostById({ id, companyId }) {
  const post = await prisma.post.findFirst({
    where: {
      id: Number(id),
      companyId,
    },
  });

  if (!post) {
    throw new Error("Post não encontrado");
  }

  return post;
}

/**
 * 🔹 CRIAR POST
 */
async function createPost({
  title,
  content,
  imageUrl,
  authorId,
  companyId,
}) {
  return prisma.post.create({
    data: {
      title,
      content,
      imageUrl,
      authorId,
      companyId,
    },
  });
}

/**
 * 🔹 ATUALIZAR POST
 */
async function updatePost({
  id,
  data,
  userId,
  role,
  companyId,
}) {
  const post = await prisma.post.findFirst({
    where: {
      id: Number(id),
      companyId,
    },
  });

  if (!post) {
    throw new Error("Post não encontrado");
  }

  /**
   * 🔒 Regra de permissão
   */
  if (role !== "ADMIN" && post.authorId !== userId) {
    throw new Error("Sem permissão para editar este post");
  }

  return prisma.post.update({
    where: { id: Number(id) },
    data,
  });
}

/**
 * 🔹 DELETAR POST
 */
async function deletePost({
  id,
  userId,
  role,
  companyId,
}) {
  const post = await prisma.post.findFirst({
    where: {
      id: Number(id),
      companyId,
    },
  });

  if (!post) {
    throw new Error("Post não encontrado");
  }

  /**
   * 🔒 Apenas ADMIN ou autor
   */
  if (role !== "ADMIN" && post.authorId !== userId) {
    throw new Error("Sem permissão para deletar");
  }

  return prisma.post.delete({
    where: { id: Number(id) },
  });
}

/**
 * 🔹 AGENDAR POST
 */
async function schedulePost({
  id,
  date,
  userId,
  companyId,
}) {
  const post = await prisma.post.findFirst({
    where: {
      id: Number(id),
      companyId,
    },
  });

  if (!post) {
    throw new Error("Post não encontrado");
  }

  return prisma.post.update({
    where: { id: Number(id) },
    data: {
      scheduledDate: new Date(date),
      status: "SCHEDULED",
    },
  });
}

/**
 * 🔹 APROVAR POST
 */
async function approvePost({ id, userId, companyId }) {
  return prisma.post.update({
    where: { id: Number(id) },
    data: {
      status: "APPROVED",
      approvedBy: userId,
      approvedAt: new Date(),
    },
  });
}

/**
 * 🔹 REJEITAR POST
 */
async function rejectPost({ id, comment, userId, companyId }) {
  return prisma.post.update({
    where: { id: Number(id) },
    data: {
      status: "REJECTED",
    },
  });
}

/**
 * 🔹 MÉTRICAS
 */
async function getMetrics({ companyId }) {
  const [total, published, scheduled] = await Promise.all([
    prisma.post.count({ where: { companyId } }),
    prisma.post.count({
      where: { companyId, status: "PUBLISHED" },
    }),
    prisma.post.count({
      where: { companyId, status: "SCHEDULED" },
    }),
  ]);

  return {
    total,
    published,
    scheduled,
  };
}

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  schedulePost,
  approvePost,
  rejectPost,
  getMetrics,
};