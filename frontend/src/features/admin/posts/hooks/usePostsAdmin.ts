import { useQuery } from "@tanstack/react-query";

import { adminApiFetch } from "@/shared/lib/api";
import type { Post, PostStatus } from "../types";

export function usePostsAdmin(status: PostStatus) {
  return useQuery({
    queryKey: ["posts", status],
    queryFn: () => adminApiFetch<{ data: Post[] }>(`/api/admin/posts?status=${status}`),
  });
}
