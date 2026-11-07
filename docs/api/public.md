# API設計（公開側、確定）

認証不要。公開記事（`status: published`）のみを対象とする。

## `GET /api/posts` — 記事一覧

- クエリパラメータ
  - `tag`（任意）: タグ名で絞り込み
  - `page`（任意, デフォルト1）
  - `per_page`（任意, デフォルト**20**）
- レスポンス例
```json
{
  "data": [
    {
      "slug": "example-post",
      "title": "記事タイトル",
      "excerpt": "概要文",
      "thumbnail": "/storage/images/xxx.jpg",
      "tags": ["laravel"],
      "created_at": "2026-11-06T10:00:00+09:00"
    }
  ],
  "meta": { "current_page": 1, "per_page": 20, "total": 42, "last_page": 3 }
}
```

## `GET /api/posts/{slug}` — 記事詳細

- `status: published` のみ対象（下書きは404）
- レスポンス例
```json
{
  "slug": "example-post",
  "title": "記事タイトル",
  "content": "本文のMarkdown文字列",
  "tags": ["laravel"],
  "thumbnail": "/storage/images/xxx.jpg",
  "created_at": "2026-11-06T10:00:00+09:00",
  "updated_at": "2026-11-06T12:00:00+09:00"
}
```

## `GET /api/tags` — タグ一覧

- タグマスタに**作成済みの全タグ**を返す（公開記事に紐づいていない0件のタグも含む）
- レスポンス例
```json
[
  { "name": "laravel", "count": 12 },
  { "name": "nextjs", "count": 8 },
  { "name": "docker", "count": 0 }
]
```
