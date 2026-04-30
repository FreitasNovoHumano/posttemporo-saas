"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

/**
 * 🌐 Providers globais
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  console.log("PROVIDERS ATIVO"); // debug

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <DndProvider backend={HTML5Backend}>
          {children}
        </DndProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}