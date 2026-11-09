import { PostList } from "@/features/admin/posts/components/PostList";

export default async function AdminPostsPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;

  return (
    <div className="space-y-8">
      <h2 className="font-heading text-4xl font-bold">Public Article</h2>
      <p className="font-light mb-6 pb-4 text-foreground/80">学習記録や日々の学びなどを投稿しています。</p>
      <PostList status="published" tag={tag} />
    </div>
  );
}
