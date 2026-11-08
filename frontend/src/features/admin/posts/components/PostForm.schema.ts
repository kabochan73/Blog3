import { z } from "zod";

export const postFormSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください"),
  slug: z
    .string()
    .min(1, "スラッグを入力してください")
    .regex(/^[a-z0-9-]+$/, "半角英数字とハイフンのみ使用できます"),
  status: z.enum(["draft", "published"]),
  tags: z.array(z.string()),
  excerpt: z.string(),
  thumbnail: z.string(),
  content: z.string().min(1, "本文を入力してください"),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

export const EMPTY_POST_FORM_VALUES: PostFormValues = {
  title: "",
  slug: "",
  status: "draft",
  tags: [],
  excerpt: "",
  thumbnail: "",
  content: "",
};
