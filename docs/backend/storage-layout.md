# ファイル保存場所・命名規則（確定）

> **記事ファイルについての記述は廃止されました。** 記事はPostgreSQLの`posts`テーブルで管理する方針に変更。[docs/backend/database-schema.md](./database-schema.md)を参照。画像の保存方針は変更なしで以下のまま有効。

## 画像ファイル

- `ImageUploadService`は`Storage::disk(config('filesystems.default'))`を使う。保存先ディスクは環境変数`FILESYSTEM_DISK`で切り替える（[docs/infra/railway-services.md](../infra/railway-services.md)参照）
  - **ローカル（Docker Compose）**: `FILESYSTEM_DISK=public`。`backend/storage/app/public/images/{filename}`に保存し、`php artisan storage:link`で`public/storage`に公開。APIが返すURLは相対パス`/storage/images/{filename}`
  - **本番（Railway）**: `FILESYSTEM_DISK=s3`。Railwayのbucket（S3互換）に保存し、APIが返すURLはbucketの公開URL（フルURL）
- ファイル名: 衝突防止のため `{uuid}.{拡張子}`（アップロード時の元ファイル名は使わない）
- `posts`テーブルの`thumbnail`カラムには、上記いずれかの形式のURL値をそのまま保存する
