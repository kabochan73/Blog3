import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { adminApiFetch } from "@/shared/lib/api";
import type { PostFormValues } from "../components/PostForm.schema";
import type { Post } from "../types";

export function usePostEditor(slug: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const postQuery = useQuery({
    queryKey: ["posts", "detail", slug],
    queryFn: () => adminApiFetch<Post>(`/api/admin/posts/${slug}`),
  });

  const updatePost = useMutation({
    mutationFn: (values: PostFormValues) =>
      adminApiFetch<Post>(`/api/admin/posts/${slug}`, {
        method: "PUT",
        body: values,
      }),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (post.slug !== slug) {
        router.replace(`/admin/posts/${post.slug}/edit`);
      }
    },
  });

  const deletePost = useMutation({
    mutationFn: () => adminApiFetch<void>(`/api/admin/posts/${slug}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/admin/posts");
    },
  });

  return { postQuery, updatePost, deletePost };
}
