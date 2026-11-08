"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

import { getToken } from "@/shared/lib/auth";
import { AdminHeader } from "./AdminHeader";

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen">
      <AdminHeader />
      <main className="p-6">{children}</main>
    </div>
  );
}
