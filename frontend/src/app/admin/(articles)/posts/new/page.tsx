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
    <div className="mx-auto w-full max-w-5xl space-y-8 px-6 py-12">
      <h1 className="font-heading border-b border-foreground pb-4 text-3xl font-bold">記事の新規作成</h1>
      <PostForm
        submitLabel="作成"
        onSubmit={handleSubmit}
        isSubmitting={createPost.isPending}
        error={createPost.isError ? extractErrorMessage(createPost.error) : null}
      />
    </div>
  );
}
