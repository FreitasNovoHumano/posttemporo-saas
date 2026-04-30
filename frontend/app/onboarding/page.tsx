"use client";

import { useState } from "react";

export default function Onboarding() {
  const [company, setCompany] = useState("");

  async function handleCreateCompany() {
    await fetch("http://localhost:3001/api/company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: company }),
    });

    window.location.href = "/dashboard";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">
        Cadastre sua empresa
      </h1>

      <input
        placeholder="Nome da empresa"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="border p-2 rounded"
      />

      <button
        onClick={handleCreateCompany}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Criar empresa
      </button>
    </div>
  );
}