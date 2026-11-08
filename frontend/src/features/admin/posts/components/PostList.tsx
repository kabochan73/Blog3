"use client";

import Link from "next/link";

import { usePostsAdmin } from "../hooks/usePostsAdmin";
import type { PostStatus } from "../types";

export function PostList({ status }: { status: PostStatus }) {
  const postsQuery = usePostsAdmin(status);

  if (postsQuery.isLoading) {
    return <p className="text-sm text-gray-500">読み込み中...</p>;
  }

  if (postsQuery.isError) {
    return <p className="text-sm text-red-600">記事の取得に失敗しました</p>;
  }

  const posts = postsQuery.data?.data ?? [];

  if (posts.length === 0) {
    return <p className="text-sm text-gray-500">記事がありません</p>;
  }

  return (
    <ul className="divide-y divide-gray-200">
      {posts.map((post) => (
        <li key={post.slug} className="py-3">
          <Link href={`/admin/posts/${post.slug}/edit`} className="font-medium text-gray-900 hover:underline">
            {post.title}
          </Link>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
            <span>{new Date(post.created_at).toLocaleDateString("ja-JP")}</span>
            {post.tags.map((tag) => (
              <span key={tag} className="rounded bg-gray-100 px-1.5 py-0.5">
                {tag}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
