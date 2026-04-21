"use client";

/**
 * =====================================================
 * 🧱 KANBAN BOARD
 * =====================================================
 * Responsável por:
 * - Gerenciar drag & drop
 * - Distribuir posts por status
 * - Disparar atualização otimista
 *
 * Props:
 * - posts: lista de posts
 * - onMove: função que atualiza status no backend
 * =====================================================
 */

import {
  DragDropContext,
  Droppable,
} from "@hello-pangea/dnd";

import KanbanColumn from "./KanbanColumn";

/**
 * 🔹 Colunas do sistema
 */
const COLUMNS = [
  "DRAFT",
  "SCHEDULED",
  "PUBLISHED",
];

export default function KanbanBoard({ posts, onMove }) {
  /**
   * 🔄 Quando solta o card
   */
  function handleDragEnd(result) {
    if (!result.destination) return;

    const postId = result.draggableId;
    const newStatus = result.destination.droppableId;
    const oldStatus = result.source.droppableId;

    /**
     * ⚠️ Evita re-render desnecessário
     */
    if (newStatus === oldStatus) return;

    /**
     * 🔥 ENVIA OBJETO (PADRÃO CORRETO)
     */
    onMove({
      postId,
      newStatus,
      oldStatus,
    });
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4">
        {COLUMNS.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex-1"
              >
                <KanbanColumn
                  status={status}
                  posts={posts.filter(p => p.status === status)}
                />

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}