const prisma = require("../lib/prisma");

async function approveUser(req, res) {
  const { id } = req.params;

  const user = await prisma.user.update({
    where: { id },
    data: {
      approved: true,
      status: "ACTIVE",
    },
  });

  res.json(user);
}

module.exports = {
  approveUser,
};