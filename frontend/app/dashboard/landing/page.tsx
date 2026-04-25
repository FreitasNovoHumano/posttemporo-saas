"use client";

export default function LandingPage() {
  return (
    <main className="bg-white text-gray-900">

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight">
          Seu restaurante não precisa de mais seguidores.
          <span className="text-green-600"> Precisa de mais clientes.</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl">
          Postar todo dia nunca foi tão fácil.
        </p>

        <p className="mt-2 text-lg text-gray-600">
          Menos dúvida, mais movimento.
        </p>

        <p className="mt-2 text-lg text-gray-600">
          Seu feed trabalhando pra você.
        </p>

        <a
          href="#form"
          className="mt-8 bg-green-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-green-700"
        >
          Quero receber uma proposta
        </a>
      </section>

      {/* SEGMENTOS */}
      <section className="py-20 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-10">
          Feito para todo tipo de restaurante
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            "Pizzarias",
            "Hamburguerias",
            "Churrascarias",
            "Marmitex",
            "Restaurante à la carte",
            "Comida caseira",
            "Delivery",
            "Food trucks",
            "Negócios locais",
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow">
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* FORMULÁRIO */}
      <section id="form" className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Receba uma proposta personalizada
        </h2>

        <p className="text-gray-600 mb-10">
          Preencha os dados e entraremos em contato com você
        </p>

        <form className="max-w-xl mx-auto grid gap-4">
          <input className="border p-3 rounded" placeholder="Nome" />
          <input className="border p-3 rounded" placeholder="Sobrenome" />
          <input className="border p-3 rounded" placeholder="Nome da empresa" />
          <input className="border p-3 rounded" placeholder="WhatsApp" />
          <input className="border p-3 rounded" placeholder="Email" />

          <button className="bg-green-600 text-white py-3 rounded-xl">
            Solicitar proposta
          </button>
        </form>
      </section>

      {/* ACESSO AO SISTEMA */}
      <section className="py-20 px-6 bg-gray-50 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Já é cliente?
        </h2>

        <p className="text-gray-600 mb-6">
          Se você já adquiriu seu pacote de posts automatizado,
          cadastre seu login para acessar a plataforma.
        </p>

        <a
          href="/register"
          className="bg-black text-white px-6 py-3 rounded-xl mr-4"
        >
          Cadastrar usuário
        </a>

        <a
          href="/login"
          className="border px-6 py-3 rounded-xl"
        >
          Fazer login
        </a>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-gray-500">
        © {new Date().getFullYear()} PostTempero
      </footer>
    </main>
  );
}