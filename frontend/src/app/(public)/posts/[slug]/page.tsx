import { cacheLife } from "next/cache";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MarkdownRenderer } from "@/features/public/posts/components/MarkdownRenderer";
import { TableOfContents } from "@/features/public/posts/components/TableOfContents";
import { extractHeadings } from "@/features/public/posts/markdown";
import type { PaginatedCollection, PostDetail, PostListItem } from "@/features/public/posts/types";
import { ApiError, publicApiFetch, resolveImageUrl } from "@/shared/lib/api";

export async function generateStaticParams() {
  const { data: posts } = await publicApiFetch<PaginatedCollection<PostListItem>>("/api/posts?per_page=9999");

  return posts.map((post) => ({ slug: post.slug }));
}

async function getPost(slug: string): Promise<PostDetail | null> {
  "use cache";
  cacheLife("max");

  try {
    return await publicApiFetch<PostDetail>(`/api/posts/${slug}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    throw err;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {};
  }

  return { title: post.title };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="flex flex-col gap-6">
      {post.thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element -- source is the Laravel backend, not optimizable by next/image
        <img
          src={resolveImageUrl(post.thumbnail)}
          alt=""
          className="aspect-[2/1] w-full rounded-lg object-cover"
        />
      ) : (
        <div className="aspect-[2/1] w-full rounded-lg bg-foreground/5" />
      )}
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-foreground/50">
          <time dateTime={post.created_at}>{new Date(post.created_at).toLocaleDateString("ja-JP")}</time>
          {post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Link href={`/tags/${tag}`} className="hover:underline">
                    #{tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <TableOfContents headings={extractHeadings(post.content)} />
      <MarkdownRenderer content={post.content} />
    </article>
  );
}
