import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

// 🔹 Layout do dashboard (envolve todas as páginas internas)
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}