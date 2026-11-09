"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { apiFetch } from "@/shared/lib/api";
import { clearToken, getToken } from "@/shared/lib/auth";

const NAV_LINKS = [
  { href: "/admin/posts/new", label: "New" },
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
    router.push("/");
  }

  return (
    <header className="border-b border-foreground">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/admin/posts" className="inline-block transition-opacity hover:opacity-60">
          <h1 className="font-heading text-4xl font-bold">My Blog</h1>
        </Link>
        <nav className="flex items-center gap-6 text-xl font-medium">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/admin/posts"
                ? pathname.startsWith(link.href) && !pathname.startsWith("/admin/posts/new")
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? "text-foreground text-2xl" : "text-foreground/50 hover:text-foreground"}
              >
                {link.label}
              </Link>
            );
          })}
          <button type="button" onClick={handleLogout} className="text-foreground/50 hover:text-foreground">
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
