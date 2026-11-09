"use client";

import Link from "next/link";

import { resolveImageUrl } from "@/shared/lib/api";
import { usePostsAdmin } from "../hooks/usePostsAdmin";
import type { PostStatus } from "../types";

export function PostList({ status }: { status: PostStatus }) {
  const postsQuery = usePostsAdmin(status);

  if (postsQuery.isLoading) {
    return <p className="text-sm text-foreground/50">読み込み中...</p>;
  }

  if (postsQuery.isError) {
    return <p className="text-sm text-red-600">記事の取得に失敗しました</p>;
  }

  const posts = postsQuery.data?.data ?? [];

  if (posts.length === 0) {
    return <p className="text-sm text-foreground/50">記事がありません</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {posts.map((post) => (
        <article
          key={post.slug}
          className="relative flex gap-6 border-b border-foreground pb-6 transition-opacity hover:opacity-60"
        >
          {post.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element -- source is the Laravel backend, not optimizable by next/image
            <img
              src={resolveImageUrl(post.thumbnail)}
              alt=""
              className="aspect-[4/3] w-32 shrink-0 object-cover sm:w-44"
            />
          ) : (
            <div className="aspect-[4/3] w-32 shrink-0 bg-foreground sm:w-44" />
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h2 className="font-heading text-3xl font-bold tracking-tight">
              <Link href={`/admin/posts/${post.slug}/edit`} className="after:absolute after:inset-0">
                {post.title}
              </Link>
            </h2>
            {post.excerpt && <p className="text-xl font-light text-foreground/80">{post.excerpt}</p>}
            <div className="mt-3 flex items-center gap-3 text-foreground/80">
              <time dateTime={post.created_at} className="text-xl font-light">
                {new Date(post.created_at).toLocaleDateString("ja-JP")}
              </time>
              {post.tags.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <li key={tag} className="rounded-full bg-foreground px-3 pb-0.5 text-sm font-medium text-background">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
