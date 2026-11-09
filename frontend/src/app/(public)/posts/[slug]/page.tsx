import { cacheLife } from "next/cache";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MarkdownRenderer } from "@/features/public/posts/components/MarkdownRenderer";
import { TableOfContents } from "@/features/public/posts/components/TableOfContents";
import { extractHeadings } from "@/features/public/posts/markdown";
import type { PaginatedCollection, PostDetail, PostListItem } from "@/features/public/posts/types";
import { ApiError, publicApiFetch, resolveImageUrl } from "@/shared/lib/api";

export const instant = false;

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
    <article className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-4xl font-bold tracking-tight">{post.title}</h1>
        <div className="mt-3 flex items-center gap-3 text-foreground/80">
          <time dateTime={post.created_at} className="text-xl font-light">
            {new Date(post.created_at).toLocaleDateString("ja-JP")}
          </time>
          {post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag} className="rounded-full bg-foreground px-3 pb-0.5 text-sm text-background font-medium">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {post.thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element -- source is the Laravel backend, not optimizable by next/image
        <img
          src={resolveImageUrl(post.thumbnail)}
          alt=""
          className="aspect-[2/1] w-full object-cover"
        />
      ) : (
        <div className="aspect-[2/1] w-full bg-foreground/5" />
      )}
      <TableOfContents headings={extractHeadings(post.content)} />
      <MarkdownRenderer content={post.content} />
      <Link
        href="/"
        className="mt-6 self-end bg-foreground/80 px-6 py-3 font-medium text-background transition-opacity hover:opacity-60"
      >
        Back to Home
      </Link>
    </article>
  );
}
