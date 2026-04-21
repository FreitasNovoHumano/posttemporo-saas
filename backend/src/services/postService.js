const prisma = require("../lib/prisma");
const { io } = require("../server"); // 🔥 IMPORTANTE

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

  if (target > now) return STATUS.SCHEDULED;

  return STATUS.PUBLISHED;
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

  io.emit("refreshPosts"); // 🔥 tempo real

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

  /**
   * 🔔 Notificação
   */
  await prisma.notification.create({
    data: {
      userId: post.userId,
      message: "Post aprovado!",
    },
  });

  io.emit("refreshPosts"); // 🔥 tempo real

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

  io.emit("refreshPosts"); // 🔥 tempo real

  return updated;
}

/**
 * =====================================================
 * 🔹 ATUALIZAR POST (KANBAN)
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
      status: data.status, // 🔥 importante pro Kanban
    },
  });

  io.emit("refreshPosts"); // 🔥 tempo real

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

  const deleted = await prisma.post.delete({
    where: { id: Number(id) },
  });

  io.emit("refreshPosts");

  return deleted;
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

  io.emit("refreshPosts");

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
  getMetrics,
  approvePost,
  rejectPost,
  updatePost,
  deletePost,
  schedulePost,
};