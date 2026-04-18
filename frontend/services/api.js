// 🔹 URL base da API
const API_URL = "http://127.0.0.1:3001";

/**
 * 🔐 ==========================
 * 🔐 TOKEN / AUTH HELPERS
 * 🔐 ==========================
 */

// 🔹 Recupera token salvo
function getToken() {
  return localStorage.getItem("token");
}

// 🔹 Monta headers com token
function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
  };
}


/**
 * 🔐 ==========================
 * 🔐 AUTH
 * 🔐 ==========================
 */

// 🔹 Buscar usuário logado
export async function getMe() {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar usuário");
  }

  return res.json();
}

// 🔹 Login
export async function loginUser(data) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erro no login");
  }

  return res.json();
}


/**
 * 📦 ==========================
 * 📦 POSTS (PROTEGIDOS)
 * 📦 ==========================
 */

// 🔹 Criar post
export async function createPost(data) {
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      // ❌ NÃO colocar Content-Type aqui
    },
    body: data, // FormData
  });

  return res.json();
}
// 🔹 Listar posts
export async function getPosts() {
  const res = await fetch(`${API_URL}/posts`, {
    headers: getAuthHeaders(), // 🔥 ESSENCIAL
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar posts");
  }

  return res.json();
}