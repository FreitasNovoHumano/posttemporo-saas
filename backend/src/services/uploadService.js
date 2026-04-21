const sharp = require("sharp");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");
const { v4: uuid } = require("uuid");

/**
 * =====================================================
 * ☁️ UPLOAD SERVICE (S3 + COMPRESSÃO)
 * =====================================================
 */

async function uploadImage(file) {
  /**
   * 🔥 Compressão automática
   */
  const buffer = await sharp(file.buffer)
    .resize({ width: 1200 }) // limite largura
    .jpeg({ quality: 70 })   // compressão
    .toBuffer();

  const fileName = `posts/${uuid()}.jpg`;

  /**
   * ☁️ Upload para S3
   */
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: "image/jpeg",
    })
  );

  /**
   * 🔗 URL pública
   */
  return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
}

module.exports = {
  uploadImage,
};