"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

/**
 * 📊 Timeline Component (PRO + RBAC)
 * --------------------------------------------------
 * Exibe atividades recentes com controle de permissão
 */
export default function Timeline({ items = [] }) {
  const router = useRouter();
  const { user } = useAuth();

  if (!items.length) {
    return (
      <div className="p-4 text-gray-500">
        Nenhuma atividade ainda.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        /**
         * 🔐 Verifica permissão para acessar post
         */
        const canViewPost = hasPermission(user, "VIEW_POST");

        return (
          <div
            key={item.id}
            onClick={() =>
              canViewPost && handleClick(item, router)
            }
            className={`flex items-start gap-3 p-4 border rounded-lg
              ${
                item.isRead ? "bg-white" : "bg-blue-50"
              }
              ${
                canViewPost
                  ? "cursor-pointer hover:shadow-md"
                  : "cursor-not-allowed opacity-60"
              }
            `}
          >
            {/* 👤 Avatar */}
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
              {getInitials(item.user?.name)}
            </div>

            {/* 📄 Conteúdo */}
            <div className="flex-1">
              <div className="text-sm">
                <strong>
                  {item.user?.name || "Usuário"}
                </strong>{" "}
                → {formatAction(item.action)}
              </div>

              {item.post && (
                <div className="text-xs text-gray-500">
                  {item.post.title}
                </div>
              )}

              <div className="text-xs text-gray-400 mt-1">
                {formatDate(item.createdAt)}
              </div>
            </div>

            {/* 🏷️ Badge */}
            <div
              className={`text-xs px-2 py-1 rounded ${getBadge(
                item.action
              )}`}
            >
              {formatAction(item.action)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * =====================================================
 * 🧠 HELPERS
 * =====================================================
 */

function handleClick(item, router) {
  if (item.post?.id) {
    router.push(`/posts/${item.post.id}`);
  }
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(date) {
  return new Date(date).toLocaleString("pt-BR");
}

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

function getBadge(action) {
  const map = {
    CREATE_POST: "bg-green-100 text-green-700",
    UPDATE_POST: "bg-blue-100 text-blue-700",
    DELETE_POST: "bg-red-100 text-red-700",
    APPROVE_POST: "bg-green-100 text-green-700",
    REJECT_POST: "bg-yellow-100 text-yellow-700",
    SCHEDULE_POST: "bg-purple-100 text-purple-700",
  };

  return map[action] || "bg-gray-100 text-gray-700";
}