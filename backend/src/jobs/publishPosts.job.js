const cron = require("node-cron");
const prisma = require("../lib/prisma");

/**
 * =====================================================
 * ⏰ JOB: PUBLICAR POSTS AUTOMATICAMENTE
 * =====================================================
 * - Roda a cada minuto
 * - Busca posts agendados
 * - Publica automaticamente
 * =====================================================
 */

function startPublishPostsJob(io) {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const posts = await prisma.post.findMany({
        where: {
          scheduledDate: {
            lte: now,
          },
          status: "SCHEDULED",
        },
      });

      if (posts.length === 0) return;

      for (const post of posts) {
        await prisma.post.update({
          where: { id: post.id },
          data: {
            status: "PUBLISHED",
          },
        });

        /**
         * 🔔 Notificação
         */
        await prisma.notification.create({
          data: {
            userId: post.userId,
            message: `Seu post "${post.title}" foi publicado 🚀`,
          },
        });
      }

      /**
       * 🔌 Atualiza frontend (tempo real)
       */
      io.emit("refreshPosts");

      console.log(`✅ ${posts.length} posts publicados automaticamente`);

    } catch (error) {
      console.error("❌ Erro no cron:", error);
    }
  });
}

module.exports = startPublishPostsJob;