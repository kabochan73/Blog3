"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useTagsList } from "../hooks/useTagsList";

export function AdminTagList() {
  const { data: tags } = useTagsList();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get("tag");

  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <nav className="flex flex-col gap-1 text-base">
      {tags.map((tag) => {
        const isActive = currentTag === tag.name;

        return (
          <Link
            key={tag.name}
            href={isActive ? "/admin/posts" : `/admin/posts?tag=${tag.name}`}
            className={
              isActive
                ? "border-b border-foreground/40 bg-foreground/80 py-1 pl-2 font-medium text-background"
                : "border-b border-foreground/40 py-1 pl-2 text-foreground hover:text-foreground/60"
            }
          >
            {tag.name}
          </Link>
        );
      })}
    </nav>
  );
}
