"use client";

/**
 * =====================================================
 * 🌐 LANDING PAGE (VENDA + DEMO + CAPTURA)
 * =====================================================
 *
 * 🎯 OBJETIVO:
 * - Converter visitantes
 * - Gerar leads qualificados
 * - Oferecer teste grátis
 * - Enviar leads para backend (Express + Prisma)
 *
 * =====================================================
 */

import { signIn } from "next-auth/react";
import { useState, ChangeEvent, FormEvent } from "react";

import { generateLocalPost } from "@/utils/copyGenerator";
import { segmentImages } from "@/utils/segmentImages";

/**
 * 🧠 TIPOS
 */
type Post = {
  image: string;
  title: string;
  content: string;
  cta: string;
};

type LeadForm = {
  empresa: string;
  documento: string;
  nome: string;
  email: string;
  whatsapp: string;
};

/**
 * 🧠 SEGMENTOS
 */
const postTemplates: Record<string, { title: string; cta: string }> = {
  hamburgueria: { title: "🍔 Hambúrguer artesanal", cta: "Peça agora!" },
  pizzaria: { title: "🍕 Pizza irresistível", cta: "Peça já!" },
  sushi: { title: "🍣 Sushi premium", cta: "Peça agora!" },
  churrasco: { title: "🔥 Churrasco na brasa", cta: "Reserve já!" },
  marmitex: { title: "🍱 Marmitex caseira", cta: "Peça agora!" },
};

/**
 * 🚀 COMPONENTE PRINCIPAL
 */
export default function HomePage() {
  /**
   * 📦 STATES (mantidos)
   */
  const [showTest, setShowTest] = useState(false);
  const [type, setType] = useState("");
  const [company, setCompany] = useState("");
  const [post, setPost] = useState<Post | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgIndex, setImgIndex] = useState(0);

  /**
   * 📦 FORM DE LEAD
   */
  const [lead, setLead] = useState<LeadForm>({
    empresa: "",
    documento: "",
    nome: "",
    email: "",
    whatsapp: "",
  });

  /**
   * ✏️ Atualiza formulário
   */
  function handleLeadChange(e: ChangeEvent<HTMLInputElement>) {
    setLead({
      ...lead,
      [e.target.name]: e.target.value,
    });
  }

  /**
   * 🚀 ENVIO PARA BACKEND (NOVO)
   */
  async function handleLeadSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:3001/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lead),
    });

    const data = await response.json(); // 🔥 IMPORTANTE

    if (!response.ok) {
      console.error("ERRO BACKEND:", data); // 👈 AQUI
      throw new Error(data.error || "Erro ao salvar lead");
    }

    alert("Cadastro enviado com sucesso!");

    setLead({
      empresa: "",
      documento: "",
      nome: "",
      email: "",
      whatsapp: "",
    });

  } catch (error) {
    console.error("Erro completo:", error);
    alert("Erro ao enviar dados");
  }
}

  /**
   * 🤖 SIMULADOR (mantido)
   */
  function generatePost() {
    if (!type) {
      setError("Escolha um tipo de negócio");
      return;
    }

    setLoading(true);
    setError(null);
    setImgIndex(0);

    const template = postTemplates[type];
    const images = segmentImages[type] || segmentImages.default;

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * images.length);

      setPost({
        image: images[randomIndex],
        title: template?.title || "Seu negócio",
        content: generateLocalPost(type, company || "Seu negócio"),
        cta: template?.cta || "Saiba mais",
      });

      setLoading(false);
    }, 700);
  }

  /**
   * 🔐 LOGIN
   */
  function handleLogin() {
    signIn("google", { callbackUrl: "/dashboard" });
  }

  /**
   * 🌐 UI
   */
  return (
    <main className="min-h-screen bg-white text-gray-800">

      {/* HERO */}
      <section className="text-center py-16 px-4 bg-gray-100">
        <h1 className="text-3xl md:text-4xl font-bold max-w-2xl mx-auto">
          Seu empreendimento não precisa de mais seguidores.
          <br />
          Transforme seguidores em clientes todos os dias.
        </h1>

        <p className="mt-6 text-lg">
          Postar todo dia nunca foi tão fácil.
        </p>

        <p className="mt-2">Menos dúvida, mais movimento.</p>
        <p className="mt-2">Seu feed trabalhando pra você.</p>

        {/* 🔥 TESTE GRÁTIS */}
        <button
          onClick={() => setShowTest(true)}
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded"
        >
          Testar grátis
        </button>
      </section>

      {/* FORMULÁRIO */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-bold text-center mb-4">
            Cadastre sua empresa
          </h2>

          <form onSubmit={handleLeadSubmit} className="space-y-3">

            <input
              name="empresa"
              placeholder="Nome da Empresa"
              value={lead.empresa}
              onChange={handleLeadChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="documento"
              placeholder="CNPJ ou CPF"
              value={lead.documento}
              onChange={handleLeadChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="nome"
              placeholder="Nome completo"
              value={lead.nome}
              onChange={handleLeadChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="E-mail"
              value={lead.email}
              onChange={handleLeadChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              name="whatsapp"
              placeholder="WhatsApp"
              value={lead.whatsapp}
              onChange={handleLeadChange}
              className="w-full border p-2 rounded"
              required
            />

            <button className="w-full bg-blue-600 text-white py-2 rounded">
              Cadastrar empresa
            </button>

          </form>
        </div>
      </section>

      {/* LOGIN */}
      <section className="py-12 text-center">
        <h2 className="text-xl font-semibold">Já é cliente?</h2>

        <p className="text-gray-600 mb-4">
          Se já adquiriu seu pacote, acesse abaixo:
        </p>

        <button
          onClick={handleLogin}
          className="bg-white border px-6 py-3 rounded shadow"
        >
          Entrar na plataforma
        </button>
      </section>

      {/* SIMULADOR */}
      {showTest && (
        <section className="max-w-md mx-auto pb-20 space-y-4">

          <input
            placeholder="Nome do seu negócio"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Escolha seu tipo</option>
            {Object.entries(postTemplates).map(([key, val]) => (
              <option key={key} value={key}>
                {val.title}
              </option>
            ))}
          </select>

          <button
            onClick={generatePost}
            className="bg-blue-600 text-white w-full py-2 rounded"
          >
            Gerar post
          </button>

          {post && (
            <img
              src={post.image}
              className="w-full h-64 object-cover rounded"
              alt="post"
            />
          )}
        </section>
      )}

    </main>
  );
}