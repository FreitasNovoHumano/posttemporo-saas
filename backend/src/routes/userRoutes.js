const express = require("express");
const { approveUser } = require("../controllers/userController");

const router = express.Router();

// 🔐 rota de admin
router.patch("/users/:id/approve", approveUser);

module.exports = router;