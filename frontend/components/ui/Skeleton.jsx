"use client";

/**
 * =====================================================
 * 💀 SKELETON LOADING (UI PROFISSIONAL)
 * =====================================================
 * Responsável por:
 * - Exibir placeholders durante carregamento
 * - Melhorar UX (evitar tela "vazia")
 *
 * Props:
 * - className → define tamanho/estilo
 * =====================================================
 */

export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`
        animate-pulse
        bg-gray-200
        rounded-md
        ${className}
      `}
    />
  );
}