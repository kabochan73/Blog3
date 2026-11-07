# Railwayサービス構成（確定）

frontendはVercelへ移行した（[docs/infra/vercel.md](./vercel.md)参照）。Railwayはbackend・DB・画像ストレージのみを担当する。

## サービス一覧

| サービス | 役割 | 永続化 |
|---|---|---|
| **backend** | Laravel（Nginx + PHP-FPM） | ステートレス。DBはpostgresサービス側で永続化されるためVolume不要 |
| **postgres** | RailwayのマネージドPostgreSQL | `posts` / `tags` / `post_tag` / `users` / `personal_access_tokens`（[docs/backend/database-schema.md](../backend/database-schema.md)） |
| **bucket** | Railwayのオブジェクトストレージ（S3互換） | アップロードした画像のみを保存 |

## 画像だけbucketに出す理由

- 画像はbucketの公開URLから直接配信できるため、backendのNginxを経由せず済み、負荷が減る
- 記事データはPostgreSQLで管理するため、ファイルシステムの永続化（Volume）はDB化によって不要になった

## 環境差分

- **ローカル（Docker Compose）**: `postgres`コンテナを追加。画像はLaravelのローカル`public`ディスクに保存（[docs/backend/storage-layout.md](../backend/storage-layout.md)のまま）
- **本番（Railway）**: DB接続先をRailwayのマネージドPostgresに向ける。画像の保存先をS3互換のbucketディスクに切り替える（Laravelの`FILESYSTEM_DISK`を環境ごとに変える）
- `POST /api/admin/images`のレスポンス形式`{ "url": "..." }`は変わらない。値がローカルでは相対パス、本番ではbucketの公開URLになるだけ

## frontendとの通信

- CORSの許可オリジンはVercelの公開ドメインにする（[docs/backend/auth.md](../backend/auth.md)参照）
- オンデマンド再検証のWebhookは、backend（Railway）からVercelの公開URLへインターネット経由でHTTP呼び出しする（[docs/frontend/rendering-strategy.md](../frontend/rendering-strategy.md)参照）
