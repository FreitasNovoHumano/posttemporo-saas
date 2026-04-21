"use client";

/**
 * =====================================================
 * 💀 SKELETON — STATS CARDS
 * =====================================================
 * - Simula carregamento
 * - Melhora UX
 * =====================================================
 */

export default function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-5 rounded-xl bg-gray-200 animate-pulse"
        >
          <div className="h-4 w-20 bg-gray-300 rounded mb-3"></div>
          <div className="h-6 w-12 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  );
}