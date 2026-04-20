"use client";

/**
 * 📊 Dashboard Principal
 * -----------------------------------
 * - Exibe métricas gerais
 * - Exibe gráfico de posts
 */

import { useEffect, useState } from "react";
import StatsCards from "../components/dashboard/StatsCards";
import PostsChart from "../components/dashboard/PostsChart";

  export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao painel.</p>
    </div>
  );
}

  /**
   * 🔄 Busca métricas do backend
   */
  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch("http://localhost:3001/dashboard/metrics");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Erro ao carregar métricas:", error);
      }
    }

    fetchMetrics();
  }, []);

  /**
   * ⏳ Loading simples
   */
  if (!data) {
    return <p>Carregando dashboard...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* 🔹 Cards */}
      <StatsCards data={data} />

      {/* 🔹 Gráfico */}
      <PostsChart data={data.postsPerDay} />
    </div>
  );