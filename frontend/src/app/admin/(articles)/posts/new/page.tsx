"use client";

import { PostForm } from "@/features/admin/posts/components/PostForm";
import type { PostFormValues } from "@/features/admin/posts/components/PostForm.schema";
import { useCreatePost } from "@/features/admin/posts/hooks/useCreatePost";
import { extractErrorMessage } from "@/shared/lib/api";

export default function NewPostPage() {
  const createPost = useCreatePost();

  function handleSubmit(values: PostFormValues) {
    createPost.mutate(values);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">記事の新規作成</h1>
      <PostForm
        submitLabel="作成"
        onSubmit={handleSubmit}
        isSubmitting={createPost.isPending}
        error={createPost.isError ? extractErrorMessage(createPost.error) : null}
      />
    </div>
  );
}
