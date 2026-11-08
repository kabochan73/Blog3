import type { ReactNode } from "react";

import { AdminShell } from "@/features/admin/auth/components/AdminShell";

// /admin/* is always client-rendered behind a localStorage-token guard (see AdminShell),
// never a static shell, so it's exempt from Cache Components' instant-navigation validation.
export const instant = false;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
