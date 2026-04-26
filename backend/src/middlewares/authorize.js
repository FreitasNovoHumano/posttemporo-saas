const jwt = require("jsonwebtoken");
const { ROLE_PERMISSIONS } = require("../config/permissions");

const ACCESS_SECRET = "ACCESS_SECRET";

module.exports = function authorize(permission) {
  return (req, res, next) => {
    const auth = req.headers.authorization;

    if (!auth) return res.status(401).end();

    try {
      const token = auth.split(" ")[1];
      const user = jwt.verify(token, ACCESS_SECRET);

      const permissions =
        ROLE_PERMISSIONS[user.role] || [];

      if (!permissions.includes(permission)) {
        return res.status(403).json({
          error: "FORBIDDEN",
        });
      }

      req.user = user;
      next();
    } catch {
      return res.status(401).end();
    }
  };
};