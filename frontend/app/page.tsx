"use client";

/**
 * =====================================================
 * 🌐 LANDING PAGE - POSTTEMPERO
 * =====================================================
 * 🎯 Objetivo:
 * - Permitir teste gratuito (1 post)
 * - Demonstrar valor real
 * - Converter após experiência
 *
 * 🧠 Estratégia:
 * - Usuário testa primeiro
 * - Sistema gera post realista
 * - Após 1 uso → bloqueio + conversão
 * =====================================================
 */

import { useState } from "react";

export default function Home() {

  /**
   * 🔀 Função utilitária para variar textos
   */
  function randomItem(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * 📌 FORMULÁRIO (lead)
   */
  const [form, setForm] = useState({
    nome: "",
    empresa: "",
    whatsapp: "",
    email: "",
  });

  /**
   * 📌 SIMULADOR
   */
  const [segmento, setSegmento] = useState("");
  const [postGerado, setPostGerado] = useState<any>(null);
  const [jaGerou, setJaGerou] = useState(false);

  /**
   * ✏️ INPUT HANDLER
   */
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * 🤖 GERAR POST (COM VARIAÇÃO)
   */
  const gerarPost = () => {
    if (!segmento) return;

    if (jaGerou) {
      alert("Você já utilizou seu teste gratuito.");
      return;
    }

    const empresa = form.empresa || "Seu restaurante";

    const posts: any = {

      hamburgueria: {
        texto: `🍔 ${empresa}

${randomItem([
  "Hoje é dia de hambúrguer de verdade.",
  "Bateu aquela fome? A gente resolve.",
  "Nada melhor que um hambúrguer caprichado hoje.",
])}

${randomItem([
  "Carne suculenta, pão macio e muito sabor 🤤",
  "Preparado na hora, do jeito que você gosta.",
  "Sabor que vicia e faz voltar.",
])}

${randomItem([
  "🔥 Peça agora!",
  "📲 Garanta o seu!",
  "🚀 Aproveite agora!",
])}`,
        imagem: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
      },

      pizzaria: {
        texto: `🍕 ${empresa}

${randomItem([
  "Pizza quentinha saindo agora!",
  "Hoje é dia de pizza 🍕",
  "Chegou a hora da melhor pizza do dia.",
])}

${randomItem([
  "Direto do forno pra você 🔥",
  "Massa perfeita e recheio caprichado.",
  "Sabor que conquista.",
])}

${randomItem([
  "📲 Faça seu pedido agora!",
  "🔥 Peça já!",
  "🚀 Não fica de fora!",
])}`,
        imagem: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
      },

      japones: {
        texto: `🍣 ${empresa}

${randomItem([
  "Sushi fresco preparado na hora.",
  "Experiência japonesa de verdade.",
  "Qualidade que dá pra ver.",
])}

${randomItem([
  "Sabor leve e irresistível 😍",
  "Combos incríveis te esperando.",
  "Peças selecionadas com cuidado.",
])}

${randomItem([
  "📲 Peça agora!",
  "🔥 Garanta o seu!",
  "🚀 Faça seu pedido!",
])}`,
        imagem: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
      },

      chines: {
        texto: `🥡 ${empresa}

${randomItem([
  "Explosão de sabores orientais!",
  "Hoje tem comida chinesa de verdade.",
  "Sabor que conquista.",
])}

${randomItem([
  "Yakissoba, rolinho primavera e muito mais 😋",
  "Pratos deliciosos esperando por você.",
  "Combinação perfeita de sabores.",
])}

${randomItem([
  "📲 Peça agora!",
  "🔥 Aproveite hoje!",
  "🚀 Faça seu pedido!",
])}`,
        imagem: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800",
      },

      churrasco: {
        texto: `🔥 ${empresa}

${randomItem([
  "Churrasco no ponto perfeito.",
  "Hoje é dia de carne boa.",
  "Sabor de verdade.",
])}

${randomItem([
  "Suculento e irresistível 🥩",
  "Preparado no capricho.",
  "Pra quem gosta de comer bem.",
])}

${randomItem([
  "📍 Vem garantir o seu!",
  "🔥 Aproveite agora!",
  "🚀 Não perde!",
])}`,
        imagem: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
      },

      outro: {
        texto: `📢 ${empresa}

${randomItem([
  "Hoje tem coisa boa te esperando!",
  "Mais um dia de sabor incrível.",
  "Preparado com carinho pra você.",
])}

${randomItem([
  "Qualidade e sabor em cada detalhe 😍",
  "Você merece o melhor.",
  "Experimente hoje!",
])}

${randomItem([
  "📲 Peça agora!",
  "🔥 Aproveite!",
  "🚀 Garanta já!",
])}`,
        imagem: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
      },
    };

    setPostGerado(posts[segmento]);
    setJaGerou(true);
  };

  return (
    <main className="bg-white text-gray-900">

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">

        <h1 className="text-4xl md:text-6xl font-bold max-w-3xl">
          Seu restaurante não precisa de mais seguidores.
          <span className="text-green-600"> Precisa de mais clientes.</span>
        </h1>

        <p className="mt-4 text-gray-600">
          Teste grátis: veja como seus posts podem ficar 👇
        </p>

      </section>

      {/* SIMULADOR */}
      <section className="py-20 bg-gray-50 text-center px-6">

        <h2 className="text-3xl font-bold mb-6">
          Gere seu primeiro post automático
        </h2>

        <select
          onChange={(e) => setSegmento(e.target.value)}
          className="border p-3 rounded mb-4"
        >
          <option value="">Escolha seu tipo de restaurante</option>
          <option value="hamburgueria">Hamburgueria</option>
          <option value="pizzaria">Pizzaria</option>
          <option value="churrasco">Churrasco</option>
          <option value="chines">Comida Chinesa</option>
          <option value="japones">Comida Japonesa</option>
          <option value="outro">Outro</option>
        </select>

        <button
          onClick={gerarPost}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Gerar meu post grátis
        </button>

        {/* POST */}
        {postGerado && (
          <div className="mt-10 max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden border">

            <div className="flex items-center gap-3 p-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full" />
              <span className="font-semibold">
                {form.empresa || "seu_restaurante"}
              </span>
            </div>

            <img
              src={postGerado.imagem}
              alt="post"
              className="w-full h-64 object-cover"
            />

            <div className="flex gap-4 px-4 py-2 text-xl">
              ❤️ 💬 📤
            </div>

            <div className="px-4 pb-4 text-sm whitespace-pre-line">
              <span className="font-semibold">
                {form.empresa || "seu_restaurante"}
              </span>{" "}
              {postGerado.texto}
            </div>

          </div>
        )}

        {/* CONVERSÃO */}
        {jaGerou && (
          <div className="mt-8 max-w-md mx-auto bg-green-50 p-6 rounded-xl border">

            <h3 className="text-xl font-bold mb-2">
              Esse foi só um exemplo 😉
            </h3>

            <p className="text-gray-600 mb-4">
              Imagine isso todos os dias no seu Instagram.
            </p>

            <form className="grid gap-3">
              <input name="nome" placeholder="Seu nome" onChange={handleChange} className="border p-3 rounded" />
              <input name="empresa" placeholder="Empresa" onChange={handleChange} className="border p-3 rounded" />
              <input name="whatsapp" placeholder="WhatsApp" onChange={handleChange} className="border p-3 rounded" />
              <input name="email" placeholder="Email" onChange={handleChange} className="border p-3 rounded" />

              <button className="bg-green-600 text-white py-3 rounded-xl">
                Quero posts assim todos os dias
              </button>
            </form>

          </div>
        )}

      </section>

    </main>
  );
}