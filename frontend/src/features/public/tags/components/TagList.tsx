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
    <nav className="flex flex-col gap-2 text-sm">
      {tags.map((tag) => (
        <Link
          key={tag.name}
          href={`/tags/${tag.name}`}
          prefetch
          className="text-foreground/70 hover:text-foreground hover:underline"
        >
          {tag.name}
        </Link>
      ))}
    </nav>
  );
}
