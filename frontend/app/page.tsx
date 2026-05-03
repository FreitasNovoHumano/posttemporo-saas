"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { generateLocalPost } from "@/utils/copyGenerator";
import { segmentImages } from "@/utils/segmentImages";

/**
 * =====================================================
 * 📦 TIPAGENS
 * =====================================================
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
  cep?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  corporateName?: string;
  ownerDocument?: string;
  number?: string;
  file?: File | null;
};

/**
 * =====================================================
 * 🎯 TEMPLATES DE NEGÓCIO
 * =====================================================
 */
const postTemplates: Record<string, { label: string }> = {
  restaurante: { label: "🍽️ Restaurante" },
  lanchonete: { label: "🍔 Lanchonete" },
  delivery: { label: "🚀 Delivery" },
  cafe: { label: "☕ Café" },
  confeitaria: { label: "🍰 Confeitaria" },
};

export default function HomePage() {
  const router = useRouter();

  const [showTest, setShowTest] = useState(false);
  const [type, setType] = useState("");
  const [company, setCompany] = useState("");
  const [post, setPost] = useState<Post | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [lead, setLead] = useState<LeadForm>({
    empresa: "",
    documento: "",
    nome: "",
    email: "",
    whatsapp: "",
  });

  /**
   * =====================================================
   * ✏️ HANDLE INPUT LEAD
   * =====================================================
   */
  function handleLeadChange(e: ChangeEvent<HTMLInputElement>) {
    setLead({
      ...lead,
      [e.target.name]: e.target.value,
    });
  }

  /**
   * =====================================================
   * 📤 SUBMIT LEAD
   * =====================================================
   */
  async function handleLeadSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.entries(lead).forEach(([key, value]) => {
        if (value) formData.append(key, value as string);
      });

      // 🔥 ENVIA CONTEXTO PARA BACKEND
      formData.append("segment", type || "geral");
      formData.append("generatedPost", post?.content || "");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      alert("Empresa cadastrada com sucesso");

      /**
       * =====================================================
       * 📊 EVENTOS (PIXEL + GOOGLE)
       * =====================================================
       */
      if (typeof window !== "undefined") {
        // Lead inteligente com segmento
        (window as any).fbq?.("track", "Lead", {
          segment: type || "geral",
        });

        // Registro completo
        (window as any).fbq?.("track", "CompleteRegistration", {
          content_name: lead.empresa || "empresa_nao_informada",
        });

        // Google
        (window as any).gtag?.("event", "sign_up");
      }

      if (data?.id) {
        router.push(`/onboarding/company?leadId=${data.id}`);
      }

    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar empresa");
    }
  }

  /**
   * =====================================================
   * ⚡ GERAR POST
   * =====================================================
   */
  function generatePost() {
    if (!type) {
      setError("Escolha um tipo de negócio");
      return;
    }

    // 📊 Evento de interesse
    (window as any).fbq?.("track", "ViewContent");
    (window as any).gtag?.("event", "view_item");

    setLoading(true);
    setError(null);

    const images = segmentImages[type] || segmentImages.default;

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * images.length);

      setPost({
        image: images[randomIndex],
        title: company || "Seu negócio",
        content: generateLocalPost(type, company || "Seu negócio"),
        cta: "Saiba mais",
      });

      setLoading(false);
    }, 600);
  }

  /**
   * =====================================================
   * 📍 CEP AUTO COMPLETE
   * =====================================================
   */
  async function handleCep(e: ChangeEvent<HTMLInputElement>) {
    const cep = e.target.value.replace(/\D/g, "");

    setLead((prev) => ({ ...prev, cep }));

    if (cep.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (data.erro) return;

      setLead((prev) => ({
        ...prev,
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      }));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-800">

      {/* HERO */}
      <section className="text-center py-20 px-4 bg-gray-100">
        <h1 className="text-4xl font-bold max-w-3xl mx-auto leading-tight">
          Transforme seguidores em clientes todos os dias
        </h1>

        <p className="mt-6 text-lg">
          Postar todo dia nunca foi tão fácil.
        </p>

        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => setShowTest(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            🚀 Gerar meu primeiro post
          </button>

          <button
            onClick={() => signIn("google")}
            className="border px-6 py-3 rounded-lg"
          >
            🔐 Entrar com Google
          </button>
        </div>
      </section>

      {/* SIMULADOR */}
      {showTest && (
        <section className="max-w-md mx-auto py-12 space-y-4">

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Escolha seu tipo de negócio</option>
            {Object.entries(postTemplates).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>

          <button
            onClick={generatePost}
            className="bg-blue-600 text-white w-full py-2 rounded"
          >
            Gerar post
          </button>

          {post && (
            <div className="space-y-2 border p-3 rounded-lg shadow">
              <img src={post.image} className="w-full h-64 object-cover rounded" />
              <p className="text-sm">{post.content}</p>
            </div>
          )}
        </section>
      )}

    </main>
  );
}