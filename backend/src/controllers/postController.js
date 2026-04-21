/**
 * 📦 CONTROLLER — POSTS
 * ----------------------------------------
 * Responsável por:
 * ✔ Criar post
 * ✔ Listar posts (com filtro)
 * ✔ Atualizar post
 * ✔ Deletar post
 * ✔ Agendar post
 * ✔ Aprovar / Rejeitar
 * ✔ Métricas
 */

const postService = require("../services/postService");

/**
 * 🧱 Helper de erro padrão
 */
function handleError(res, error, message = "Erro interno") {
  console.error(`❌ ${message}:`, error);
  return res.status(500).json({
    error: error.message || message,
  });
}

/**
 * 🔹 Criar post (com upload de imagem)
 */
async function createPost(req, res) {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        error: "Título é obrigatório",
      });
    }

    const data = {
      title,
      description,
      image: req.file ? req.file.filename : null,
    };

    const post = await postService.createPost(data, req.userId);

    return res.status(201).json({
      message: "Post criado com sucesso",
      data: post,
    });

  } catch (error) {
    return handleError(res, error, "Erro ao criar post");
  }
}

/**
 * 🔹 Listar posts (com filtro e busca)
 * -----------------------------------------------------
 * Query params:
 * ?status=APPROVED
 * ?search=marketing
 */
async function getPosts(req, res) {
  try {
    const { status, search } = req.query;

    /**
     * 🔥 Toda lógica fica no service (padrão profissional)
     */
    const posts = await postService.getPosts({
      userId: req.userId,
      role: req.user?.role,
      status,
      search,
    });

    return res.json({
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
    const { title, description } = req.body;

    const post = await postService.updatePost(
      id,
      { title, description },
      req.userId,
      req.user?.role
    );

    return res.json({
      message: "Post atualizado",
      data: post,
    });

  } catch (error) {
    return handleError(res, error, "Erro ao atualizar post");
  }
}

/**
 * 🔹 Deletar post
 * ❗ ADMIN pode deletar qualquer post
 */
async function deletePost(req, res) {
  try {
    const { id } = req.params;

    await postService.deletePost(
      id,
      req.userId,
      req.user?.role
    );

    return res.json({
      message: "Post deletado com sucesso",
    });

  } catch (error) {
    return handleError(res, error, "Erro ao deletar post");
  }
}

/**
 * 🔹 Agendar post (usado no calendário)
 */
async function schedulePost(req, res) {
  try {
    const { id } = req.params;
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({
        error: "Data é obrigatória",
      });
    }

    const post = await postService.schedulePost(
      id,
      date,
      req.userId
    );

    return res.json({
      message: "Post agendado com sucesso",
      data: post,
    });

  } catch (error) {
    return handleError(res, error, "Erro ao agendar post");
  }
}

/**
 * 🔹 Aprovar post (ADMIN)
 */
async function approvePost(req, res) {
  try {
    const { id } = req.params;

    const post = await postService.approvePost(
      id,
      req.userId
    );

    return res.json({
      message: "Post aprovado",
      data: post,
    });

  } catch (error) {
    return handleError(res, error, "Erro ao aprovar post");
  }
}

/**
 * 🔹 Rejeitar post (ADMIN)
 */
async function rejectPost(req, res) {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const post = await postService.rejectPost(
      id,
      comment,
      req.userId
    );

    return res.json({
      message: "Post rejeitado",
      data: post,
    });

  } catch (error) {
    return handleError(res, error, "Erro ao rejeitar post");
  }
}

/**
 * 🔹 Métricas do dashboard
 */
async function getMetrics(req, res) {
  try {
    const metrics = await postService.getMetrics(req.userId);

    return res.json({
      data: metrics,
    });

  } catch (error) {
    return handleError(res, error, "Erro ao buscar métricas");
  }
}

/**
 * 📦 EXPORTAÇÃO
 */
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