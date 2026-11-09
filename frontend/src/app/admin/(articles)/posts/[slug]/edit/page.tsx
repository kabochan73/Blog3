import { Suspense } from "react";

import { EditPostClient } from "@/features/admin/posts/components/EditPostClient";

export const instant = false;

export default function EditPostPage() {
  return (
    <Suspense fallback={<p className="text-sm text-foreground/50">読み込み中...</p>}>
      <EditPostClient />
    </Suspense>
  );
}
