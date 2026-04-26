import { useAuth } from "@/context/AuthContext";

export default function Protected({ roles, children }) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return null;
  }

  return children;
}