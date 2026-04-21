/**
 * 🔹 Tipos possíveis de status
 */
type PostStatusType = "PENDING" | "APPROVED" | "REJECTED";

/**
 * 🔹 Props do componente
 */
interface PostStatusProps {
  status: PostStatusType;
}

/**
 * 🔹 Componente de status visual
 */
export default function PostStatus({ status }: PostStatusProps) {
  const styles: Record<PostStatusType, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}