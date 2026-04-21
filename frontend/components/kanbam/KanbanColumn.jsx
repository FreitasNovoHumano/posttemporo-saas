"use client";

/**
 * =====================================================
 * 📦 KANBAN COLUMN (ANIMADO + INTERATIVO)
 * =====================================================
 * Responsável por:
 * - Renderizar coluna por status
 * - Exibir lista de posts
 * - Aplicar animação de layout (Framer Motion)
 * - Permitir clique nos cards
 *
 * Props:
 * - status: string
 * - posts: array
 * - onCardClick: function
 * =====================================================
 */

import { Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import KanbanCard from "./KanbanCard";

/**
 * 🔹 Nome amigável
 */
function getTitle(status) {
  const map = {
    DRAFT: "Rascunho",
    SCHEDULED: "Agendado",
    PUBLISHED: "Publicado",
  };

  return map[status] || status;
}

export default function KanbanColumn({ status, posts, onCardClick }) {
  return (
    <motion.div
      layout
      className="bg-gray-100 p-4 rounded-xl min-h-[400px] transition-all"
    >
      {/* ================================
          📌 TÍTULO DA COLUNA
         ================================ */}
      <h3 className="font-bold mb-4">
        {getTitle(status)}
      </h3>

      {/* ================================
          📄 LISTA DE POSTS
         ================================ */}
      {posts.map((post, index) => (
        <Draggable
          key={post.id}
          draggableId={String(post.id)}
          index={index}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <KanbanCard
                post={post}
                onClick={onCardClick}
              />
            </div>
          )}
        </Draggable>
      ))}
    </motion.div>
  );
}