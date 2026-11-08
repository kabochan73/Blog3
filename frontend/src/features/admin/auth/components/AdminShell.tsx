"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { getToken } from "@/shared/lib/auth";
import { createQueryClient } from "../../queryClient";
import { AdminHeader } from "./AdminHeader";

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [queryClient] = useState(createQueryClient);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </QueryClientProvider>
  );
}
