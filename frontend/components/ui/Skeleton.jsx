/**
 * 💀 Skeleton Loader
 * --------------------------------------------------
 * Exibe estado de carregamento padrão
 */

export default function Skeleton() {
  return (
    <div className="animate-pulse p-4">
      <div className="h-6 bg-gray-300 rounded mb-4" />
      <div className="h-4 bg-gray-300 rounded mb-2" />
      <div className="h-4 bg-gray-300 rounded mb-2" />
    </div>
  );
}