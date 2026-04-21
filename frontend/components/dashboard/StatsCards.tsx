"use client";

/**
 * =====================================================
 * 📊 COMPONENT — STATS CARDS
 * =====================================================
 * Responsável por:
 * - Exibir métricas do dashboard
 * - Mostrar resumo visual dos posts
 *
 * Props:
 * - metrics: { posts, scheduled, published }
 * =====================================================
 */

/**
 * 🔹 Tipagem das métricas
 */
interface StatsCardsProps {
  metrics: {
    posts: number;
    scheduled: number;
    published: number;
  };
}

export default function StatsCards({ metrics }: StatsCardsProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      {/* ================================
          📄 TOTAL DE POSTS
         ================================ */}
      <div style={cardStyle}>
        <h4>📄 Total de Posts</h4>
        <p style={valueStyle}>{metrics.posts}</p>
      </div>

      {/* ================================
          📅 AGENDADOS
         ================================ */}
      <div style={cardStyle}>
        <h4>📅 Agendados</h4>
        <p style={valueStyle}>{metrics.scheduled}</p>
      </div>

      {/* ================================
          🚀 PUBLICADOS
         ================================ */}
      <div style={cardStyle}>
        <h4>🚀 Publicados</h4>
        <p style={valueStyle}>{metrics.published}</p>
      </div>
    </div>
  );
}

/**
 * 🎨 Estilo base dos cards
 */
const cardStyle: React.CSSProperties = {
  flex: "1",
  minWidth: "180px",
  padding: "16px",
  borderRadius: "10px",
  background: "#f5f5f5",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

/**
 * 🎯 Estilo do valor
 */
const valueStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
  marginTop: "8px",
};