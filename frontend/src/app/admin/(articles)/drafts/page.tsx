import { PostList } from "@/features/admin/posts/components/PostList";

export default function AdminDraftsPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-lg font-semibold">下書き</h1>
      <PostList status="draft" />
    </div>
  );
}
