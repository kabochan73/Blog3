import { QueryClient } from "@tanstack/react-query";

/** staleTime/gcTime left at their defaults (staleTime: 0) — see docs/frontend/component-types.md. */
export function createQueryClient(): QueryClient {
  return new QueryClient();
}
