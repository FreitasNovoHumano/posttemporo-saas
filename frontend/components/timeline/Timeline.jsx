"use client";

export default function Timeline({ items }) {
  if (!items?.length) {
    return (
      <div className="p-4 text-gray-500">
        Nenhuma atividade ainda.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="p-4 border rounded-lg shadow-sm bg-white"
        >
          <div className="text-sm">
            <strong>{item.user?.name || "Usuário"}</strong>{" "}
            → {formatAction(item.action)}
          </div>

          {item.post && (
            <div className="text-xs text-gray-500">
              Post: {item.post.title}
            </div>
          )}

          <div className="text-xs text-gray-400 mt-1">
            {new Date(item.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 🔹 Traduz ações (UX melhor)
 */
function formatAction(action) {
  const map = {
    CREATE_POST: "criou um post",
    UPDATE_POST: "atualizou um post",
    DELETE_POST: "deletou um post",
    APPROVE_POST: "aprovou um post",
    REJECT_POST: "rejeitou um post",
    SCHEDULE_POST: "agendou um post",
  };

  return map[action] || action;
}