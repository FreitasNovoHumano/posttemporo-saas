const multer = require("multer");

/**
 * =====================================================
 * 📦 UPLOAD CONFIG (PRO - MEMORY STORAGE)
 * =====================================================
 * - Não salva em disco
 * - Permite compressão com sharp
 * - Pronto para envio ao S3
 * =====================================================
 */

/**
 * 🧠 Armazena em memória (buffer)
 */
const storage = multer.memoryStorage();

/**
 * 🛡️ Filtro de arquivos (segurança)
 */
function fileFilter(req, file, cb) {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Formato inválido. Use JPG, PNG ou WEBP."
      )
    );
  }
}

/**
 * 📏 Limite de tamanho (5MB)
 */
const limits = {
  fileSize: 5 * 1024 * 1024,
};

/**
 * 🚀 Exporta multer configurado
 */
module.exports = multer({
  storage,
  fileFilter,
  limits,
});