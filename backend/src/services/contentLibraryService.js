const prisma = require("../lib/prisma");

/**
 * Cria um conteúdo na biblioteca
 */
async function createContent(data) {
  return await prisma.contentLibrary.create({
    data
  });
}

/**
 * Lista conteúdos por empresa
 */
async function getContentsByCompany(companyId) {
  return await prisma.contentLibrary.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" }
  });
}

/**
 * Remove conteúdo
 */
async function deleteContent(id) {
  return await prisma.contentLibrary.delete({
    where: { id }
  });
}

module.exports = {
  createContent,
  getContentsByCompany,
  deleteContent
};