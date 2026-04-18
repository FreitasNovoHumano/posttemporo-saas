"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// 🔐 Hook para proteger páginas
export function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ❌ Se não tiver token → manda pro login
    if (!token) {
      router.push("/login");
    }

  }, [router]);
}