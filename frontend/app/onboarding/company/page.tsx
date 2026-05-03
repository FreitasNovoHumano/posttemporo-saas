"use client";

import { useState } from "react";

export default function CompanyForm() {
  const [form, setForm] = useState({
    name: "",
    document: "",
    ownerName: "",
    ownerDocument: "",
    address: "",
    number: "",
    cep: "",
    city: "",
    state: "",
    neighborhood: "",
    street: "",
    file: null as File | null
  });

  // 🔥 BUSCAR ENDEREÇO PELO CEP
  async function handleCep(e: any) {
    const cep = e.target.value;
    setForm({ ...form, cep });

    if (cep.length === 8) {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      setForm((prev) => ({
        ...prev,
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      }));
    }
  }

  function handleChange(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handleFile(e: any) {
    setForm({
      ...form,
      file: e.target.files[0]
    });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!form.file) {
      alert("Anexe um documento");
      return;
    }

    const formData = new FormData();

    formData.append('file', form.file); // 🔥 ESSENCIAL

    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value as any);
    });

    await fetch("http://localhost:3001/api/companies", {
      method: "POST",
      body: formData
    });

    alert("Empresa cadastrada com sucesso!");
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">

      <h1 className="text-xl font-bold mb-4">
        Cadastro da Empresa
      </h1>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          name="name"
          placeholder="Nome / Razão Social"
          onChange={handleChange}
          required
          className="w-full border p-2"
        />

        <input
          name="document"
          placeholder="CPF ou CNPJ"
          onChange={handleChange}
          required
          className="w-full border p-2"
        />

        <input
          name="ownerName"
          placeholder="Responsável (nome completo)"
          onChange={handleChange}
          required
          className="w-full border p-2"
        />

        <input
          name="ownerDocument"
          placeholder="CPF ou RG do responsável"
          onChange={handleChange}
          required
          className="w-full border p-2"
        />

        {/* 📎 Upload */}
        <input
          type="file"
          onChange={handleFile}
          required
          className="w-full"
        />

        {/* 📍 CEP */}
        <input
          name="cep"
          placeholder="CEP"
          onChange={handleCep}
          required
          className="w-full border p-2"
        />

        <input
          name="street"
          placeholder="Rua"
          value={form.street}
          readOnly
          className="w-full border p-2 bg-gray-100"
        />

        <input
          name="neighborhood"
          placeholder="Bairro"
          value={form.neighborhood}
          readOnly
          className="w-full border p-2 bg-gray-100"
        />

        <input
          name="city"
          placeholder="Cidade"
          value={form.city}
          readOnly
          className="w-full border p-2 bg-gray-100"
        />

        <input
          name="state"
          placeholder="Estado"
          value={form.state}
          readOnly
          className="w-full border p-2 bg-gray-100"
        />

        <input
          name="number"
          placeholder="Número"
          onChange={handleChange}
          required
          className="w-full border p-2"
        />

        <button className="w-full bg-green-600 text-white py-2 rounded">
          Finalizar cadastro
        </button>

      </form>
    </div>
  );
}