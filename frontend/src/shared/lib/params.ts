/**
 * Next.js dynamic route params for dynamically-resolved (non-generateStaticParams) segments
 * can arrive still percent-encoded for multi-byte characters (observed with full-width digits
 * in tag names). Decode defensively so route params and query values always match.
 */
export function decodeRouteParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
