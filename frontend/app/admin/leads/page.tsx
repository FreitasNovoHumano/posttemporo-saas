"use client";

/**
 * =====================================================
 * 📊 ADMIN - LEADS
 * =====================================================
 */

import { useEffect, useState } from "react";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/leads`
        );

        const data = await res.json();
        setLeads(data);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, []);

  if (loading) {
    return <p className="p-6">Carregando...</p>;
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Leads recebidos
      </h1>

      {leads.length === 0 && (
        <p>Nenhum lead ainda.</p>
      )}

      <div className="space-y-3">
        {leads.map((lead: any) => (
          <div
            key={lead.id}
            className="p-4 border rounded bg-white shadow"
          >
            <p><b>Nome:</b> {lead.name}</p>
            <p><b>Empresa:</b> {lead.company}</p>
            <p><b>WhatsApp:</b> {lead.whatsapp}</p>
            <p><b>Email:</b> {lead.email}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(lead.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}