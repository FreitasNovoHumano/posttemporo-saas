const prisma = require("../lib/prisma");

/**
 * 📌 ENUM de status (alinhado com Prisma)
 */
const STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

/**
 * 🔹 Criar post
 */
async function createPost(data, userId) {
  if (!data || !data.title?.trim()) {
    throw new Error("Título é obrigatório");
  }

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  return prisma.post.create({
    data: {
      title: data.title.trim(),
      description: data.description?.trim() || "",
      image: data.image || null,
      status: STATUS.PENDING, // 🔥 padrão consistente
      userId,
    },
  });
}

/**
 * 🔹 Listar posts do usuário
 */
async function getPosts(userId) {
  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  return prisma.post.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * 🔹 Métricas do dashboard
 */
async function getMetrics(userId) {
  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  // 🔥 Executa em paralelo (mais performático)
  const [total, approved, pending] = await Promise.all([
    prisma.post.count({ where: { userId } }),
    prisma.post.count({ where: { userId, status: STATUS.APPROVED } }),
    prisma.post.count({ where: { userId, status: STATUS.PENDING } }),
  ]);

  return {
    total,
    approved,
    pending,
    approvalRate:
      total > 0 ? Number(((approved / total) * 100).toFixed(2)) : 0,
  };
}

/**
 * 🔹 Aprovar post
 */
async function approvePost(postId, userId) {
  const id = Number(postId);

  if (!id) throw new Error("ID inválido");
  if (!userId) throw new Error("Usuário não autenticado");

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) throw new Error("Post não encontrado");

  // 🔐 Segurança (multi-tenant)
  if (post.userId !== userId) {
    throw new Error("Não autorizado");
  }

  if (post.status === STATUS.APPROVED) {
    throw new Error("Post já aprovado");
  }

  return prisma.post.update({
    where: { id },
    data: {
      status: STATUS.APPROVED,
      rejectionComment: null, // limpa rejeição anterior
    },
  });
}

/**
 * 🔹 Rejeitar post
 */
async function rejectPost(postId, comment, userId) {
  const id = Number(postId);

  if (!id) throw new Error("ID inválido");
  if (!userId) throw new Error("Usuário não autenticado");

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) throw new Error("Post não encontrado");

  // 🔐 Segurança
  if (post.userId !== userId) {
    throw new Error("Não autorizado");
  }

  if (post.status === STATUS.REJECTED) {
    throw new Error("Post já rejeitado");
  }

  return prisma.post.update({
    where: { id },
    data: {
      status: STATUS.REJECTED,
      rejectionComment: comment?.trim() || "Sem comentário",
    },
  });
}

async function updatePost(id, data, userId) {
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!post) throw new Error("Post não encontrado");

  if (post.userId !== userId) {
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

async function deletePost(id, userId) {
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!post) throw new Error("Post não encontrado");

  if (post.userId !== userId) {
    throw new Error("Não autorizado");
  }

  return prisma.post.delete({
    where: { id: Number(id) },
  });
}

async function schedulePost(id, date, userId) {
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!post) throw new Error("Post não encontrado");

  if (post.userId !== userId) {
    throw new Error("Não autorizado");
  }

  return prisma.post.update({
    where: { id: Number(id) },
    data: {
      scheduledAt: new Date(date),
    },
  });
}

module.exports = {
  createPost,
  getPosts,
  getMetrics,
  approvePost,
  rejectPost,
  deletePost
};