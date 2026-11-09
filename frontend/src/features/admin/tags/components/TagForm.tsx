"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { tagFormSchema, type TagFormValues } from "./TagForm.schema";

type TagFormProps = {
  defaultValues?: TagFormValues;
  onSubmit: (values: TagFormValues) => void;
  onCancel?: () => void;
  isPending?: boolean;
  error?: string | null;
  submitLabel: string;
};

export function TagForm({ defaultValues, onSubmit, onCancel, isPending, error, submitLabel }: TagFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TagFormValues>({ defaultValues, resolver: zodResolver(tagFormSchema) });

  function handleFormSubmit(values: TagFormValues) {
    onSubmit({ name: values.name.trim() });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-1 items-center gap-3">
      <input
        type="text"
        aria-label="タグ名"
        {...register("name")}
        className="flex-1 border border-foreground/40 bg-transparent px-3 py-2 text-sm focus:border-foreground focus:outline-none"
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-60 disabled:opacity-50"
      >
        {submitLabel}
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel} className="text-sm text-foreground/60 hover:text-foreground">
          キャンセル
        </button>
      )}
      {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  );
}
