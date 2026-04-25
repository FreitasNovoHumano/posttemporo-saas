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

  async function fetchCompanies(token) {
  try {
    const res = await fetch("http://localhost:3001/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 🔥 CASO NÃO AUTORIZADO → NÃO QUEBRA
    if (res.status === 401) {
      console.warn("Usuário não autenticado");
      return;
    }

    if (!res.ok) {
      console.warn("Erro inesperado na API");
      return;
    }

    const user = await res.json();

    setCompanies(user.memberships || []);
  } catch (error) {
    console.error("Erro ao buscar empresas:", error);
  }
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