import { describe, expect, it } from "vitest";

import { tagFormSchema } from "../components/TagForm.schema";

describe("tagFormSchema", () => {
  it("accepts a non-empty name", () => {
    const result = tagFormSchema.safeParse({ name: "laravel" });

    expect(result.success).toBe(true);
  });

  it("rejects an empty name", () => {
    const result = tagFormSchema.safeParse({ name: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("タグ名を入力してください");
    }
  });
});
