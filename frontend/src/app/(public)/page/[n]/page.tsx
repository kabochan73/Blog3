import { notFound } from "next/navigation";

import { PostList } from "@/features/public/posts/components/PostList";
import type { PaginatedCollection, PostListItem } from "@/features/public/posts/types";
import { publicApiFetch } from "@/shared/lib/api";

export async function generateStaticParams() {
  const { meta } = await publicApiFetch<PaginatedCollection<PostListItem>>("/api/posts");

  return Array.from({ length: meta.last_page }, (_, i) => ({ n: String(i + 1) }));
}

export default async function PostsPage({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const page = Number(n);

  if (!Number.isInteger(page) || page < 1) {
    notFound();
  }

  return <PostList page={page} />;
}
