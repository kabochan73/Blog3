import { z } from "zod";

export const tagFormSchema = z.object({
  name: z.string().min(1, "タグ名を入力してください"),
});

export type TagFormValues = z.infer<typeof tagFormSchema>;
