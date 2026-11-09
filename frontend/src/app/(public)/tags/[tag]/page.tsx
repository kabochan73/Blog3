import { PostList } from "@/features/public/posts/components/PostList";
import type { PublicTag } from "@/features/public/tags/types";
import { publicApiFetch } from "@/shared/lib/api";
import { decodeRouteParam } from "@/shared/lib/params";

export const instant = false;

export async function generateStaticParams() {
  const tags = await publicApiFetch<PublicTag[]>("/api/tags");

  return tags.map((tag) => ({ tag: tag.name }));
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;

  return <PostList page={1} tag={decodeRouteParam(tag)} />;
}
