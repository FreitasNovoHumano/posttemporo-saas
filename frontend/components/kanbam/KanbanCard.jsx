"use client";

/**
 * =====================================================
 * 🧾 KANBAN CARD
 * =====================================================
 * Responsável por:
 * - Exibir dados do post
 * =====================================================
 */

export default function KanbanCard({ post }) {
  return (
    <div className="bg-white p-3 mb-3 rounded-lg shadow hover:shadow-md transition">
      <h4 className="font-semibold text-sm">{post.title}</h4>

      {post.description && (
        <p className="text-xs text-gray-500 mt-1">
          {post.description}
        </p>
      )}
    </div>
  );
}