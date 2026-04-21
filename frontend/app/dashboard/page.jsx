"use client";

import Notifications from "@/components/notifications/Notifications";

import PageTransition from "@/app/components/ui/PageTransition";
import Skeleton from "@/app/components/ui/Skeleton";

export default function Dashboard() {
  const loading = false; // simulação

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
    </PageTransition>
  );
}