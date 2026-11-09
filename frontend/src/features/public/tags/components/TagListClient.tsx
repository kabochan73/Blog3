"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { decodeRouteParam } from "@/shared/lib/params";
import type { PublicTag } from "../types";

export function TagListClient({ tags }: { tags: PublicTag[] }) {
  const pathname = decodeRouteParam(usePathname());

  return (
    <nav className="flex flex-col gap-1 text-base">
      {tags.map((tag) => {
        const isActive = pathname === `/tags/${tag.name}` || pathname.startsWith(`/tags/${tag.name}/`);

        return (
          <Link
            key={tag.name}
            href={isActive ? "/" : `/tags/${tag.name}`}
            prefetch
            className={
              isActive
                ? "border-b border-foreground/40 bg-foreground/80 py-1 pl-2 font-medium text-background"
                : "border-b border-foreground/40 py-1 pl-2 text-foreground hover:text-foreground/60"
            }
          >
            {tag.name}
          </Link>
        );
      })}
    </nav>
  );
}
