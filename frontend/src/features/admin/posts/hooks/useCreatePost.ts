import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { adminApiFetch } from "@/shared/lib/api";
import type { PostFormValues } from "../components/PostForm.schema";
import type { Post } from "../types";

export function useCreatePost() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (values: PostFormValues) =>
      adminApiFetch<Post>("/api/admin/posts", {
        method: "POST",
        body: values,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/admin/posts");
    },
  });
}
