"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Notifications from "@/components/notifications/Notifications";
import Timeline from "@/components/timeline/Timeline";

import PageTransition from "@/app/components/ui/PageTransition";
import Skeleton from "@/app/components/ui/Skeleton";

import useSocket from "@/hooks/useSocket";
import { useCompany } from "@/context/CompanyContext";

/**
 * =====================================================
 * 📊 DASHBOARD (REALTIME + UX PRO)
 * =====================================================
 */

export default function Dashboard() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  const { companyId } = useCompany();

  /**
   * 🔥 Carregar timeline
   */
  useEffect(() => {
    if (!companyId) return;

    async function fetchTimeline() {
      try {
        const res = await fetch("http://localhost:3001/api/timeline", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "x-company-id": companyId,
          },
        });

        const data = await res.json();
        setTimeline(data);
      } catch (error) {
        console.error("Erro ao carregar timeline:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTimeline();
  }, [companyId]);

  /**
   * 🔥 SOCKET TEMPO REAL
   */
  useSocket(companyId, (newItem) => {
    setTimeline((prev) => [newItem, ...prev]);

    /**
     * 🔔 Toast ao vivo
     */
    toast.success(
      `${newItem.user?.name} ${formatAction(newItem.action)}`
    );
  });

  /**
   * 🔥 Marcar como lido ao abrir
   */
  useEffect(() => {
    if (!companyId) return;

    fetch("http://localhost:3001/api/timeline/read", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "x-company-id": companyId,
      },
    }).catch(() => {});
  }, [companyId]);

  /**
   * 🔄 Loading UI
   */
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* 🔹 Header */}
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Acompanhe as atividades da sua equipe
          </p>
        </div>

        {/* 🔔 Notificações */}
        <Notifications />

        {/* 📊 Timeline */}
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Atividades recentes
          </h2>

          <Timeline items={timeline} />
        </div>
      </div>
    </PageTransition>
  );
}

/**
 * 🔹 Helper de texto
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