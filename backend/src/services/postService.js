const prisma = require("../lib/prisma");

/**
 * 📌 ENUM de status
 */
const STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  SCHEDULED: "SCHEDULED",
};

/**
 * 🔹 Criar post
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
      status: STATUS.PENDING,
      userId,
    },
  });
}

/**
 * 🔹 Listar posts (com filtro + role)
 */
async function getPosts({ userId, role, status, search }) {
  if (!userId) throw new Error("Usuário não autenticado");

  return prisma.post.findMany({
    where: {
      ...(role !== "ADMIN" && { userId }), // 🔥 admin vê tudo
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
 * 🔹 Métricas inteligentes (dashboard)
 */
async function getMetrics(userId) {
  if (!userId) throw new Error("Usuário não autenticado");

  const [posts, approved, pending, scheduled] = await Promise.all([
    prisma.post.count({ where: { userId } }),
    prisma.post.count({ where: { userId, status: STATUS.APPROVED } }),
    prisma.post.count({ where: { userId, status: STATUS.PENDING } }),
    prisma.post.count({ where: { userId, status: STATUS.SCHEDULED } }),
  ]);

  /**
   * 📊 Histórico por dia (dashboard avançado)
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
    history,
  };
}

/**
 * 🔹 Aprovar post
 */
async function approvePost(postId, userId) {
  const id = Number(postId);

  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) throw new Error("Post não encontrado");
  if (post.userId !== userId) throw new Error("Não autorizado");

  return prisma.post.update({
    where: { id },
    data: {
      status: STATUS.APPROVED,
      rejectionComment: null,
    },
  });
}

/**
 * 🔹 Rejeitar post
 */
async function rejectPost(postId, comment, userId) {
  const id = Number(postId);

  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) throw new Error("Post não encontrado");
  if (post.userId !== userId) throw new Error("Não autorizado");

  return prisma.post.update({
    where: { id },
    data: {
      status: STATUS.REJECTED,
      rejectionComment: comment?.trim() || "Sem comentário",
    },
  });
}

/**
 * 🔹 Atualizar post
 */
async function updatePost(id, data, userId, role) {
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!post) throw new Error("Post não encontrado");

  if (role !== "ADMIN" && post.userId !== userId) {
    throw new Error("Não autorizado");
  }

  return prisma.post.update({
    where: { id: Number(id) },
    data: {
      title: data.title,
      description: data.description,
    },
  });
}

/**
 * 🔹 Deletar post
 */
async function deletePost(id, userId, role) {
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!post) throw new Error("Post não encontrado");

  if (role !== "ADMIN" && post.userId !== userId) {
    throw new Error("Não autorizado");
  }

  return prisma.post.delete({
    where: { id: Number(id) },
  });
}

/**
 * 🔹 Agendar post (CALENDÁRIO)
 */
async function schedulePost(id, date, userId) {
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!post) throw new Error("Post não encontrado");
  if (post.userId !== userId) throw new Error("Não autorizado");

  return prisma.post.update({
    where: { id: Number(id) },
    data: {
      scheduledDate: new Date(date),
      status: STATUS.SCHEDULED, // 🔥 importante pro calendário
    },
  });
}

/**
 * 📦 EXPORTAÇÃO
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