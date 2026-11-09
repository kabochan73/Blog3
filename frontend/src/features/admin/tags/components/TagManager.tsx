"use client";

import { useState } from "react";

import { extractErrorMessage } from "@/shared/lib/api";
import { useTagsAdmin } from "../hooks/useTagsAdmin";
import { TagForm } from "./TagForm";

export function TagManager() {
  const { tagsQuery, createTag, updateTag, deleteTag } = useTagsAdmin();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [createFormKey, setCreateFormKey] = useState(0);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 px-6 py-12">
      <h1 className="font-heading border-b border-foreground pb-4 text-3xl font-bold">タグ管理</h1>

      <TagForm
        key={createFormKey}
        submitLabel="追加"
        isPending={createTag.isPending}
        error={createTag.isError ? extractErrorMessage(createTag.error) : null}
        onSubmit={({ name }) => createTag.mutate(name, { onSuccess: () => setCreateFormKey((k) => k + 1) })}
      />

      {tagsQuery.isLoading && <p className="text-sm text-foreground/50">読み込み中...</p>}
      {tagsQuery.isError && <p className="text-sm text-red-600">タグの取得に失敗しました</p>}

      <ul className="divide-y divide-foreground/20">
        {tagsQuery.data?.map((tag) => (
          <li key={tag.id} className="flex items-center justify-between py-3">
            {editingId === tag.id ? (
              <TagForm
                submitLabel="保存"
                defaultValues={{ name: tag.name }}
                isPending={updateTag.isPending}
                error={updateTag.isError ? extractErrorMessage(updateTag.error) : null}
                onCancel={() => setEditingId(null)}
                onSubmit={({ name }) => updateTag.mutate({ id: tag.id, name }, { onSuccess: () => setEditingId(null) })}
              />
            ) : (
              <>
                <span className="flex items-center gap-3">
                  <span className="font-medium">{tag.name}</span>
                  <span className="rounded-full bg-foreground px-2 py-0.5 text-xs font-medium text-background">
                    {tag.count}
                  </span>
                </span>
                <span className="flex gap-4 text-sm">
                  <button
                    type="button"
                    onClick={() => setEditingId(tag.id)}
                    className="text-foreground/60 hover:text-foreground"
                  >
                    編集
                  </button>
                  <button type="button" onClick={() => deleteTag.mutate(tag.id)} className="text-red-600 hover:text-red-800">
                    削除
                  </button>
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
