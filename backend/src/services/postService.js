const prisma = require("../lib/prisma");
const { io } = require("../server");
const audit = require("./auditService");

/**
 * =====================================================
 * 📌 ENUM DE STATUS
 * =====================================================
 */
const STATUS = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  SCHEDULED: "SCHEDULED",
  PUBLISHED: "PUBLISHED",
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

async function findPostOrThrow(id) {
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!post) throw new Error("Post não encontrado");

  return post;
}

function checkPermission(post, userId, role) {
  if (role !== "ADMIN" && post.userId !== userId) {
    throw new Error("Não autorizado");
  }
}

/**
 * 🔄 Disparos globais (centralizado)
 */
function emitUpdate() {
  io.emit("refreshPosts");
}

/**
 * =====================================================
 * 🔹 CRIAR POST
 * =====================================================
 */
async function createPost(data, userId) {
  if (!data?.title?.trim()) {
    throw new Error("Título é obrigatório");
  }

  const post = await prisma.post.create({
    data: {
      title: data.title.trim(),
      description: data.description?.trim() || "",
      image: data.image || null,
      status: STATUS.DRAFT,
      userId,
    },
  });

  await audit.logAction("CREATE", post.id, userId);

  emitUpdate();
  return post;
}

/**
 * =====================================================
 * 🔹 LISTAR POSTS
 * =====================================================
 */
async function getPosts({ userId, role, status, search }) {
  if (!userId) throw new Error("Usuário não autenticado");

  return prisma.post.findMany({
    where: {
      ...(role !== "ADMIN" && { userId }),
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
 * 🔹 ATUALIZAR POST (KANBAN + EDIT)
 * =====================================================
 */
async function updatePost(id, data, userId, role) {
  const post = await findPostOrThrow(id);

  checkPermission(post, userId, role);

  const updated = await prisma.post.update({
    where: { id: Number(id) },
    data: {
      title: data.title,
      description: data.description,
      status: data.status || post.status,
    },
  });

  await audit.logAction("UPDATE", id, userId);

  emitUpdate();
  return updated;
}

/**
 * =====================================================
 * 🔹 APROVAR POST
 * =====================================================
 */
async function approvePost(postId, userId) {
  const post = await findPostOrThrow(postId);

  if (post.userId !== userId) {
    throw new Error("Não autorizado");
  }

  const updated = await prisma.post.update({
    where: { id: Number(postId) },
    data: {
      status: STATUS.APPROVED,
      rejectionComment: null,
    },
  });

  await prisma.notification.create({
    data: {
      userId: post.userId,
      message: "Post aprovado!",
    },
  });

  await audit.logAction("APPROVED", postId, userId);

  emitUpdate();
  return updated;
}

/**
 * =====================================================
 * 🔹 REJEITAR POST
 * =====================================================
 */
async function rejectPost(postId, comment, userId) {
  const post = await findPostOrThrow(postId);

  if (post.userId !== userId) {
    throw new Error("Não autorizado");
  }

  const updated = await prisma.post.update({
    where: { id: Number(postId) },
    data: {
      status: STATUS.REJECTED,
      rejectionComment: comment?.trim() || "Sem comentário",
    },
  });

  await prisma.notification.create({
    data: {
      userId: post.userId,
      message: "Post rejeitado",
    },
  });

  await audit.logAction("REJECTED", postId, userId);

  emitUpdate();
  return updated;
}

/**
 * =====================================================
 * 🔹 DELETAR POST
 * =====================================================
 */
async function deletePost(id, userId, role) {
  const post = await findPostOrThrow(id);

  checkPermission(post, userId, role);

  await prisma.post.delete({
    where: { id: Number(id) },
  });

  await audit.logAction("DELETE", id, userId);

  emitUpdate();
}

/**
 * =====================================================
 * 🔹 AGENDAR POST
 * =====================================================
 */
async function schedulePost(id, date, userId) {
  const post = await findPostOrThrow(id);

  if (post.userId !== userId) {
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

  await audit.logAction("SCHEDULED", id, userId);

  emitUpdate();
  return updated;
}

/**
 * =====================================================
 * 📦 EXPORTAÇÃO
 * =====================================================
 */
module.exports = {
  createPost,
  getPosts,
  updatePost,
  approvePost,
  rejectPost,
  deletePost,
  schedulePost,
};