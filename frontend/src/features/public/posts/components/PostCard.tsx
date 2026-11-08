import Link from "next/link";

import { resolveImageUrl } from "@/shared/lib/api";
import type { PostListItem } from "../types";

export function PostCard({ post }: { post: PostListItem }) {
  return (
    <article className="flex flex-col gap-3">
      <Link href={`/posts/${post.slug}`} className="flex flex-col gap-3">
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
    </article>
  );
}
