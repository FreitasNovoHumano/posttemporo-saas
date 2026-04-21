/**
 * =====================================================
 * 📦 CONTROLLER — POSTS (PRO)
 * =====================================================
 * - Upload S3 + compressão
 * - Multi-tenant
 * - Resposta padronizada
 * =====================================================
 */

const postService = require("../services/postService");
const uploadService = require("../services/uploadService");

/**
 * 🧱 Helper de erro padrão
 */
function handleError(res, error, message = "Erro interno") {
  console.error(`❌ ${message}:`, error);

  return res.status(500).json({
    success: false,
    message,
    error: error.message,
  });
}

/**
 * 🔹 Criar post (com upload S3)
 */
async function createPost(req, res) {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Título é obrigatório",
      });
    }

    /**
     * ☁️ Upload imagem (S3 + compressão)
     */
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadService.uploadImage(req.file);
    }

    /**
     * 🔥 MULTI-TENANT CONTEXT
     */
    const post = await postService.createPost({
      title,
      content,
      imageUrl,
      authorId: req.user.id,
      companyId: req.companyId,
    });

    return res.status(201).json({
      success: true,
      message: "Post criado com sucesso",
      data: post,
    });

  } catch (error) {
    return handleError(res, error, "Erro ao criar post");
  }
}

/**
 * 🔹 Listar posts
 */
async function getPosts(req, res) {
  try {
    const { status, search } = req.query;

    const posts = await postService.getPosts({
      userId: req.user.id,
      companyId: req.companyId,
      role: req.role,
      status,
      search,
    });

    return res.json({
      success: true,
      data: posts,
    });

  } catch (error) {
    return handleError(res, error, "Erro ao buscar posts");
  }
}

/**
 * 🔹 Atualizar post
 */
async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    /**
     * 🔥 Atualiza imagem se vier nova
     */
    let imageUrl;

    if (req.file) {
      imageUrl = await uploadService.uploadImage(req.file);
    }

    const post = await postService.updatePost({
      id,
      data: {
        title,
        content,
        ...(imageUrl && { imageUrl }),
      },
      userId: req.user.id,
      role: req.role,
      companyId: req.companyId,
    });

    return res.json({
      success: true,
      message: "Post atualizado",
      data: post,
    });

  } catch (error) {
    return handleError(res, error, "Erro ao atualizar post");
  }
}

/**
 * 🔹 Deletar post
 */
async function deletePost(req, res) {
  try {
    const { id } = req.params;

    await postService.deletePost({
      id,
      userId: req.user.id,
      role: req.role,
      companyId: req.companyId,
    });

    return res.json({
      success: true,
      message: "Post deletado com sucesso",
    });

  } catch (error) {
    return handleError(res, error, "Erro ao deletar post");
  }
}

/**
 * 🔹 Agendar post
 */
async function schedulePost(req, res) {
  try {
    const { id } = req.params;
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Data é obrigatória",
      });
    }

    const post = await postService.schedulePost({
      id,
      date,
      userId: req.user.id,
      companyId: req.companyId,
    });

    return res.json({
      success: true,
      message: "Post agendado com sucesso",
      data: post,
    });

  } catch (error) {
    return handleError(res, error, "Erro ao agendar post");
  }
}

/**
 * 🔹 Aprovar post
 */
async function approvePost(req, res) {
  try {
    const { id } = req.params;

    const post = await postService.approvePost({
      id,
      userId: req.user.id,
      companyId: req.companyId,
    });

    return res.json({
      success: true,
      message: "Post aprovado",
      data: post,
    });

  } catch (error) {
    return handleError(res, error, "Erro ao aprovar post");
  }
}

/**
 * 🔹 Rejeitar post
 */
async function rejectPost(req, res) {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const post = await postService.rejectPost({
      id,
      comment,
      userId: req.user.id,
      companyId: req.companyId,
    });

    return res.json({
      success: true,
      message: "Post rejeitado",
      data: post,
    });

  } catch (error) {
    return handleError(res, error, "Erro ao rejeitar post");
  }
}

/**
 * 🔹 Métricas
 */
async function getMetrics(req, res) {
  try {
    const metrics = await postService.getMetrics({
      userId: req.user.id,
      companyId: req.companyId,
    });

    return res.json({
      success: true,
      data: metrics,
    });

  } catch (error) {
    return handleError(res, error, "Erro ao buscar métricas");
  }
}

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  schedulePost,
  approvePost,
  rejectPost,
  getMetrics,
};