"use client";

/**
 * 🔐 ProtectedRoute
 * --------------------------------------------------
 * Bloqueia acesso se não estiver logado
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return <p>Carregando...</p>;

  return user ? children : null;
}