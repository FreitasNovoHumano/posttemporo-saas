/**
 * =====================================================
 * 🌐 API CLIENT (PRO - REFRESH TOKEN + HTTP-ONLY COOKIE)
 * =====================================================
 *
 * 🎯 RESPONSABILIDADES:
 * - Gerenciar access token em memória
 * - Fazer refresh automático (com controle de concorrência)
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
 * 🔄 Controle de refresh (evita múltiplas chamadas simultâneas)
 */
let isRefreshing = false;
let refreshPromise = null;

/**
 * ⏱️ Timeout padrão (10s)
 */
const TIMEOUT = 10000;

/**
 * 🔹 Setter do token
 */
export function setAccessToken(token) {
  accessToken = token;
}

/**
 * 🔹 Helper de timeout
 */
function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT);

  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));
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
 * 🔄 REFRESH TOKEN (com lock)
 */
async function refreshToken() {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const res = await fetchWithTimeout(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
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
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * 🔥 FETCH PADRÃO COM RETRY
 */
export async function apiFetch(url, options = {}) {
  let res;

  try {
    res = await fetchWithTimeout(`${API_URL}${url}`, {
      ...options,
      headers: {
        ...getAuthHeaders(options.body instanceof FormData),
        ...(options.headers || {}),
      },
      credentials: "include",
    });
  } catch (error) {
    return {
      data: null,
      error: error.name === "AbortError"
        ? "TIMEOUT"
        : "NETWORK_ERROR",
    };
  }

  /**
   * 🔐 TOKEN EXPIRADO → TENTA REFRESH
   */
  if (res.status === 401 && !options._retry) {
    const refreshed = await refreshToken();

    if (!refreshed) {
      return { data: null, error: "UNAUTHORIZED" };
    }

    // 🔁 retry
    try {
      res = await fetchWithTimeout(`${API_URL}${url}`, {
  ...options,
  _retry: true,
        headers: {
          ...getAuthHeaders(options.body instanceof FormData),
          ...(options.headers || {}),
        },
        credentials: "include",
      });
    } catch (error) {
      return {
        data: null,
        error: "NETWORK_ERROR",
      };
    }
  }

  /**
   * ❌ ERRO HTTP
   */
  if (!res.ok) {
    let message = "Erro desconhecido";

    try {
      const json = await res.json();
      message = json.error || message;
    } catch {
      message = await res.text();
    }

    return {
      data: null,
      error: `HTTP_${res.status}: ${message}`,
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
  const res = await fetchWithTimeout(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) {
    return { data: null, error: "INVALID_CREDENTIALS" };
  }

  const data = await res.json();

  setAccessToken(data.accessToken);

  return { data, error: null };
}

// 🔹 Logout
export async function logoutUser() {
  await fetchWithTimeout(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  accessToken = null;
}

// 🔹 Usuário logado
export function getMe() {
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

/**
 * =====================================================
 * 🔄 SESSION RESTORE (F5 FIX)
 * =====================================================
 *
 * - Usa refresh token (cookie)
 * - Recupera access token automaticamente
 * - Pode ser chamado no AuthContext
 *
 * =====================================================
 */
export async function restoreSession() {
  const refreshed = await refreshToken();

  if (!refreshed) {
    return { data: null, error: "UNAUTHORIZED" };
  }

  return getMe();
}