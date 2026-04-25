const prisma = require("../lib/prisma");
const { io } = require("../server");
const authService = require('./authService');

/**
 * =====================================================
 * 📌 STATUS
 * =====================================================
 */
const STATUS = {
  DRAFT: "DRAFT",
  SCHEDULED: "SCHEDULED",
  PUBLISHED: "PUBLISHED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

/**
 * =====================================================
 * 🧠 HELPERS
 * =====================================================
 */

function getStatusByDate(date) {
  if (!date) return STATUS.DRAFT;

  const now = new Date();
  const target = new Date(date);

  return target > now ? STATUS.SCHEDULED : STATUS.PUBLISHED;
}

/**
 * 🔒 Busca post garantindo isolamento por empresa
 */
async function findPostOrThrow(id, companyId) {
  const post = await prisma.post.findFirst({
    where: {
      id: Number(id),
      companyId,
    },
  });

  if (!post) throw new Error("Post não encontrado");

  return post;
}

/**
 * 🔐 Permissão baseada em role + autor
 */
function checkPermission(post, userId, role) {
  if (role !== "ADMIN" && post.authorId !== userId) {
    throw new Error("Não autorizado");
  }
}

/**
 * 🔄 Evento global
 */
function emitUpdate(companyId) {
  io.emit(`refreshPosts:${companyId}`);
}

/**
 * =====================================================
 * 🔹 CRIAR POST
 * =====================================================
 */
async function createPost(data, userId, companyId) {
  if (!data?.title?.trim()) {
    throw new Error("Título é obrigatório");
  }

  const post = await prisma.post.create({
    data: {
      title: data.title.trim(),
      content: data.content?.trim() || "",
      imageUrl: data.imageUrl || null,
      status: STATUS.DRAFT,
      authorId: userId,
      companyId,
    },
  });

  await audit.logAction({
    action: "CREATE_POST",
    postId: post.id,
    userId,
    companyId,
  });

  emitUpdate(companyId);
  return post;
}

/**
 * =====================================================
 * 🔹 LISTAR POSTS (MULTI-TENANT)
 * =====================================================
 */
async function getPosts({ companyId, userId, role, status, search }) {
  return prisma.post.findMany({
    where: {
      companyId,
      ...(role !== "ADMIN" && { authorId: userId }),
      ...(status && { status }),
      ...(search && {
        title: {
          contains: search,
          mode: "insensitive",
        },
      }),
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * =====================================================
 * 🔹 ATUALIZAR POST
 * =====================================================
 */
async function updatePost(id, data, userId, companyId, role) {
  const post = await findPostOrThrow(id, companyId);

  checkPermission(post, userId, role);

  const updated = await prisma.post.update({
    where: { id: Number(id) },
    data: {
      title: data.title,
      content: data.content,
      status: data.status || post.status,
    },
  });

  await audit.logAction({
    action: "UPDATE_POST",
    postId: id,
    userId,
    companyId,
  });

  emitUpdate(companyId);
  return updated;
}

/**
 * =====================================================
 * 🔹 APROVAR POST (ADMIN/EDITOR)
 * =====================================================
 */
async function approvePost(id, userId, companyId, role) {
  if (!["ADMIN", "EDITOR"].includes(role)) {
    throw new Error("Sem permissão para aprovar");
  }

  const post = await findPostOrThrow(id, companyId);

  const updated = await prisma.post.update({
    where: { id: Number(id) },
    data: {
      status: STATUS.APPROVED,
      approvedBy: userId,
      approvedAt: new Date(),
    },
  });

  await audit.logAction({
    action: "APPROVE_POST",
    postId: id,
    userId,
    companyId,
  });

  emitUpdate(companyId);
  return updated;
}

/**
 * =====================================================
 * 🔹 REJEITAR POST
 * =====================================================
 */
async function rejectPost(id, comment, userId, companyId, role) {
  if (!["ADMIN", "EDITOR"].includes(role)) {
    throw new Error("Sem permissão para rejeitar");
  }

  const post = await findPostOrThrow(id, companyId);

  const updated = await prisma.post.update({
    where: { id: Number(id) },
    data: {
      status: STATUS.REJECTED,
    },
  });

  await audit.logAction({
    action: "REJECT_POST",
    postId: id,
    userId,
    companyId,
  });

  emitUpdate(companyId);
  return updated;
}

/**
 * =====================================================
 * 🔹 DELETAR POST
 * =====================================================
 */
async function deletePost(id, userId, companyId, role) {
  const post = await findPostOrThrow(id, companyId);

  checkPermission(post, userId, role);

  await prisma.post.delete({
    where: { id: Number(id) },
  });

  await audit.logAction({
    action: "DELETE_POST",
    postId: id,
    userId,
    companyId,
  });

  emitUpdate(companyId);
}

/**
 * =====================================================
 * 🔹 AGENDAR POST
 * =====================================================
 */
async function schedulePost(id, date, userId, companyId) {
  const post = await findPostOrThrow(id, companyId);

  if (post.authorId !== userId) {
    throw new Error("Não autorizado");
  }

  const status = getStatusByDate(date);

  const updated = await prisma.post.update({
    where: { id: Number(id) },
    data: {
      scheduledDate: new Date(date),
      status,
    },
  });

  await audit.logAction({
    action: "SCHEDULE_POST",
    postId: id,
    userId,
    companyId,
  });

  emitUpdate(companyId);
  return updated;
}

module.exports = {
  createPost,
  getPosts,
  updatePost,
  approvePost,
  rejectPost,
  deletePost,
  schedulePost,
};