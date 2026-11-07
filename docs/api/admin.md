# API設計（管理用、確定）

すべて認証必須（`Authorization: Bearer {token}`）。

## 記事CRUD（`/api/admin/posts`）

### `GET /api/admin/posts`
- クエリ: `status`（`draft` | `published`, 任意・省略時は全件）, `tag`（任意）, `page`, `per_page`（デフォルト20）
- 下書きも含めて返す

### `GET /api/admin/posts/{slug}`
- 編集画面の初期値取得用。下書きも取得可

### `POST /api/admin/posts`
- body:
```json
{
  "title": "string（必須）",
  "slug": "string（必須。管理者が手入力）",
  "status": "draft | published（必須）",
  "tags": ["string", "..."],
  "thumbnail": "string（任意。画像アップロードAPIで得たURL）",
  "excerpt": "string（任意）",
  "content": "string（必須、Markdown本文）"
}
```
- `tags`は`tags`テーブルに存在する名前のみ許可（存在しない名前は422エラー）。`post_tag`中間テーブルに紐付けを保存
- `slug`は手入力。バリデーション`^[a-z0-9-]+$`、`posts.slug`のunique制約違反は422。詳細は[docs/backend/slug-rule.md](../backend/slug-rule.md)

### `PUT /api/admin/posts/{slug}`
- **完全置換**。`POST`と同じボディを全フィールド必須で送る
- URLパスの`{slug}`は**更新前**の値（対象の特定用）
- bodyの`slug`が変更されていれば同じバリデーション・重複チェックを行い、該当レコードの`slug`カラムを更新するだけ（DBなのでファイル操作は不要）
- `updated_at`を自動更新

### `DELETE /api/admin/posts/{slug}`
- 204を返す

## 画像アップロード（`/api/admin/images`）

### `POST /api/admin/images`
- `multipart/form-data`, フィールド名 `image`
- 制限: 最大**5MB**、形式は **jpg / png / webp** のみ
- アップロード時にリサイズ・圧縮（具体的な最大幅などは実装時に決定）
- レスポンス: `{ "url": "/storage/images/xxx.jpg" }`
- 制限超過・形式エラーは422

## タグCRUD（`/api/admin/tags`）

### `GET /api/admin/tags`
- `[{ "id": 1, "name": "laravel", "count": 12 }, ...]`

### `POST /api/admin/tags`
- body: `{ "name": "string" }`
- 記事への紐付けなしで単独作成可能。名前の重複は422

### `PUT /api/admin/tags/{id}`
- body: `{ "name": "string" }`
- `tags.name`を更新するだけ（`post_tag`側はタグIDで紐付いているため変更不要）

### `DELETE /api/admin/tags/{id}`
- `tags`レコードを削除。`post_tag`の関連行はFKの`on delete cascade`で自動削除
- 204を返す
