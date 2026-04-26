"use client";

/**
 * =====================================================
 * 🏢 CompanyContext (PRO - SAAS READY)
 * =====================================================
 *
 * 🎯 RESPONSABILIDADES:
 * - Gerenciar empresa ativa
 * - Listar empresas do usuário
 * - Persistência (localStorage)
 * - Fornecer contexto global
 *
 * ⚙️ MELHORIAS:
 * - Token real (auth)
 * - Loading + Error states
 * - Sem reload desnecessário
 * - Código resiliente
 *
 * =====================================================
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const CompanyContext = createContext(null);

/**
 * 🧠 Provider
 */
export function CompanyProvider({ children }) {
  const [companyId, setCompanyId] = useState(null);
  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 🚀 INIT
   */
  useEffect(() => {
    const savedCompany = localStorage.getItem("companyId");
    const token = localStorage.getItem("token");

    if (savedCompany) setCompanyId(savedCompany);

    if (token) {
      fetchCompanies(token);
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * 📡 Buscar empresas do usuário
   */
  async function fetchCompanies(token) {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:3001/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        console.warn("Usuário não autenticado");
        setCompanies([]);
        return;
      }

      if (!res.ok) {
        throw new Error("Erro ao buscar empresas");
      }

      const user = await res.json();

      setCompanies(user.memberships || []);
    } catch (err) {
      console.error("Erro ao buscar empresas:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * 🔄 Trocar empresa ativa
   */
  function switchCompany(id) {
    localStorage.setItem("companyId", id);
    setCompanyId(id);

    // 👉 melhor que reload: deixa o React reagir
    // (se precisar, podemos disparar refetch em hooks)
  }

  /**
   * 📦 VALUE
   */
  const value = {
    companyId,
    companies,
    loading,
    error,
    switchCompany,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
}

/**
 * 🪝 Hook seguro
 */
export function useCompany() {
  const context = useContext(CompanyContext);

  if (!context) {
    throw new Error(
      "useCompany deve ser usado dentro de CompanyProvider"
    );
  }

  return context;
}