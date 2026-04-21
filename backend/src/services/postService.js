const prisma = require("../lib/prisma");

/**
 * =====================================================
 * 📌 ENUM DE STATUS (PADRÃO DO SISTEMA)
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
 * 🧠 HELPER — STATUS AUTOMÁTICO
 * =====================================================
 * Regras:
 * - Sem data → DRAFT
 * - Data futura → SCHEDULED
 * - Data passada → PUBLISHED
 */
function getStatusByDate(date) {
  if (!date) return STATUS.DRAFT;

  const now = new Date();
  const target = new Date(date);

  if (target > now) return STATUS.SCHEDULED;

  return STATUS.PUBLISHED;
}

/**
 * =====================================================
 * 🔍 HELPER — BUSCAR POST COM SEGURANÇA
 * =====================================================
 */
async function findPostOrThrow(id) {
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!post) {
    throw new Error("Post não encontrado");
  }

  return post;
}

/**
 * =====================================================
 * 🔐 HELPER — AUTORIZAÇÃO
 * =====================================================
 */
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

  return prisma.post.create({
    data: {
      title: data.title.trim(),
      description: data.description?.trim() || "",
      image: data.image || null,
      status: STATUS.DRAFT,
      userId,
    },
  });
}

/**
 * =====================================================
 * 🔹 LISTAR POSTS (FILTRO + ROLE)
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
 * 🔹 MÉTRICAS (DASHBOARD INTELIGENTE)
 * =====================================================
 */
async function getMetrics(userId) {
  if (!userId) throw new Error("Usuário não autenticado");

  const [posts, approved, pending, scheduled, published] =
    await Promise.all([
      prisma.post.count({ where: { userId } }),
      prisma.post.count({ where: { userId, status: STATUS.APPROVED } }),
      prisma.post.count({ where: { userId, status: STATUS.PENDING } }),
      prisma.post.count({ where: { userId, status: STATUS.SCHEDULED } }),
      prisma.post.count({ where: { userId, status: STATUS.PUBLISHED } }),
    ]);

  /**
   * 📊 Histórico por dia
   */
  const history = await prisma.$queryRaw`
    SELECT DATE("createdAt") as date, COUNT(*) as total
    FROM "Post"
    WHERE "userId" = ${userId}
    GROUP BY DATE("createdAt")
    ORDER BY date ASC
  `;

  return {
    posts,
    approved,
    pending,
    scheduled,
    published,
    history,
  };
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

  return prisma.post.update({
    where: { id: Number(postId) },
    data: {
      status: STATUS.APPROVED,
      rejectionComment: null,
    },
  });

   const updated = await prisma.post.update({
    where: { id: Number(postId) },
    data: {
      status: STATUS.APPROVED,
      rejectionComment: null,
    },
  });

  /**
   * 🔔 NOTIFICAÇÃO
   */
  await prisma.notification.create({
    data: {
      userId: post.userId,
      message: "Post aprovado!",
    },
  });

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

  return prisma.post.update({
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
}

/**
 * =====================================================
 * 🔹 ATUALIZAR POST
 * =====================================================
 */
async function updatePost(id, data, userId, role) {
  const post = await findPostOrThrow(id);

  checkPermission(post, userId, role);

  return prisma.post.update({
    where: { id: Number(id) },
    data: {
      title: data.title,
      description: data.description,
    },
  });
}

/**
 * =====================================================
 * 🔹 DELETAR POST
 * =====================================================
 */
async function deletePost(id, userId, role) {
  const post = await findPostOrThrow(id);

  checkPermission(post, userId, role);

  return prisma.post.delete({
    where: { id: Number(id) },
  });
}

/**
 * =====================================================
 * 🔹 AGENDAR POST (COM STATUS AUTOMÁTICO)
 * =====================================================
 */
async function schedulePost(id, date, userId) {
  const post = await findPostOrThrow(id);

  if (post.userId !== userId) {
    throw new Error("Não autorizado");
  }

  const status = getStatusByDate(date);

  return prisma.post.update({
    where: { id: Number(id) },
    data: {
      scheduledDate: new Date(date),
      status, // 🔥 agora automático
    },
  });
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