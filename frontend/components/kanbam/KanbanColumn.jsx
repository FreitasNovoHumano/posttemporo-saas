"use client";

/**
 * =====================================================
 * 📦 KANBAN COLUMN
 * =====================================================
 * Responsável por:
 * - Renderizar coluna por status
 * - Exibir lista de posts
 * =====================================================
 */

import { Draggable } from "@hello-pangea/dnd";
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

export default function KanbanColumn({ status, posts }) {
  return (
    <div className="bg-gray-100 p-4 rounded-xl min-h-[400px]">
      <h3 className="font-bold mb-4">{getTitle(status)}</h3>

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
              <KanbanCard post={post} />
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
}