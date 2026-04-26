"use client";

/**
 * =====================================================
 * 🌐 LANDING PAGE (PRO - INSTAGRAM + FORM FUNCIONAL)
 * =====================================================
 *
 * 🔥 MELHORIAS:
 * - Preview estilo Instagram
 * - Formulário funcional (envia lead)
 * - Feedback visual pro usuário
 * - Código organizado
 *
 * =====================================================
 */

import { useState } from "react";

export default function HomePage() {
  /**
   * =====================================================
   * 📦 STATES
   * =====================================================
   */

  // 🔥 TESTE
  const [showTest, setShowTest] = useState(false);
  const [type, setType] = useState("");
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🔥 FORM
  const [form, setForm] = useState({
    name: "",
    company: "",
    whatsapp: "",
    email: "",
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  /**
   * =====================================================
   * 🧪 GERAR POST
   * =====================================================
   */
  async function generatePost() {
    if (!type) return alert("Escolha um tipo");

    setLoading(true);
    setPost(null);

    await new Promise((r) => setTimeout(r, 1200));

    const data: any = {
      hamburgueria: {
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        title: "🍔 Hambúrguer artesanal",
        content: "Suculento, queijo derretendo e molho especial 🤤",
        cta: "Peça agora!",
      },
      pizzaria: {
        image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
        title: "🍕 Hoje é dia de pizza",
        content: "Massa perfeita e recheio caprichado 😍",
        cta: "Peça já!",
      },
      churrasco: {
        image: "https://images.unsplash.com/photo-1558030006-450675393462",
        title: "🔥 Churrasco na brasa",
        content: "Carne suculenta direto da grelha!",
        cta: "Garanta o seu!",
      },
      marmitex: {
        image: "https://images.unsplash.com/photo-1604908176997-431221c7e1b2",
        title: "🍱 Marmitex quentinha",
        content: "Comida caseira com sabor de verdade ❤️",
        cta: "Peça agora!",
      },
      japonesa: {
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351",
        title: "🍣 Sushi fresco",
        content: "Peças selecionadas todos os dias",
        cta: "Faça seu pedido!",
      },
    };

    setPost(data[type]);
    setLoading(false);
  }

  /**
   * =====================================================
   * ✏️ FORM HANDLERS
   * =====================================================
   */
  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    setFormLoading(true);
    setFormSuccess(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leads`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error();

      setFormSuccess(true);

      // limpa form
      setForm({
        name: "",
        company: "",
        whatsapp: "",
        email: "",
      });

    } catch {
      alert("Erro ao enviar dados");
    } finally {
      setFormLoading(false);
    }
  }

  /**
   * =====================================================
   * 🌐 UI
   * =====================================================
   */
  return (
    <main className="bg-gray-100 min-h-screen flex flex-col items-center px-4 py-10 gap-10">

      {/* HEADLINE */}
      <h1 className="text-3xl font-bold text-center max-w-xl">
        Seu restaurante não precisa de mais seguidores.
        <br /> Precisa de mais clientes.
      </h1>

      {/* PROMESSA */}
      <p className="text-gray-600 text-center max-w-md">
        Posts automáticos, profissionais e que vendem todos os dias.
      </p>

      {/* FRASES */}
      <div className="text-center space-y-1">
        <p>✔️ Postar todo dia nunca foi tão fácil</p>
        <p>✔️ Menos dúvida, mais movimento</p>
        <p>✔️ Seu feed trabalhando pra você</p>
      </div>

      {/* CTA */}
      <button
        onClick={() => {
          setShowTest(true);
          setPost(null);
        }}
        className="bg-green-600 text-white px-6 py-3 rounded font-semibold"
      >
        Testar grátis agora 🚀
      </button>

      {/* TESTE */}
      {showTest && (
        <div className="bg-white p-6 rounded-xl shadow max-w-md w-full text-center space-y-4">

          <h2 className="font-bold">Teste grátis</h2>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Escolha seu tipo</option>
            <option value="hamburgueria">Hamburgueria</option>
            <option value="pizzaria">Pizzaria</option>
            <option value="churrasco">Churrasco</option>
            <option value="marmitex">Marmitex</option>
            <option value="japonesa">Japonesa</option>
          </select>

          <button
            onClick={generatePost}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Gerar meu post grátis
          </button>

          {loading && <p>Gerando post...</p>}

          {post && (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <img src={post.image} className="w-full h-60 object-cover" />
              <div className="p-4 text-left">
                <p className="font-bold">{post.title}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {post.content}
                </p>
                <p className="mt-3 text-green-600 font-semibold">
                  👉 {post.cta}
                </p>
              </div>
            </div>
          )}

        </div>
      )}

      {/* FORM */}
      <div className="bg-green-50 p-6 rounded-xl shadow max-w-md w-full">
        <h2 className="text-center font-bold mb-4">
          Receber proposta personalizada
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input name="name" value={form.name} onChange={handleChange} placeholder="Nome completo" className="w-full p-2 border rounded" />
          <input name="company" value={form.company} onChange={handleChange} placeholder="Empresa" className="w-full p-2 border rounded" />
          <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="WhatsApp" className="w-full p-2 border rounded" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />

          <button className="w-full bg-green-600 text-white p-3 rounded">
            {formLoading ? "Enviando..." : "Quero uma proposta"}
          </button>

          {formSuccess && (
            <p className="text-green-600 text-sm text-center">
              ✅ Recebemos seus dados! Vamos entrar em contato.
            </p>
          )}

        </form>
      </div>

      {/* LOGIN */}
      <div className="text-center">
        <a href="/login" className="text-blue-600">
          Já sou cliente →
        </a>
      </div>

    </main>
  );
}