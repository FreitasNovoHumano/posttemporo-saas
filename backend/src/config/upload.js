const multer = require("multer");
const path = require("path");

/**
 * 📦 Caminho absoluto da pasta uploads
 */
const uploadPath = path.resolve(__dirname, "../../uploads");

/**
 * 📦 Configuração de armazenamento
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const extension = path.extname(file.originalname);

    cb(null, uniqueName + extension);
  },
});

/**
 * 🛡️ Filtro de arquivos (AGORA DEFINIDO 🔥)
 */
function fileFilter(req, file, cb) {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Apenas imagens JPG ou PNG são permitidas"));
  }
}

/**
 * 📏 Limite de tamanho
 */
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
};

/**
 * 🚀 Exporta multer configurado
 */
module.exports = multer({
  storage,
  fileFilter,
  limits,
});