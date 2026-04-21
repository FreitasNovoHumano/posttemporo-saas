"use client";

/**
 * =====================================================
 * 📈 COMPONENT — POST CHART (PRO)
 * =====================================================
 * Responsável por:
 * - Exibir métricas atuais (barras)
 * - Exibir evolução histórica (linha)
 *
 * Props:
 * - metrics:
 *   {
 *     posts: number,
 *     scheduled: number,
 *     approved: number,
 *     pending: number,
 *     history: [{ date, total }]
 *   }
 *
 * =====================================================
 */

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * 🔹 Tipagem completa (alinhada com backend novo)
 */
interface PostChartProps {
  metrics: {
    posts: number;
    scheduled: number;
    approved: number;
    pending: number;
    history?: {
      date: string;
      total: number;
    }[];
  };
}

export default function PostChart({ metrics }: PostChartProps) {
  /**
   * 📊 Dados para gráfico de barras (status atual)
   */
  const barData = [
    { name: "Posts", value: metrics.posts },
    { name: "Agendados", value: metrics.scheduled },
    { name: "Aprovados", value: metrics.approved },
    { name: "Pendentes", value: metrics.pending },
  ];

  /**
   * 📈 Dados para gráfico de linha (histórico)
   */
  const lineData =
    metrics.history?.map((item) => ({
      name: item.date,
      value: Number(item.total),
    })) || [];

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "10px",
        background: "#ffffff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      {/* ========================================
          📌 TÍTULO
         ======================================== */}
      <h3 style={{ marginBottom: "16px" }}>
        📊 Performance dos Posts
      </h3>

      {/* ========================================
          📊 GRÁFICO DE BARRAS (STATUS)
         ======================================== */}
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ========================================
          📈 GRÁFICO DE LINHA (HISTÓRICO)
         ======================================== */}
      {lineData.length > 0 && (
        <div style={{ width: "100%", height: 250, marginTop: "30px" }}>
          <h4 style={{ marginBottom: "10px" }}>
            📈 Evolução ao longo do tempo
          </h4>

          <ResponsiveContainer>
            <LineChart data={lineData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}