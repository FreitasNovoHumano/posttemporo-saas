const prisma = require("../lib/prisma");

module.exports = (permission) => {
  return async (req, res, next) => {
    const hasPermission = await prisma.userPermission.findFirst({
      where: {
        userId: req.user.userId,
        companyId: req.companyId,
        permission,
      },
    });

    if (!hasPermission) {
      return res.status(403).json({
        error: "Permissão insuficiente",
      });
    }

    next();
  };
};