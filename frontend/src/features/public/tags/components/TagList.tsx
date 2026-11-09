import { cacheLife } from "next/cache";
import Link from "next/link";

import { publicApiFetch } from "@/shared/lib/api";
import type { PublicTag } from "../types";

export async function TagList() {
  "use cache";
  cacheLife("max");

  const tags = await publicApiFetch<PublicTag[]>("/api/tags");

  if (tags.length === 0) {
    return null;
  }

  return (
    <nav className="flex flex-col text-base font-semibold">
      {tags.map((tag) => (
        <Link
          key={tag.name}
          href={`/tags/${tag.name}`}
          prefetch
          className="border-b border-foreground/40 py-2 text-foreground hover:text-foreground/60"
        >
          {tag.name}
        </Link>
      ))}
    </nav>
  );
}
