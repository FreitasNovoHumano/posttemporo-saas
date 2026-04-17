import { FileText, CheckCircle, Clock } from "lucide-react";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        <Card title="Posts" value="12" icon={FileText} color="blue" />
        <Card title="Aprovados" value="8" icon={CheckCircle} color="green" />
        <Card title="Pendentes" value="4" icon={Clock} color="yellow" />
      </div>
    </div>
  );
}

// 🔹 Componente reutilizável
function Card({ title, value, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-600",
    green: "bg-green-500/10 text-green-600",
    yellow: "bg-yellow-500/10 text-yellow-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
      
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500">{title}</p>
          <h2 className="text-4xl font-bold mt-2">{value}</h2>
        </div>

        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon size={22} />
        </div>
      </div>

    </div>
  );
}