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
function fileFilter(req, file, cb) {const multer = require("multer");

/**
 * =====================================================
 * 📦 UPLOAD CONFIG (MEMORY STORAGE - READY FOR SCALE)
 * =====================================================
 *
 * ✔ Não salva em disco (usa buffer em memória)
 * ✔ Ideal para processamento com Sharp ou envio para S3
 * ✔ Controle de tipo de arquivo (segurança)
 * ✔ Limite de tamanho configurado
 *
 * =====================================================
 */

/**
 * 🧠 Storage em memória
 * -----------------------------------------------------
 * - Arquivo fica disponível em req.file.buffer
 * - Não cria arquivos na pasta /uploads
 */
const storage = multer.memoryStorage();

/**
 * 🛡️ Filtro de arquivos permitidos
 * -----------------------------------------------------
 * Segurança contra uploads inválidos
 */
function fileFilter(req, file, cb) {
  const allowedTypes = [
    // Imagens
    "image/jpeg",
    "image/png",
    "image/webp",

    // Vídeos (novo - biblioteca de conteúdo)
    "video/mp4",
    "video/quicktime", // .mov
    "video/x-msvideo", // .avi
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Formato inválido (${file.mimetype}). Use JPG, PNG, WEBP ou vídeos (MP4, MOV, AVI).`
      )
    );
  }
}

/**
 * 📏 Limite de tamanho
 * -----------------------------------------------------
 * - 5MB para imagens
 * - 50MB total (considerando vídeos)
 *
 * OBS: multer aplica limite único por arquivo,
 * então usamos um valor mais alto para suportar vídeos.
 */
const limits = {
  fileSize: 50 * 1024 * 1024, // 50MB
};

/**
 * 🚀 Middleware de upload
 * -----------------------------------------------------
 * Uso:
 * upload.single("file")
 */
const upload = multer({
  storage,
  fileFilter,
  limits,
});

/**
 * 📤 Exportação
 */
module.exports = upload;
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