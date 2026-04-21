"use client";

import { useCompany } from "@/context/CompanyContext";

export default function CompanySwitcher() {
  const { companies, companyId, switchCompany } = useCompany();

  return (
    <div className="flex items-center gap-2">
      <select
        value={companyId || ""}
        onChange={(e) => switchCompany(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="">Selecione empresa</option>

        {companies.map((m) => (
          <option key={m.company.id} value={m.company.id}>
            {m.company.name}
          </option>
        ))}
      </select>
    </div>
  );
}