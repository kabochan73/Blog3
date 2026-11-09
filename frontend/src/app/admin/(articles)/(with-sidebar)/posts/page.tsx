import { PostList } from "@/features/admin/posts/components/PostList";

export default function AdminPostsPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-heading border-b border-foreground pb-4 text-3xl font-bold">公開記事</h1>
      <PostList status="published" />
    </div>
  );
}
