"use client";

import { useTagsList } from "../hooks/useTagsList";

type TagPickerProps = {
  value: string[];
  onChange: (tags: string[]) => void;
};

export function TagPicker({ value, onChange }: TagPickerProps) {
  const tagsQuery = useTagsList();

  function toggle(name: string) {
    if (value.includes(name)) {
      onChange(value.filter((tag) => tag !== name));
    } else {
      onChange([...value, name]);
    }
  }

  if (tagsQuery.isLoading) {
    return <p className="text-sm text-gray-500">タグを読み込み中...</p>;
  }

  if (tagsQuery.isError) {
    return <p className="text-sm text-red-600">タグの取得に失敗しました</p>;
  }

  const tags = tagsQuery.data ?? [];

  if (tags.length === 0) {
    return <p className="text-sm text-gray-500">タグがありません。先に「タグ管理」から作成してください。</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const selected = value.includes(tag.name);
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggle(tag.name)}
            className={
              selected
                ? "rounded-full bg-gray-900 px-3 py-1 text-sm text-white"
                : "rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-700"
            }
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
}
