import Link from "next/link";

import { PostList } from "@/features/admin/posts/components/PostList";

export default function AdminPostsPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">公開記事</h1>
        <Link href="/admin/posts/new" className="text-sm text-gray-900 underline">
          新規作成
        </Link>
      </div>
      <PostList status="published" />
    </div>
  );
}
