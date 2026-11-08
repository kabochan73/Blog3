"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { apiFetch } from "@/shared/lib/api";
import { clearToken, getToken } from "@/shared/lib/auth";

const NAV_LINKS = [
  { href: "/admin/posts", label: "Public" },
  { href: "/admin/drafts", label: "Draft" },
  { href: "/admin/tags", label: "Tags" },
];

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const token = getToken();
    try {
      await apiFetch("/api/logout", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
    } catch {
      // token already invalid/expired — clear locally and move on regardless
    }
    clearToken();
    router.push("/login");
  }

  return (
    <header className="border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-3">
        <nav className="flex gap-6 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname.startsWith(link.href) ? "font-semibold text-gray-900" : "text-gray-500"}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button type="button" onClick={handleLogout} className="text-sm text-gray-500">
          Logout
        </button>
      </div>
    </header>
  );
}
