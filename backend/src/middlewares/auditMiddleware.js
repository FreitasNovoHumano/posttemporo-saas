//const audit = require("../services/auditService");

module.exports = function auditMiddleware(action) {
  return async (req, res, next) => {
    res.on("finish", async () => {
      if (res.statusCode < 400) {
        try {
          await audit.logAction({
            action,
            postId: req.params.id,
            userId: req.user.userId,
            companyId: req.companyId,
          });
        } catch (err) {
          console.error("Erro audit:", err);
        }
      }
    });

    next();
  };
};