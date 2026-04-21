const prisma = require("../lib/prisma");

async function createComment(postId, content, userId) {
  return prisma.comment.create({
    data: { postId, content, userId },
  });
}

async function getComments(postId) {
  return prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "desc" },
  });
}

module.exports = {
  createComment,
  getComments,
};