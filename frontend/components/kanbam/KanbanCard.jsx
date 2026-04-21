"use client";

/**
 * =====================================================
 * 🎨 KANBAN CARD (PRO - ESTILO TRELLO)
 * =====================================================
 * Responsável por:
 * - Exibir dados do post
 * - Mostrar preview de imagem
 * - Exibir status visual (badge)
 * - Aplicar animação suave (Framer Motion)
 * - Permitir clique (modal)
 *
 * Props:
 * - post: objeto do post
 * - onClick: função ao clicar no card
 * =====================================================
 */

import { motion } from "framer-motion";

/**
 * 🎨 Cores por status
 */
const STATUS_STYLES = {
  DRAFT: "bg-gray-200 text-gray-700",
  SCHEDULED: "bg-yellow-200 text-yellow-800",
  PUBLISHED: "bg-green-200 text-green-800",
  REJECTED: "bg-red-200 text-red-700",
};

export default function KanbanCard({ post, onClick }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="
        bg-white rounded-xl shadow
        hover:shadow-lg transition-all duration-200
        cursor-pointer overflow-hidden
      "
      onClick={() => onClick?.(post)}
    >
      {/* ================================
          🖼️ IMAGEM (PREVIEW)
         ================================ */}
      {post.image && (
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${post.image}`}
          className="w-full h-32 object-cover"
        />
      )}

      {/* ================================
          📄 CONTEÚDO
         ================================ */}
      <div className="p-3">
        {/* 🔖 STATUS */}
        <span
          className={`
            inline-block text-[10px] px-2 py-1 rounded-full font-semibold mb-2
            ${STATUS_STYLES[post.status] || "bg-gray-100"}
          `}
        >
          {post.status}
        </span>

        {/* 🧾 TÍTULO */}
        <h4 className="font-semibold text-sm line-clamp-2">
          {post.title}
        </h4>

        {/* 📝 DESCRIÇÃO */}
        {post.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {post.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}