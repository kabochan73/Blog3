"use client";

import { type ChangeEvent, useId, useState } from "react";

import { adminUploadFile, extractErrorMessage } from "@/shared/lib/api";
import type { ImageUploadResponse } from "../types";

type ImageUploaderProps = {
  onUploaded: (url: string) => void;
  label?: string;
};

export function ImageUploader({ onUploaded, label = "画像を選択" }: ImageUploaderProps) {
  const inputId = useId();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const { url } = await adminUploadFile<ImageUploadResponse>("/api/admin/images", file);
      onUploaded(url);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div>
      <label htmlFor={inputId} className="inline-block cursor-pointer text-sm text-foreground underline hover:text-foreground/60">
        {isUploading ? "アップロード中..." : label}
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        disabled={isUploading}
        className="hidden"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
