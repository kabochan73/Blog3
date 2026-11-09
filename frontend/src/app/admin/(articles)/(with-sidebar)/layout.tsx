import Link from "next/link";
import type { ReactNode } from "react";

import { TagList } from "@/features/public/tags/components/TagList";

export default function AdminWithSidebarLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_280px]">
        <main>{children}</main>
        <aside className="space-y-8 md:border-l md:border-foreground md:pl-12">
          <section>
            <h2 className="font-heading mb-3 text-3xl font-bold border-b border-foreground pb-4">Actions</h2>
            <nav className="flex flex-col gap-1 text-base font-semibold">
              <Link
                href="/admin/posts/new"
                className="border-b border-foreground/40 py-1 text-foreground hover:text-foreground/60"
              >
                新規記事作成
              </Link>
              <Link
                href="/admin/drafts"
                className="border-b border-foreground/40 py-1 text-foreground hover:text-foreground/60"
              >
                下書き一覧
              </Link>
              <Link
                href="/admin/tags"
                className="border-b border-foreground/40 py-1 text-foreground hover:text-foreground/60"
              >
                タグ管理
              </Link>
            </nav>
          </section>
          <section>
            <h2 className="font-heading mb-3 text-3xl font-bold border-b border-foreground pb-4">Tags</h2>
            <TagList />
          </section>
        </aside>
      </div>
    </div>
  );
}
