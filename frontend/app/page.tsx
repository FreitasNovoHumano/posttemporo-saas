"use client";

/**
 * =====================================================
 * 🌐 LANDING PAGE - POSTTEMPERO
 * =====================================================
 * 🎯 Objetivo:
 * - Captar leads
 * - Demonstrar valor com simulação real
 * - Converter visitante em cliente
 *
 * 💡 Estratégia:
 * - Hero simples e direto
 * - Simulador com efeito visual (Instagram-like)
 * - Imagens reais por segmento (sem API)
 * =====================================================
 */

import { useState } from "react";

export default function Home() {

  /**
   * =====================================================
   * 📌 FORMULÁRIO
   * =====================================================
   */
  const [form, setForm] = useState({
    nome: "",
    empresa: "",
    whatsapp: "",
    email: "",
  });

  /**
   * =====================================================
   * 📌 SIMULADOR
   * =====================================================
   */
  const [segmento, setSegmento] = useState("");
  const [postGerado, setPostGerado] = useState<any>(null);

  /**
   * =====================================================
   * ✏️ HANDLER INPUTS
   * =====================================================
   */
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * =====================================================
   * 🤖 GERADOR DE POST
   * =====================================================
   */
  const gerarPost = () => {
    if (!segmento) return;

    const empresa = form.empresa || "Seu restaurante";

    const posts: any = {

      pizzaria: {
        texto: `🍕 ${empresa}

Seu restaurante não precisa de mais seguidores.
Precisa de mais clientes.

🔥 Sextou com promoção especial!
Peça agora e aumente seu movimento.`,
        imagem: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
      },

      hamburgueria: {
        texto: `🍔 ${empresa}

Postar todo dia nunca foi tão fácil.

🔥 Hambúrguer artesanal saindo agora!
Garanta o seu hoje.`,
        imagem: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
      },

      japones: {
        texto: `🍣 ${empresa}

Seu feed trabalhando pra você.

✨ Sushi fresco todos os dias!`,
        imagem: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
      },

      chines: {
        texto: `🥡 ${empresa}

Mais clientes todos os dias.

🔥 Sabores incríveis esperando por você!`,
        imagem: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800",
      },

      churrasco: {
        texto: `🔥 ${empresa}

Menos dúvida, mais movimento.

🥩 Churrasco no ponto perfeito!`,
        imagem: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
      },

      outro: {
        texto: `📢 ${empresa}

Promoção especial hoje!

Aproveite agora.`,
        imagem: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
      },
    };

    // ✅ CORREÇÃO CRÍTICA
    setPostGerado(posts[segmento]);
  };

  return (
    <main className="bg-white text-gray-900">

      {/* =====================================================
          🚀 HERO
      ===================================================== */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">

        <h1 className="text-4xl md:text-6xl font-bold max-w-3xl">
          Seu restaurante não precisa de mais seguidores.
          <span className="text-green-600"> Precisa de mais clientes.</span>
        </h1>

        <p className="mt-4 text-gray-600">
          Veja como seus posts podem ficar automaticamente 👇
        </p>

        {/* FORM */}
        <form className="mt-8 grid gap-3 max-w-md w-full">
          <input name="nome" placeholder="Nome" onChange={handleChange} className="border p-3 rounded" />
          <input name="empresa" placeholder="Empresa" onChange={handleChange} className="border p-3 rounded" />
          <input name="whatsapp" placeholder="WhatsApp" onChange={handleChange} className="border p-3 rounded" />
          <input name="email" placeholder="Email" onChange={handleChange} className="border p-3 rounded" />

          <button className="bg-green-600 text-white py-3 rounded-xl hover:bg-green-700">
            Quero receber posts automáticos
          </button>
        </form>

      </section>

      {/* =====================================================
          🤖 SIMULADOR
      ===================================================== */}
      <section className="py-20 bg-gray-50 text-center px-6">

        <h2 className="text-3xl font-bold mb-6">
          Veja um exemplo de post automático
        </h2>

        <select
          onChange={(e) => setSegmento(e.target.value)}
          className="border p-3 rounded mb-4"
        >
          <option value="">Escolha seu tipo de restaurante</option>
          <option value="pizzaria">Pizzaria</option>
          <option value="hamburgueria">Hamburgueria</option>
          <option value="churrasco">Churrasco</option>
          <option value="chines">Comida Chinesa</option>
          <option value="japones">Comida Japonesa</option>
          <option value="outro">Outro</option>
        </select>

        <button
          onClick={gerarPost}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Gerar post
        </button>

        {/* 📱 POST ESTILO INSTAGRAM */}
        {postGerado && (
          <div className="mt-10 max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden border">

            {/* HEADER */}
            <div className="flex items-center gap-3 p-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full" />
              <span className="font-semibold">
                {form.empresa || "seu_restaurante"}
              </span>
            </div>

            {/* IMAGEM */}
            <img
              src={postGerado.imagem}
              alt="post"
              className="w-full h-64 object-cover"
              onError={(e: any) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800";
              }}
            />

            {/* AÇÕES */}
            <div className="flex gap-4 px-4 py-2 text-xl">
              ❤️ 💬 📤
            </div>

            {/* TEXTO */}
            <div className="px-4 pb-4 text-sm whitespace-pre-line">
              <span className="font-semibold">
                {form.empresa || "seu_restaurante"}
              </span>{" "}
              {postGerado.texto}
            </div>

          </div>
        )}

      </section>

    </main>
  );
}