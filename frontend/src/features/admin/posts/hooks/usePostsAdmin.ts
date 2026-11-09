import { useQuery } from "@tanstack/react-query";

import { adminApiFetch } from "@/shared/lib/api";
import type { Post, PostStatus } from "../types";

export function usePostsAdmin(status: PostStatus, tag?: string) {
  return useQuery({
    queryKey: ["posts", status, tag],
    queryFn: () => {
      const query = new URLSearchParams({ status });
      if (tag) {
        query.set("tag", tag);
      }
      return adminApiFetch<{ data: Post[] }>(`/api/admin/posts?${query}`);
    },
  });
}
