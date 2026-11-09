import Link from "next/link";

import { resolveImageUrl } from "@/shared/lib/api";
import type { PostListItem } from "../types";

export function PostCard({ post }: { post: PostListItem }) {
  return (
    <article className="relative flex gap-6 border-b border-foreground pb-6 transition-opacity hover:opacity-60">
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
          <Link href={`/posts/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h2>
        {post.excerpt && <p className="text-foreground/80 text-xl font-light pb-4">{post.excerpt}</p>}
        <div className="mt-3 flex items-center gap-3 text-sm text-foreground">
          <time dateTime={post.created_at}>{new Date(post.created_at).toLocaleDateString("ja-JP")}</time>
          {post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag} className="rounded-full bg-foreground px-3 py-1 text-background font-medium">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
