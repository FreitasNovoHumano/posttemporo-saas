// app/login/page.jsx

"use client";

export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen">
      <form className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <input
          placeholder="Email"
          className="w-full border p-2 mb-3"
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full border p-2 mb-3"
        />

        <button className="w-full bg-black text-white p-2 rounded">
          Entrar
        </button>
      </form>
    </div>
  );
}