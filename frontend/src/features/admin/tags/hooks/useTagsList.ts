import { useQuery } from "@tanstack/react-query";

import { adminApiFetch } from "@/shared/lib/api";
import type { Tag } from "../types";

export function useTagsList() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => adminApiFetch<Tag[]>("/api/admin/tags"),
  });
}
