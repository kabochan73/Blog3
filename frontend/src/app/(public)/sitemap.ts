import type { MetadataRoute } from "next";

import type { PaginatedCollection, PostListItem } from "@/features/public/posts/types";
import type { PublicTag } from "@/features/public/tags/types";
import { publicApiFetch } from "@/shared/lib/api";
import { pageHref } from "@/shared/lib/pagination";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: posts, meta }, tags] = await Promise.all([
    publicApiFetch<PaginatedCollection<PostListItem>>("/api/posts?per_page=9999"),
    publicApiFetch<PublicTag[]>("/api/tags"),
  ]);

  const entries: MetadataRoute.Sitemap = [{ url: SITE_URL }];

  for (let page = 2; page <= meta.last_page; page++) {
    entries.push({ url: `${SITE_URL}${pageHref(page)}` });
  }

  for (const post of posts) {
    entries.push({ url: `${SITE_URL}/posts/${post.slug}`, lastModified: post.created_at });
  }

  for (const tag of tags) {
    const { meta: tagMeta } = await publicApiFetch<PaginatedCollection<PostListItem>>(
      `/api/posts?tag=${encodeURIComponent(tag.name)}`,
    );

    entries.push({ url: `${SITE_URL}/tags/${tag.name}` });
    for (let page = 2; page <= tagMeta.last_page; page++) {
      entries.push({ url: `${SITE_URL}${pageHref(page, tag.name)}` });
    }
  }

  return entries;
}
