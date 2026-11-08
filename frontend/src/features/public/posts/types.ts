export type PostListItem = {
  slug: string;
  title: string;
  excerpt: string | null;
  thumbnail: string | null;
  tags: string[];
  created_at: string;
};

export type PostDetail = {
  slug: string;
  title: string;
  content: string;
  thumbnail: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type PaginationMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

export type PaginatedCollection<T> = {
  data: T[];
  meta: PaginationMeta;
};
