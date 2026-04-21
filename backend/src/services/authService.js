const prisma = require("../lib/prisma");

/**
 * =====================================================
 * 📜 AUDIT SERVICE (LOG DE AÇÕES)
 * =====================================================
 * Responsável por:
 * - Registrar ações do sistema
 * - Permitir auditoria por post
 * =====================================================
 */

/**
 * 🔹 Registrar ação
 */
async function logAction(action, postId, userId) {
  return prisma.auditLog.create({
    data: {
      action,
      postId,
      userId,
    },
  });
}

/**
 * 🔹 Buscar histórico por post
 */
async function getLogs(postId) {
  return prisma.auditLog.findMany({
    where: { postId: Number(postId) },
    orderBy: { createdAt: "desc" },
  });
}

module.exports = {
  logAction,
  getLogs,
};