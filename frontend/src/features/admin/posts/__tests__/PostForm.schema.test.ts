import { describe, expect, it } from "vitest";

import { postFormSchema } from "../components/PostForm.schema";

const validInput = {
  title: "タイトル",
  slug: "example-post",
  status: "published" as const,
  tags: ["laravel"],
  excerpt: "概要",
  thumbnail: "",
  content: "本文",
};

describe("postFormSchema", () => {
  it("accepts a valid post", () => {
    expect(postFormSchema.safeParse(validInput).success).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = postFormSchema.safeParse({ ...validInput, title: "" });

    expect(result.success).toBe(false);
  });

  it("rejects an empty content", () => {
    const result = postFormSchema.safeParse({ ...validInput, content: "" });

    expect(result.success).toBe(false);
  });

  it("rejects a slug with uppercase letters or spaces", () => {
    const result = postFormSchema.safeParse({ ...validInput, slug: "Invalid Slug" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("半角英数字とハイフンのみ使用できます");
    }
  });

  it("accepts a slug with lowercase letters, digits, and hyphens", () => {
    expect(postFormSchema.safeParse({ ...validInput, slug: "post-123" }).success).toBe(true);
  });
});
