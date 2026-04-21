"use client";

/**
 * =====================================================
 * 📊 DASHBOARD PRINCIPAL
 * =====================================================
 * Responsável por:
 * - Buscar métricas do backend
 * - Exibir cards de resumo
 * - Exibir gráfico de posts
 *
 * 🔐 Protegido via JWT
 * =====================================================
 */

import { useEffect, useState } from "react";
import StatsCards from "@/components/dashboard/StatsCards";
import PostChart from "@/components/dashboard/PostChart";

/**
 * 🔹 Tipagem alinhada com backend
 */
interface DashboardData {
  posts: number;
  scheduled: number;
  published: number;
}

/**
 * 🔹 URL da API (env)
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

        /**
         * 🔒 Validação da resposta HTTP
         */
        if (!res.ok) {
          throw new Error("Erro ao buscar métricas");
        }

        const json = await res.json();

        /**
         * 📌 Backend padrão:
         * { data: { posts, scheduled, published } }
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
   * ⏳ LOADING STATE
   */
  if (loading) {
    return (
      <div className="p-6">
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  /**
   * ❌ ERROR STATE
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
          📈 GRÁFICO
          ======================================== */}
      <PostChart metrics={data} />
    </div>
  );
}