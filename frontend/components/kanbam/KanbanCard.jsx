"use client";

/**
 * =====================================================
 * 🎨 KANBAN CARD (PRO + MENU DE AÇÕES)
 * =====================================================
 * Responsável por:
 * - Exibir dados do post
 * - Mostrar preview de imagem
 * - Exibir status visual
 * - Menu de ações (⋮)
 * - Permitir clique (modal)
 *
 * Props:
 * - post
 * - onClick(post)
 * - onDelete(id)
 * =====================================================
 */

import { motion } from "framer-motion";
import { useState } from "react";

/**
 * 🎨 Cores por status
 */
const STATUS_STYLES = {
  DRAFT: "bg-gray-200 text-gray-700",
  SCHEDULED: "bg-yellow-200 text-yellow-800",
  PUBLISHED: "bg-green-200 text-green-800",
  REJECTED: "bg-red-200 text-red-700",
};

export default function KanbanCard({ post, onClick, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

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
        cursor-pointer overflow-hidden relative
      "
      onClick={() => onClick?.(post)}
    >
      {/* ================================
          🖼️ IMAGEM
         ================================ */}
      {post.image && (
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${post.image}`}
          className="w-full h-32 object-cover"
        />
      )}

      <div className="p-3">
        {/* ================================
            HEADER (STATUS + MENU)
           ================================ */}
        <div className="flex justify-between items-start">
          <span
            className={`
              text-[10px] px-2 py-1 rounded-full font-semibold
              ${STATUS_STYLES[post.status] || "bg-gray-100"}
            `}
          >
            {post.status}
          </span>

          {/* ⋮ MENU */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation(); // 🔥 NÃO abrir modal
                setMenuOpen(!menuOpen);
              }}
              className="text-gray-400 hover:text-black text-lg leading-none"
            >
              ⋮
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 bg-white border rounded shadow z-20 w-32">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onClick?.(post); // editar
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                >
                  ✏️ Editar
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onDelete?.(post.id);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-100"
                >
                  🗑️ Deletar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================================
            🧾 TÍTULO
           ================================ */}
        <h4 className="font-semibold text-sm mt-2 line-clamp-2">
          {post.title}
        </h4>

        {/* ================================
            📝 DESCRIÇÃO
           ================================ */}
        {post.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {post.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}