const prisma = require("../lib/prisma");

/**
 * =====================================================
 * 🔹 LISTAR POSTS (ISOLADO POR EMPRESA)
 * =====================================================
 */
async function getPosts({ userId, role, companyId, status, search }) {
  return prisma.post.findMany({
    where: {
      companyId, // 🔥 MULTI-TENANT
      ...(role !== "ADMIN" && { authorId: userId }),
      ...(status && { status }),
      ...(search && {
        title: { contains: search, mode: "insensitive" },
      }),
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * =====================================================
 * 🔹 BUSCAR POST POR ID
 * =====================================================
 */
async function getPostById(id, companyId) {
  return prisma.post.findFirst({
    where: {
      id: Number(id),
      companyId, // 🔥 BLOQUEIO DE EMPRESA
    },
  });
}

/**
 * =====================================================
 * 🔹 CRIAR POST
 * =====================================================
 */
async function createPost(data, user) {
  return prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl,
      authorId: user.id,
      companyId: user.companyId, // 🔥 ESSENCIAL
    },
  });
}

/**
 * =====================================================
 * 🔹 ATUALIZAR POST
 * =====================================================
 */
async function updatePost(id, data, user) {
  const post = await prisma.post.findFirst({
    where: {
      id: Number(id),
      companyId: user.companyId,
    },
  });

  if (!post) throw new Error("Post não encontrado");

  return prisma.post.update({
    where: { id: Number(id) },
    data,
  });
}

/**
 * =====================================================
 * 🔹 DELETAR POST
 * =====================================================
 */
async function deletePost(id, user) {
  const post = await prisma.post.findFirst({
    where: {
      id: Number(id),
      companyId: user.companyId,
    },
  });

  if (!post) throw new Error("Post não encontrado");

  return prisma.post.delete({
    where: { id: Number(id) },
  });
}

/**
 * =====================================================
 * 🔹 AGENDAR POST
 * =====================================================
 */
async function schedulePost(id, date, user) {
  const post = await prisma.post.findFirst({
    where: {
      id: Number(id),
      companyId: user.companyId,
    },
  });

  if (!post) throw new Error("Post não encontrado");

  return prisma.post.update({
    where: { id: Number(id) },
    data: {
      scheduledDate: new Date(date),
      status: "SCHEDULED",
    },
  });
}

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  schedulePost,
};