export const POSTS_PER_PAGE = 20;

/**
 * URL for a given 1-based page number.
 * Page 1 lives at `/` (or `/tags/[tag]`), not `/page/1` (or `/tags/[tag]/page/1`).
 */
export function pageHref(page: number, tag?: string): string {
  if (tag) {
    return page <= 1 ? `/tags/${tag}` : `/tags/${tag}/page/${page}`;
  }
  return page <= 1 ? "/" : `/page/${page}`;
}
