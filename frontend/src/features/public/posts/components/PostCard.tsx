import Link from "next/link";

import { resolveImageUrl } from "@/shared/lib/api";
import type { PostListItem } from "../types";

export function PostCard({ post }: { post: PostListItem }) {
  return (
    <article className="flex gap-5">
      <Link href={`/posts/${post.slug}`} className="shrink-0">
        {post.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element -- source is the Laravel backend, not optimizable by next/image
          <img
            src={resolveImageUrl(post.thumbnail)}
            alt=""
            className="aspect-square w-28 rounded-lg object-cover sm:w-36"
          />
        ) : (
          <div className="aspect-square w-28 rounded-lg bg-foreground/5 sm:w-36" />
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Link href={`/posts/${post.slug}`}>
          <h2 className="font-heading text-xl font-semibold tracking-tight">{post.title}</h2>
        </Link>
        {post.excerpt && <p className="text-foreground/70">{post.excerpt}</p>}
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
    </article>
  );
}
