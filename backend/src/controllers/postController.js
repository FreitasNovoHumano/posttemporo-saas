/**
 * 📦 CONTROLLER — POSTS
 * ----------------------------------------
 * Responsável por:
 * ✔ Criar post
 * ✔ Listar posts do usuário
 * ✔ Atualizar post
 * ✔ Deletar post
 * ✔ Agendar post
 * ✔ Aprovar / Rejeitar
 * ✔ Métricas
 */

const postService = require("../services/postService");

/**
 * 🔹 Criar post (com upload de imagem)
 */
async function createPost(req, res) {
  try {
    const data = {
      title: req.body.title,
      description: req.body.description,
      image: req.file ? req.file.filename : null,
    };

    const post = await postService.createPost(data, req.userId);

    res.status(201).json(post);
  } catch (error) {
    console.error("❌ Erro ao criar post:", error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * 🔹 Listar posts do usuário autenticado
 */
async function getPosts(req, res) {
  try {
    const posts = await postService.getPosts(req.userId);

    res.json(posts);
  } catch (error) {
    console.error("❌ Erro ao buscar posts:", error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * 🔹 Atualizar post (título/descrição)
 */
async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const post = await postService.updatePost(
      id,
      { title, description },
      req.userId
    );

    res.json(post);
  } catch (error) {
    console.error("❌ Erro ao atualizar post:", error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * 🔹 Deletar post
 */
async function deletePost(req, res) {
  try {
    const { id } = req.params;

    await postService.deletePost(id, req.userId);

    res.json({ message: "Post deletado com sucesso" });
  } catch (error) {
    console.error("❌ Erro ao deletar post:", error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * 🔹 Agendar post (calendário)
 */
async function schedulePost(req, res) {
  try {
    const { id } = req.params;
    const { date } = req.body;

    const post = await postService.schedulePost(
      id,
      date,
      req.userId
    );

    res.json(post);
  } catch (error) {
    console.error("❌ Erro ao agendar post:", error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * 🔹 Aprovar post
 */
async function approvePost(req, res) {
  try {
    const { id } = req.params;

    const post = await postService.approvePost(
      id,
      req.userId
    );

    res.json(post);
  } catch (error) {
    console.error("❌ Erro ao aprovar post:", error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * 🔹 Rejeitar post
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

    res.json(post);
  } catch (error) {
    console.error("❌ Erro ao rejeitar post:", error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * 🔹 Métricas do dashboard
 */
async function getMetrics(req, res) {
  try {
    const metrics = await postService.getMetrics(req.userId);

    res.json(metrics);
  } catch (error) {
    console.error("❌ Erro ao buscar métricas:", error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * 📦 EXPORTAÇÃO
 * ----------------------------------------
 * 🔥 ESSENCIAL: todas as funções precisam estar aqui
 * senão o Express quebra com:
 * "handler must be a function"
 */
module.exports = {
  createPost,
  getPosts,
  updatePost,      // 🔥 ESSENCIAL (era o seu erro)
  deletePost,
  schedulePost,
  approvePost,
  rejectPost,
  getMetrics,
};