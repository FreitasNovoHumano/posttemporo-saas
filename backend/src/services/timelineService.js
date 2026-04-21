const prisma = require("../lib/prisma");

exports.getTimeline = async (companyId) => {
  return prisma.auditLog.findMany({
    where: {
      post: {
        companyId,
      },
    },
    include: {
      user: true,
      post: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });
};