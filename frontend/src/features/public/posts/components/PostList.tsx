import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";

import { publicApiFetch } from "@/shared/lib/api";
import type { PaginatedCollection, PostListItem } from "../types";
import { Pagination } from "./Pagination";
import { PostCard } from "./PostCard";

export async function PostList({ page, tag }: { page: number; tag?: string }) {
  "use cache";
  cacheLife("max");

  const query = new URLSearchParams({ page: String(page) });
  if (tag) {
    query.set("tag", tag);
  }

  const { data: posts, meta } = await publicApiFetch<PaginatedCollection<PostListItem>>(`/api/posts?${query}`);

  if (page > meta.last_page) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
      <Pagination currentPage={meta.current_page} lastPage={meta.last_page} tag={tag} />
    </div>
  );
}
