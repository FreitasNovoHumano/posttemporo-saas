"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CompanyContext = createContext();

export function CompanyProvider({ children }) {
  const [companyId, setCompanyId] = useState(null);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("companyId");
    if (saved) setCompanyId(saved);

    fetchCompanies();
  }, []);

  async function fetchCompanies() {
    const res = await fetch("http://localhost:3001/api/v1/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const user = await res.json();

    setCompanies(user.memberships || []);
  }

  function switchCompany(id) {
    localStorage.setItem("companyId", id);
    setCompanyId(id);

    // 🔥 força reload (padrão SaaS)
    window.location.reload();
  }

  return (
    <CompanyContext.Provider
      value={{ companyId, companies, switchCompany }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export const useCompany = () => useContext(CompanyContext);