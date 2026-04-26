"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  logoutUser,
  getMe,
} from "@/services/api";

const AuthContext = createContext(null);

/**
 * =====================================================
 * 🔐 AUTH CONTEXT (PRO - AUTO RESTORE + CLEAN ARCH)
 * =====================================================
 *
 * 🎯 RESPONSABILIDADES:
 * - Login / Logout
 * - Manter usuário em memória
 * - Restaurar sessão após F5
 *
 * =====================================================
 */

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * 🔄 RESTORE SESSION (ao carregar app)
   */
  useEffect(() => {
    async function restoreSession() {
      const { data, error } = await getMe();

      if (!error && data) {
        setUser(data);
      }

      setLoading(false);
    }

    restoreSession();
  }, []);

  /**
   * 🔐 LOGIN
   */
  async function login(credentials) {
    const { data, error } = await loginUser(credentials);

    if (error) {
      throw new Error(error);
    }

    // 🔥 pega usuário após login
    const me = await getMe();

    if (me.data) {
      setUser(me.data);
    }
  }

  /**
   * 🔓 LOGOUT
   */
  async function logout() {
    await logoutUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading, // 🔥 importante pro UI
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 🔹 Hook
 */
export function useAuth() {
  return useContext(AuthContext);
}