const express = require("express");
const router = express.Router();

const controller = require("../controllers/contentLibraryController");
const auth = require("../middlewares/authMiddleware");
const company = require("../middlewares/companyMiddleware");
const upload = require("../config/upload");

// Todas protegidas
router.use(auth, company);

/**
 * Upload imagem ou vídeo
 */
router.post("/", upload.single("file"), controller.create);

/**
 * Listar conteúdos
 */
router.get("/", controller.list);

/**
 * Deletar
 */
router.delete("/:id", controller.remove);

module.exports = router;