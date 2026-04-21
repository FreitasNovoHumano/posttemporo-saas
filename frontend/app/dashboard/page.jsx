"use client";

import { useEffect, useState } from "react";

import Notifications from "@/components/notifications/Notifications";
import Timeline from "@/components/timeline/Timeline";

import PageTransition from "@/app/components/ui/PageTransition";
import Skeleton from "@/app/components/ui/Skeleton";

/**
 * =====================================================
 * 📊 DASHBOARD (SaaS READY)
 * =====================================================
 * - Timeline de atividades
 * - Integração com multi-tenant
 * - Loading profissional
 * =====================================================
 */

export default function Dashboard() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * 🔥 Carregar timeline
   */
  useEffect(() => {
    async function fetchTimeline() {
      try {
        const res = await fetch("http://localhost:3001/api/timeline", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "x-company-id": localStorage.getItem("companyId"),
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
  }, []);

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