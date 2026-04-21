const cron = require("node-cron");
const prisma = require("../lib/prisma");

/**
 * =====================================================
 * ⏰ JOB — PUBLICAR POSTS AUTOMATICAMENTE
 * =====================================================
 * - Roda a cada minuto
 * - Atualiza posts agendados para publicados
 */

function startPublishPostsJob() {
  cron.schedule("* * * * *", async () => {
    try {
      const result = await prisma.post.updateMany({
        where: {
          scheduledDate: { lte: new Date() },
          status: "SCHEDULED",
        },
        data: {
          status: "PUBLISHED",
        },
      });

      if (result.count > 0) {
        console.log(`🚀 ${result.count} posts publicados automaticamente`);
      }

    } catch (error) {
      console.error("❌ Erro no cron de publicação:", error);
    }
  });

  await prisma.notification.create({
  data: {
    userId: post.userId,
    message: "Post publicado automaticamente 🚀",
  },
});
}

module.exports = startPublishPostsJob;