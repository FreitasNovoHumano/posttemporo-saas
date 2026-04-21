const prisma = require("../lib/prisma");

/**
 * 🔹 Timeline da empresa com status de leitura
 */
exports.getTimeline = async (companyId, userId) => {
  /**
   * 🔥 Busca membership (AGORA CORRETO)
   */
  const membership = await prisma.membership.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
  });

  const logs = await prisma.auditLog.findMany({
    where: {
      post: { companyId },
    },
    include: {
      user: true,
      post: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return logs.map((log) => ({
    ...log,
    isRead: membership?.lastReadAt
      ? log.createdAt <= membership.lastReadAt
      : false,
  }));
};