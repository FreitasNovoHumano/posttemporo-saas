"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import Notifications from "@/components/notifications/Notifications";
import { apiFetch } from "@/services/api";

/**
 * =====================================================
 * 🔝 HEADER (SaaS UI + Marketing Nav)
 * =====================================================
 * ✔ Busca com debounce
 * ✔ Integração correta com apiFetch
 * ✔ Dropdown estável
 * ✔ Busca só aparece após clique em "Já sou cadastrado"
 * =====================================================
 */

export default function Header() {
  // 🔎 Estado da busca
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🆕 Controle de exibição da busca
  const [showSearch, setShowSearch] = useState(false);

  /**
   * 🔥 Debounce (evita spam de requisição)
   */
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.length >= 2) {
        fetchCompanies(query);
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  /**
   * 🔍 Busca empresas no backend
   */
  const fetchCompanies = async (search) => {
    try {
      setLoading(true);

      const res = await apiFetch(`/companies/search?query=${search}`);

      setResults(res?.data || []);
    } catch (err) {
      console.error("Erro ao buscar empresas:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🏢 Seleciona empresa
   */
  const selectCompany = (company) => {
    localStorage.setItem("companyId", company.id);
    localStorage.setItem("companySlug", company.slug);

    window.location.href = `/login?company=${company.slug}`;
  };

  /**
   * 🆕 Clique em "Já sou cadastrado"
   */
  const handleShowSearch = () => {
    setShowSearch(true);

    setTimeout(() => {
      const input = document.querySelector(
        "input[placeholder='Buscar sua empresa...']"
      );
      input?.focus();
      input?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm sticky top-0 z-50">

      {/* 🔹 ESQUERDA */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Freitas Growth"
            className="h-10 object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600 font-medium">
          <Link href="/empresa" className="hover:text-black">
            Sobre Nós
          </Link>
        </nav>
      </div>

      {/* 🔘 BOTÃO LOGIN */}
      {!showSearch && (
        <button
          onClick={handleShowSearch}
          className="text-sm text-gray-700 hover:text-black"
        >
          Já sou cadastrado
        </button>
      )}

      {/* 🔍 BUSCA (AGORA CONDICIONAL) */}
      {showSearch && (
        <div className="relative w-80 hidden md:block">

          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
            <Search size={18} className="text-gray-500" />

            <input
              type="text"
              placeholder="Buscar sua empresa..."
              className="ml-2 w-full bg-transparent outline-none text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* 📋 RESULTADOS */}
          {results.length > 0 && (
            <ul className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-md z-50 max-h-60 overflow-y-auto">

              {results.map((company) => (
                <li key={company.id}>
                  <button
                    onClick={() => selectCompany(company)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    {company.profile?.image && (
                      <img
                        src={`http://localhost:3001/uploads/${company.profile.image}`}
                        alt={company.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    )}

                    <span>{company.name}</span>
                  </button>
                </li>
              ))}

            </ul>
          )}

          {/* ⏳ LOADING */}
          {loading && (
            <div className="absolute top-12 left-0 w-full bg-white border rounded-lg p-2 text-sm text-gray-500">
              Buscando...
            </div>
          )}
        </div>
      )}

      {/* 🔹 DIREITA */}
      <div className="flex items-center gap-4">
        <Notifications />
      </div>

    </header>
  );
}