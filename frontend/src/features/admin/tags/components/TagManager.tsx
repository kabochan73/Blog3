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
    <div className="max-w-xl space-y-6">
      <h1 className="text-lg font-semibold">タグ管理</h1>

      <TagForm
        key={createFormKey}
        submitLabel="追加"
        isPending={createTag.isPending}
        error={createTag.isError ? extractErrorMessage(createTag.error) : null}
        onSubmit={({ name }) => createTag.mutate(name, { onSuccess: () => setCreateFormKey((k) => k + 1) })}
      />

      {tagsQuery.isLoading && <p className="text-sm text-gray-500">読み込み中...</p>}
      {tagsQuery.isError && <p className="text-sm text-red-600">タグの取得に失敗しました</p>}

      <ul className="divide-y divide-gray-200">
        {tagsQuery.data?.map((tag) => (
          <li key={tag.id} className="flex items-center justify-between py-2 text-sm">
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
                <span>{tag.name}</span>
                <span className="flex gap-3">
                  <button type="button" onClick={() => setEditingId(tag.id)} className="text-gray-500">
                    編集
                  </button>
                  <button type="button" onClick={() => deleteTag.mutate(tag.id)} className="text-red-600">
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
