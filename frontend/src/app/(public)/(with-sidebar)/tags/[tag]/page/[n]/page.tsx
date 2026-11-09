import { notFound } from "next/navigation";

import { PostList } from "@/features/public/posts/components/PostList";
import type { PaginatedCollection, PostListItem } from "@/features/public/posts/types";
import type { PublicTag } from "@/features/public/tags/types";
import { publicApiFetch } from "@/shared/lib/api";
import { decodeRouteParam } from "@/shared/lib/params";

export const instant = false;

export async function generateStaticParams() {
  const tags = await publicApiFetch<PublicTag[]>("/api/tags");

  const params = await Promise.all(
    tags.map(async (tag) => {
      const { meta } = await publicApiFetch<PaginatedCollection<PostListItem>>(
        `/api/posts?tag=${encodeURIComponent(tag.name)}`,
      );

      return Array.from({ length: meta.last_page }, (_, i) => ({ tag: tag.name, n: String(i + 1) }));
    }),
  );

  const flat = params.flat();

  // Cache Components requires at least one param; fall back to a placeholder
  // when no tags exist yet (e.g. a fresh production database).
  if (flat.length === 0) {
    return [{ tag: "__placeholder__", n: "1" }];
  }

  return flat;
}

export default async function TagPostsPage({ params }: { params: Promise<{ tag: string; n: string }> }) {
  const { tag, n } = await params;
  const page = Number(n);

  if (!Number.isInteger(page) || page < 1) {
    notFound();
  }

  return <PostList page={page} tag={decodeRouteParam(tag)} />;
}
