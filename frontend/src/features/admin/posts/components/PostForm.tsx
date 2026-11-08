"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { Controller, useForm, useWatch } from "react-hook-form";

import { TagPicker } from "@/features/admin/tags/components/TagPicker";
import { API_BASE_URL } from "@/shared/lib/api";
import { ImageUploader } from "./ImageUploader";
import { EMPTY_POST_FORM_VALUES, postFormSchema, type PostFormValues } from "./PostForm.schema";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

function normalizeSlug(raw: string): string {
  return raw.toLowerCase().replace(/[\s_]+/g, "-");
}

type PostFormProps = {
  initialValues?: PostFormValues;
  submitLabel: string;
  onSubmit: (values: PostFormValues) => void;
  isSubmitting?: boolean;
  error?: string | null;
};

export function PostForm({ initialValues, submitLabel, onSubmit, isSubmitting, error }: PostFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<PostFormValues>({
    defaultValues: initialValues ?? EMPTY_POST_FORM_VALUES,
    resolver: zodResolver(postFormSchema),
  });

  const thumbnail = useWatch({ control, name: "thumbnail" });

  function handleThumbnailUploaded(url: string) {
    setValue("thumbnail", url, { shouldValidate: true });
  }

  function handleContentImageUploaded(url: string) {
    const current = getValues("content");
    setValue("content", `${current}\n\n![](${url})\n`, { shouldValidate: true });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-5">
      <div className="space-y-1">
        <label htmlFor="title" className="block text-sm font-medium">
          タイトル
        </label>
        <input
          id="title"
          type="text"
          {...register("title")}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
        {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="slug" className="block text-sm font-medium">
          スラッグ
        </label>
        <input
          id="slug"
          type="text"
          {...register("slug")}
          onChange={(event) => setValue("slug", normalizeSlug(event.target.value), { shouldValidate: true })}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
        {errors.slug && <p className="text-xs text-red-600">{errors.slug.message}</p>}
      </div>

      <div className="space-y-1">
        <span className="block text-sm font-medium">ステータス</span>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input type="radio" value="draft" {...register("status")} />
            下書き
          </label>
          <label className="flex items-center gap-1.5">
            <input type="radio" value="published" {...register("status")} />
            公開
          </label>
        </div>
      </div>

      <div className="space-y-1">
        <span className="block text-sm font-medium">タグ</span>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => <TagPicker value={field.value} onChange={field.onChange} />}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="thumbnail" className="block text-sm font-medium">
          サムネイル画像URL（任意）
        </label>
        <div className="flex items-center gap-3">
          <input
            id="thumbnail"
            type="text"
            {...register("thumbnail")}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
          <ImageUploader onUploaded={handleThumbnailUploaded} label="アップロード" />
        </div>
        {thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element -- admin-only preview, not the public blog
          <img
            src={thumbnail.startsWith("/") ? `${API_BASE_URL}${thumbnail}` : thumbnail}
            alt="サムネイルプレビュー"
            className="mt-2 h-32 w-auto rounded border border-gray-200"
          />
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="excerpt" className="block text-sm font-medium">
          概要（任意）
        </label>
        <textarea
          id="excerpt"
          rows={2}
          {...register("excerpt")}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1" data-color-mode="light">
        <div className="flex items-center justify-between">
          <span className="block text-sm font-medium">本文</span>
          <ImageUploader onUploaded={handleContentImageUploaded} label="本文に画像を挿入" />
        </div>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={(value) => field.onChange(value ?? "")} height={400} />
          )}
        />
        {errors.content && <p className="text-xs text-red-600">{errors.content.message}</p>}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {submitLabel}
      </button>
    </form>
  );
}
