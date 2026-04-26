"use client";

import { createContext, useContext, useState } from "react";
import { apiFetch, setAccessToken } from "@/services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function login(credentials) {
    const res = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    if (!res.ok) throw new Error();

    const data = await res.json();

    // 🔥 salva access token em memória
    setAccessToken(data.accessToken);

    const me = await apiFetch("/api/auth/me");

    setUser(me.data);
  }

  async function logout() {
    await fetch("http://localhost:3001/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}