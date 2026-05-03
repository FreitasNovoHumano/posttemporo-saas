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

      // 🔥 NOVO
formData.append("segment", type);
formData.append("generatedPost", post?.content || "");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      alert("Empresa cadastrada com sucesso");

      /**
       * 📊 EVENTOS
       */
      if (data?.id) {
        (window as any).fbq?.("track", "CompleteRegistration", {
          content_name: lead.empresa || "empresa_nao_informada",
        });

        (window as any).gtag?.("event", "sign_up");

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
        <p>Menos dúvida, mais movimento.</p>
        <p>Seu feed trabalhando pra você.</p>

        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => setShowTest(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            🚀 Gerar meu primeiro post
          </button>

          <button
            onClick={() => signIn("google")}
            className="border px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            🔐 Entrar com Google
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Sem cartão de crédito
        </p>
      </section>

      {/* SIMULADOR */}
      {showTest && (
        <section className="max-w-md mx-auto py-12 space-y-4">

          <h2 className="text-xl font-semibold text-center">
            Veja como seus posts podem ficar 👇
          </h2>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Escolha seu tipo de negócio</option>

            {Object.entries(postTemplates).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
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
            <div className="space-y-2 border p-3 rounded-lg shadow">
              <img src={post.image} className="w-full h-64 object-cover rounded" />
              <p className="text-sm">{post.content}</p>
            </div>
          )}

          {/* =====================================================
              🔥 NOVO BLOCO DE CONVERSÃO (ADICIONADO)
              ===================================================== */}
          {post && (
            <div className="bg-yellow-50 border p-4 rounded mt-4">
              <p className="text-sm font-semibold">
                Quer mais posts como esse todos os dias?
              </p>

              <p className="text-xs text-gray-600 mb-3">
                Receba ideias prontas no seu WhatsApp gratuitamente.
              </p>

              <button
                onClick={() =>
                  window.scrollTo({ top: 9999, behavior: "smooth" })
                }
                className="bg-black text-white px-4 py-2 rounded text-sm w-full"
              >
                Quero meus 7 posts grátis
              </button>

              <p className="text-xs text-gray-500 mt-2">
                🔥 Mais de 127 negócios já geraram posts hoje
              </p>

            </div>
          )}

        </section>
      )}

      {/* CTA */}
      {showTest && (
        <div className="text-center pb-6">
          <p className="mb-3 font-medium">
            Gostou? Crie sua conta agora 👇
          </p>

          <button
            className="bg-green-600 text-white px-6 py-2 rounded"
            onClick={() => window.scrollTo({ top: 9999, behavior: "smooth" })}
          >
            Criar minha conta grátis
          </button>
        </div>
      )}

      {/* FORM */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-bold text-center mb-4">
            Começar a gerar clientes
          </h2>

          <form onSubmit={handleLeadSubmit} className="space-y-3">
            <input name="empresa" onChange={handleLeadChange} placeholder="Nome fantasia" className="w-full border p-2 rounded" required />
            <input name="corporateName" placeholder="Razão social" onChange={handleLeadChange} className="w-full border p-2 rounded" required />
            <input name="documento" onChange={handleLeadChange} placeholder="CNPJ ou CPF" className="w-full border p-2 rounded" required />
            <input name="nome" onChange={handleLeadChange} placeholder="Responsável" className="w-full border p-2 rounded" required />
            <input name="ownerDocument" placeholder="CPF ou RG" onChange={handleLeadChange} className="w-full border p-2 rounded" required />
            <input name="email" onChange={handleLeadChange} placeholder="Email" className="w-full border p-2 rounded" required />
            <input name="whatsapp" onChange={handleLeadChange} placeholder="WhatsApp" className="w-full border p-2 rounded" required />

            <input name="cep" placeholder="CEP" onChange={handleCep} className="w-full border p-2 rounded" required />

            <input name="street" value={lead.street || ""} readOnly className="w-full border p-2 rounded bg-gray-100" />
            <input name="neighborhood" value={lead.neighborhood || ""} readOnly className="w-full border p-2 rounded bg-gray-100" />
            <input name="city" value={lead.city || ""} readOnly className="w-full border p-2 rounded bg-gray-100" />
            <input name="state" value={lead.state || ""} readOnly className="w-full border p-2 rounded bg-gray-100" />

            <input name="number" placeholder="Número" onChange={handleLeadChange} className="w-full border p-2 rounded" required />

            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setLead({ ...lead, file });
              }}
              className="w-full"
              required
            />

            <button className="w-full bg-blue-600 text-white py-2 rounded">
              🚀 Começar a gerar clientes
            </button>
          </form>
        </div>
      </section>

    </main>
  );
}