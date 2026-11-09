import Link from "next/link";
import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="border-b border-foreground">
        <div className="mx-auto w-full max-w-6xl px-4 py-4">
          <Link href="/" className="inline-block transition-opacity hover:opacity-60">
            <h1 className="font-heading text-4xl font-bold">My Blog</h1>
          </Link>
        </div>
      </header>
      {children}
    </>
  );
}
