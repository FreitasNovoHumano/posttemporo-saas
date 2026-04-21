"use client";

/**
 * =====================================================
 * 💎 COMPONENT — STATS CARDS (PREMIUM UI)
 * =====================================================
 * Responsável por:
 * - Exibir métricas do dashboard
 * - Mostrar resumo visual com design moderno
 *
 * Props:
 * - metrics:
 *   {
 *     posts: number;
 *     scheduled: number;
 *     approved: number;
 *     pending: number;
 *   }
 *
 * =====================================================
 */

/**
 * 🔹 Tipagem atualizada (alinhada com backend novo)
 */
interface StatsCardsProps {
  metrics: {
    posts: number;
    scheduled: number;
    approved: number;
    pending: number;
  };
}

export default function StatsCards({ metrics }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {/* ================================
          📄 TOTAL DE POSTS
         ================================ */}
      <Card
        title="Total de Posts"
        value={metrics.posts}
        icon="📄"
        bg="bg-blue-50"
      />

      {/* ================================
          📅 AGENDADOS
         ================================ */}
      <Card
        title="Agendados"
        value={metrics.scheduled}
        icon="📅"
        bg="bg-yellow-50"
      />

      {/* ================================
          ✅ APROVADOS
         ================================ */}
      <Card
        title="Aprovados"
        value={metrics.approved}
        icon="✅"
        bg="bg-green-50"
      />

      {/* ================================
          ⏳ PENDENTES
         ================================ */}
      <Card
        title="Pendentes"
        value={metrics.pending}
        icon="⏳"
        bg="bg-gray-100"
      />
    </div>
  );
}

/**
 * 🧱 CARD REUTILIZÁVEL
 * -----------------------------------------------------
 * - Evita repetição de código
 * - Facilita expansão futura
 */
interface CardProps {
  title: string;
  value: number;
  icon: string;
  bg: string;
}

function Card({ title, value, icon, bg }: CardProps) {
  return (
    <div
      className={`${bg} p-5 rounded-xl shadow-sm hover:shadow-md transition duration-200`}
    >
      {/* 🔹 Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{title}</span>
        <span className="text-xl">{icon}</span>
      </div>

      {/* 🔹 Valor */}
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}