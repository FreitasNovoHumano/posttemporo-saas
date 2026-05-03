const service = require("../services/contentLibraryService");

/**
 * Criar conteúdo (imagem, vídeo ou texto)
 */
exports.create = async (req, res) => {
  try {
    const { title, caption, type } = req.body;

    const fileUrl = req.file ? req.file.location || req.file.path : null;

    const content = await service.createContent({
      title,
      caption,
      type,
      fileUrl,
      companyId: req.companyId
    });

    return res.json(content);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Listar conteúdos
 */
exports.list = async (req, res) => {
  try {
    const contents = await service.getContentsByCompany(req.companyId);
    return res.json(contents);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Deletar conteúdo
 */
exports.remove = async (req, res) => {
  try {
    await service.deleteContent(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};