import Link from "next/link";
import type { ReactNode } from "react";

import { TagList } from "@/features/public/tags/components/TagList";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-10 border-b border-foreground/10 pb-6">
        <Link href="/">
          <h1 className="font-heading text-4xl font-bold">Blog</h1>
        </Link>
      </header>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_280px]">
        <main>{children}</main>
        <aside className="space-y-10">
          <section>
            <h2 className="font-heading mb-3 text-xl font-semibold">About Me</h2>
            {/* TODO: 実際のプロフィールに差し替える */}
            <p className="font-heading text-base font-medium">名前 / 年齢</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70">
              自己紹介文をここに記載します。
            </p>
          </section>
          <section>
            <h2 className="font-heading mb-3 text-xl font-semibold">Tags</h2>
            <TagList />
          </section>
        </aside>
      </div>
    </div>
  );
}
