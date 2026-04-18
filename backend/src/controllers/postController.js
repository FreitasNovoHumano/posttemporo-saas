const postService = require("../services/postService");

// 🔹 GET
async function getPosts(req, res) {
  try {
    const posts = await postService.getPosts();
    res.json(posts);
  } catch (error) {
    console.error("ERRO GET:", error);
    res.status(500).json({ error: "Erro ao buscar posts" });
  }
}

// 🔹 POST
async function createPost(req, res) {
  try {
    console.log("BODY RECEBIDO:", req.body);

    const post = await postService.createPost(req.body);

    res.json(post);
  } catch (error) {
    console.error("ERRO POST:", error);

    // 🔥 NÃO deixa o servidor morrer
    res.status(500).json({
      error: "Erro ao criar post",
      details: error.message,
    });
  }

  async function createPost(req, res) {
  const { title, description } = req.body;

  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const post = await postService.createPost(
    { title, description, image },
    req.userId
  );

  res.json(post);
}
}

module.exports = {
  getPosts,
  createPost,
};