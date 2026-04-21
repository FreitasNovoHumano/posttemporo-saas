"use client";

import { createContext, useContext, useState } from "react";

const CompanyContext = createContext();

export function CompanyProvider({ children }) {
  const [companyId, setCompanyId] = useState(
    localStorage.getItem("companyId")
  );

  function switchCompany(id) {
    localStorage.setItem("companyId", id);
    setCompanyId(id);
    window.location.reload();
  }

  return (
    <CompanyContext.Provider value={{ companyId, switchCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  return useContext(CompanyContext);
}