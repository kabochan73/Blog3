import type { ReactNode } from "react";

import { TagList } from "@/features/public/tags/components/TagList";

export default function AdminWithSidebarLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_280px]">
        <main>{children}</main>
        <aside className="space-y-8 md:border-l md:border-foreground md:pl-12">
          <section>
            <h2 className="font-heading mb-3 text-3xl font-bold border-b border-foreground pb-4">About Me</h2>
            <p className="font-heading font-medium text-2xl">Takumi.K / 2001</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              LaravelとNEXT.jsを中心に勉強をしています。AWSも勉強中です。
              <br />
            </p>
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
