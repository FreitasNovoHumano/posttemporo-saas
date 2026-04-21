"use client";

/**
 * =====================================================
 * 📊 DASHBOARD PRINCIPAL (PRO)
 * =====================================================
 * Responsável por:
 * - Buscar métricas do backend
 * - Exibir cards modernos
 * - Exibir gráficos (status + histórico)
 *
 * 🔐 Protegido via JWT
 * =====================================================
 */

import { useEffect, useState } from "react";
import StatsCards from "@/components/dashboard/StatsCards";
import PostChart from "@/components/dashboard/PostChart";
import StatsSkeleton from "@/components/dashboard/StatsSkeleton";

/**
 * 🔹 Tipagem alinhada com backend atualizado
 */
interface DashboardData {
  posts: number;
  scheduled: number;
  approved: number;
  pending: number;
  history?: {
    date: string;
    total: number;
  }[];
}

/**
 * 🔹 URL da API
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  /**
   * 📦 Estados
   */
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 🔄 Buscar métricas do backend
   */
  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/dashboard/metrics`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Erro ao buscar métricas");
        }

        const json = await res.json();

        /**
         * 📌 Esperado:
         * { data: { posts, scheduled, approved, pending, history } }
         */
        setData(json.data);

      } catch (err: any) {
        console.error("❌ Erro ao carregar dashboard:", err);
        setError(err.message || "Erro inesperado");
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  /**
   * ⏳ LOADING (Skeleton UX)
   */
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <StatsSkeleton />

        {/* Skeleton do gráfico */}
        <div className="h-[300px] bg-gray-200 animate-pulse rounded-xl"></div>
      </div>
    );
  }

  /**
   * ❌ ERROR
   */
  if (error) {
    return (
      <div className="p-6 text-red-500">
        <p>Erro: {error}</p>
      </div>
    );
  }

  /**
   * ⚠️ FAILSAFE
   */
  if (!data) {
    return (
      <div className="p-6">
        <p>Sem dados disponíveis</p>
      </div>
    );
  }

  /**
   * 🎯 RENDER PRINCIPAL
   */
  return (
    <div className="p-6 space-y-6">
      {/* ========================================
          📌 HEADER
          ======================================== */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">
          Visão geral do sistema de posts
        </p>
      </div>

      {/* ========================================
          📊 CARDS DE MÉTRICAS
          ======================================== */}
      <StatsCards metrics={data} />

      {/* ========================================
          📈 GRÁFICOS
          ======================================== */}
      <PostChart metrics={data} />
    </div>
  );
}