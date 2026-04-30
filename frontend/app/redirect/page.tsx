"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/");
      return;
    }

    /**
     * 🔥 REGRA PRINCIPAL
     */
    if (!session.user.hasCompany) {
      router.push("/onboarding");
    } else {
      router.push("/dashboard");
    }

  }, [session, status, router]);

  return <p className="text-center mt-10">Redirecionando...</p>;
}