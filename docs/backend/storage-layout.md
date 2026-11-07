# ファイル保存場所・命名規則（確定）

> **記事ファイルについての記述は廃止されました。** 記事はPostgreSQLの`posts`テーブルで管理する方針に変更。[docs/backend/database-schema.md](./database-schema.md)を参照。画像の保存方針は変更なしで以下のまま有効。

## 画像ファイル

- 保存場所: `backend/storage/app/public/images/{filename}`
- Laravelの`public`ディスクを使用し、`php artisan storage:link`で`public/storage`に公開
- ファイル名: 衝突防止のため `{uuid}.{拡張子}`（アップロード時の元ファイル名は使わない）
- APIが返す画像URL形式: `/storage/images/{filename}`
- `posts`テーブルの`thumbnail`カラムにはこのURL形式の値を保存する
