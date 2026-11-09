import { cacheLife } from "next/cache";

import { publicApiFetch } from "@/shared/lib/api";
import type { PublicTag } from "../types";
import { TagListClient } from "./TagListClient";

export async function TagList() {
  "use cache";
  cacheLife("max");

  const tags = await publicApiFetch<PublicTag[]>("/api/tags");

  if (tags.length === 0) {
    return null;
  }

  return <TagListClient tags={tags} />;
}
