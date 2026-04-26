"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  logoutUser,
  getMe,
  restoreSession,
} from "@/services/api";

const AuthContext = createContext(null);

/**
 * =====================================================
 * 🔐 AUTH CONTEXT (PRO - AUTO RESTORE + CLEAN ARCH)
 * =====================================================
 */

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * 🔄 RESTORE SESSION (F5 FIX REAL)
   */
  useEffect(() => {
    async function init() {
      const { data, error } = await restoreSession(); // 🔥 CORRETO

      if (!error && data) {
        setUser(data);
      }

      setLoading(false);
    }

    init();
  }, []);

  /**
   * 🔐 LOGIN
   */
  async function login(credentials) {
    const { data, error } = await loginUser(credentials);

    if (error) {
      throw new Error(error);
    }

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
        loading,
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