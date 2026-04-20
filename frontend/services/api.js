// 🔹 URL base da API
const API_URL = "http://localhost:3001";

/**
 * 🔐 ==========================
 * 🔐 TOKEN / AUTH HELPERS
 * 🔐 ==========================
 */

// 🔹 Recupera token salvo (safe para SSR)
function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

// 🔹 Monta headers com token (padronizado)
function getAuthHeaders() {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * 🔥 ==========================
 * 🔥 FETCH SEGURO (PADRÃO SÊNIOR)
 * 🔥 ==========================
 */

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);

    // 🔐 NÃO autenticado → não quebra app
    if (res.status === 401) {
      console.warn("🔐 Não autenticado:", url);

      // 🔥 opcional: limpa token inválido
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }

      return null;
    }

    // 🔴 outros erros HTTP
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    return await res.json();

  } catch (error) {
    console.error("❌ ERRO API:", url, error.message);

    // 🔥 evita crash do app
    return null;
  }
}

/**
 * 🔐 ==========================
 * 🔐 AUTH
 * 🔐 ==========================
 */

// 🔹 Buscar usuário logado
export async function getMe() {
  const token = getToken();

  // 🔥 NÃO chama API sem token
  if (!token) return null;

  return safeFetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });
}

// 🔹 Login
export async function loginUser(data) {
  return safeFetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * 📦 ==========================
 * 📦 POSTS
 * 📦 ==========================
 */

// 🔹 Criar post (FormData → sem Content-Type)
export async function createPost(data) {
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: data, // 🔥 FormData
  });

  return res.json();
}

// 🔹 Listar posts
export async function getPosts() {
  const token = getToken();

  if (!token) return [];

  return safeFetch(`${API_URL}/posts`, {
    headers: getAuthHeaders(),
  });
}

/**
 * 📊 ==========================
 * 📊 MÉTRICAS
 * 📊 ==========================
 */

export async function getMetrics() {
  const token = getToken();

  // 🔥 fallback inteligente
  if (!token) {
    return {
      total: 0,
      approved: 0,
      pending: 0,
      approvalRate: 0,
    };
  }

  return safeFetch(`${API_URL}/metrics`, {
    headers: getAuthHeaders(),
  });
}

/**
 * 🔥 ==========================
 * 🔥 APROVAÇÃO
 * 🔥 ==========================
 */

// 🔹 Aprovar post
export async function approvePost(id) {
  return safeFetch(`${API_URL}/posts/${id}/approve`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
}

// 🔹 Rejeitar post
export async function rejectPost(id, comment) {
  return safeFetch(`${API_URL}/posts/${id}/reject`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ comment }),
  });
}