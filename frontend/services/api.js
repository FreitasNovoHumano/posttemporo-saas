/**
 * =====================================================
 * 🌐 API CLIENT (PRO - REFRESH TOKEN + HTTP-ONLY COOKIE)
 * =====================================================
 *
 * 🎯 RESPONSABILIDADES:
 * - Gerenciar access token em memória
 * - Fazer refresh automático
 * - Padronizar respostas
 * - Evitar uso de localStorage
 *
 * 🔐 SEGURANÇA:
 * - Refresh token em cookie HTTP-only
 * - Access token em memória (não persistente)
 *
 * =====================================================
 */

const API_URL = "http://localhost:3001";

/**
 * 🔐 Access Token (memória)
 */
let accessToken = null;

/**
 * 🔹 Setter do token (usado no login)
 */
export function setAccessToken(token) {
  accessToken = token;
}

/**
 * 🔹 Headers com auth
 */
function getAuthHeaders(isFormData = false) {
  const headers = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return headers;
}

/**
 * 🔄 REFRESH TOKEN
 */
async function refreshToken() {
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include", // 🔥 envia cookie
    });

    if (!res.ok) {
      accessToken = null;
      return false;
    }

    const data = await res.json();

    accessToken = data.accessToken;
    return true;
  } catch {
    accessToken = null;
    return false;
  }
}

/**
 * 🔥 FETCH PADRÃO COM RETRY
 */
export async function apiFetch(url, options = {}) {
  let res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...getAuthHeaders(options.body instanceof FormData),
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  /**
   * 🔐 TOKEN EXPIRADO → TENTA REFRESH
   */
  if (res.status === 401) {
    const refreshed = await refreshToken();

    if (!refreshed) {
      return { data: null, error: "UNAUTHORIZED" };
    }

    // 🔁 retry da request original
    res = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        ...getAuthHeaders(options.body instanceof FormData),
        ...(options.headers || {}),
      },
      credentials: "include",
    });
  }

  /**
   * ❌ ERRO HTTP
   */
  if (!res.ok) {
    const text = await res.text();

    return {
      data: null,
      error: `HTTP_${res.status}: ${text}`,
    };
  }

  /**
   * ✅ SUCESSO
   */
  const data = await res.json();

  return { data, error: null };
}

/**
 * =====================================================
 * 🔐 AUTH
 * =====================================================
 */

// 🔹 Login
export async function loginUser(payload) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include", // 🔥 importante
  });

  if (!res.ok) {
    return { data: null, error: "INVALID_CREDENTIALS" };
  }

  const data = await res.json();

  // 🔥 salva access token em memória
  setAccessToken(data.accessToken);

  return { data, error: null };
}

// 🔹 Logout
export async function logoutUser() {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  accessToken = null;
}

// 🔹 Usuário logado
export async function getMe() {
  return apiFetch("/api/auth/me");
}

/**
 * =====================================================
 * 📦 POSTS
 * =====================================================
 */

export function getPosts() {
  return apiFetch("/api/posts");
}

export function createPost(formData) {
  return apiFetch("/api/posts", {
    method: "POST",
    body: formData,
  });
}

/**
 * =====================================================
 * 📊 MÉTRICAS
 * =====================================================
 */

export function getMetrics() {
  return apiFetch("/api/metrics");
}

/**
 * =====================================================
 * 🔥 APROVAÇÃO
 * =====================================================
 */

export function approvePost(id) {
  return apiFetch(`/api/posts/${id}/approve`, {
    method: "PUT",
  });
}

export function rejectPost(id, comment) {
  return apiFetch(`/api/posts/${id}/reject`, {
    method: "PUT",
    body: JSON.stringify({ comment }),
  });
}