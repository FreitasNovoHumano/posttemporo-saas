"use client";

/**
 * 🎨 STATUS BADGE (PRO)
 */
export default function StatusBadge({ status }) {
  const styles = {
    DRAFT: "bg-gray-200 text-gray-700",
    SCHEDULED: "bg-yellow-200 text-yellow-800",
    PUBLISHED: "bg-green-200 text-green-800",
    REJECTED: "bg-red-200 text-red-700",
  };

  return (
    <span
      className={`
        px-2 py-1 text-xs rounded-full font-semibold
        ${styles[status] || "bg-gray-100"}
      `}
    >
      {status}
    </span>
  );
}