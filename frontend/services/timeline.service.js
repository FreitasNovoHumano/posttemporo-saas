/**
 * =====================================================
 * 📊 TIMELINE SERVICE
 * =====================================================
 * Centraliza chamadas da timeline
 */

import { safeFetch } from "@/services/api";

export async function getTimeline(companyId) {
  return safeFetch(`/api/timeline`, {
    headers: {
      "x-company-id": companyId,
    },
  });
}

export async function markTimelineAsRead(companyId) {
  return safeFetch(`/api/timeline/read`, {
    method: "POST",
    headers: {
      "x-company-id": companyId,
    },
  });
}