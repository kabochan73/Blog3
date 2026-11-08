export type PostStatus = "draft" | "published";

export type Post = {
  id: number;
  title: string;
  slug: string;
  status: PostStatus;
  excerpt: string | null;
  content: string;
  thumbnail: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
};
