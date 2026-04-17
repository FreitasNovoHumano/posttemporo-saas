const prisma = require("../lib/prisma");

// 🔹 Criar post
async function createPost(data) {
  if (!data || !data.title) {
    throw new Error("Dados inválidos");
  }

  return prisma.post.create({
    data: {
      title: data.title,
      description: data.description || "",
    },
  });
}

// 🔹 Listar posts
async function getPosts() {
  return prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

module.exports = {
  createPost,
  getPosts,
};