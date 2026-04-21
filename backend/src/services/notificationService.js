const prisma = require("../lib/prisma");
const { io } = require("../server");

/**
 * 🔹 Criar notificação
 */
exports.createNotification = async ({
  userId,
  message,
  companyId,
}) => {
  const notification = await prisma.notification.create({
    data: {
      userId,
      message,
    },
  });

  /**
   * 🔥 TEMPO REAL
   */
  io.to(`company:${companyId}`).emit(
    "notification:new",
    notification
  );

  return notification;
};