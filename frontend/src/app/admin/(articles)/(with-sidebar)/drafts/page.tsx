import { PostList } from "@/features/admin/posts/components/PostList";

export default async function AdminDraftsPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;

  return (
    <div className="space-y-8">
      <h1 className="font-heading border-b border-foreground pb-4 text-3xl font-bold">下書き</h1>
      <PostList status="draft" tag={tag} />
    </div>
  );
}
