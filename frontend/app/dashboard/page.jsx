"use client";

/**
 * =====================================================
 * 📊 DASHBOARD (PRO - SAAS READY + AUTH PROTECTION)
 * =====================================================
 *
 * 🎯 RESPONSABILIDADES:
 * - Proteger rota (somente usuário logado)
 * - Exibir timeline
 * - Integrar realtime (socket)
 * - Exibir notificações
 * - Gerenciar estados (loading / error / empty)
 *
 * 🔐 AUTH:
 * - Usa NextAuth (useSession)
 * - Redireciona se não autenticado
 *
 * =====================================================
 */

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import Notifications from "@/components/notifications/Notifications";
import Timeline from "@/components/timeline/Timeline";

import PageTransition from "@/components/ui/PageTransition";
import Skeleton from "@/components/ui/Skeleton";

import useSocket from "@/hooks/useSocket";
import { useCompany } from "@/context/CompanyContext";

import {
  getTimeline,
  markTimelineAsRead,
} from "@/services/timeline.service";

export default function Dashboard() {
  /**
   * 🔐 AUTH (NextAuth)
   */
  const { data: session, status } = useSession();
  const router = useRouter();

  /**
   * 🏢 Empresa ativa
   */
  const { companyId } = useCompany();

  /**
   * 📦 STATES
   */
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 🔐 PROTEÇÃO DE ROTA
   */
  useEffect(() => {
    // Aguarda sessão carregar
    if (status === "loading") return;

    // Se não estiver logado → volta pro login
    if (!session) {
      router.replace("/login");
    }
  }, [status, session, router]);

  /**
   * ⏳ Evita render enquanto valida sessão
   */
  if (status === "loading" || !session) {
    return (
      <p className="text-center mt-10">
        Carregando sessão...
      </p>
    );
  }

  /**
   * 📡 Buscar timeline
   */
  const fetchTimeline = useCallback(async () => {
    if (!companyId) return;

    setLoading(true);
    setError(null);

    const { data, error } = await getTimeline(companyId);

    if (error) {
      console.error("Erro timeline:", error);
      setError(error);
      toast.error("Erro ao carregar timeline");
    } else {
      setTimeline(data || []);
    }

    setLoading(false);
  }, [companyId]);

  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  /**
   * ⚡ SOCKET (tempo real)
   */
  useSocket(companyId, (newItem) => {
    setTimeline((prev) => {
      if (prev.some((item) => item.id === newItem.id)) {
        return prev;
      }
      return [newItem, ...prev];
    });

    toast.success(
      `${newItem.user?.name} ${formatAction(newItem.action)}`
    );
  });

  /**
   * 👁️ Marcar como lido
   */
  useEffect(() => {
    if (!companyId) return;
    markTimelineAsRead(companyId);
  }, [companyId]);

  /**
   * 🔄 LOADING (dados)
   */
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  /**
   * ❌ ERRO
   */
  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">
          Erro ao carregar dados.
        </p>

        <button
          onClick={fetchTimeline}
          className="mt-2 text-blue-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  /**
   * 📭 EMPTY STATE
   */
  if (!timeline.length) {
    return (
      <PageTransition>
        <div className="p-6 text-gray-500">
          Nenhuma atividade ainda.
        </div>
      </PageTransition>
    );
  }

  /**
   * ✅ UI
   */
  return (
    <PageTransition>
      <div className="space-y-6">

        {/* 🔹 Header */}
        <div>
          <h1 className="text-2xl font-bold">
            Dashboard
          </h1>

          <p className="text-sm text-gray-500">
            Bem-vindo, {session.user?.name}
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
 * 🧠 Helper
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