# Vercel（frontend、確定）

frontend（Next.js）のみVercelにデプロイする。backend・PostgreSQL・bucketはRailwayのまま（[docs/infra/railway-services.md](./railway-services.md)）。

## 理由

- 公開ページを全ページSSG＋オンデマンド再検証（ISR）にする方針（[docs/frontend/rendering-strategy.md](../frontend/rendering-strategy.md)）のため、Vercelのエッジキャッシュ基盤を活かす
- Next.js本体の開発元であるVercelは、Next.js専用のビルド・デプロイ基盤を持ち、Dockerfileなどのインフラ構成が不要

## デプロイ方式

- Gitリポジトリ連携（push時に自動ビルド・デプロイ）。frontend用のDockerfile・Nginxは不要（Railway向けに用意していたものは使わない）
- モノレポ内の`frontend/`ディレクトリをVercelのプロジェクトルートとして設定する

## 環境変数（Vercel側）

| 変数名 | 用途 |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Laravel公開APIのベースURL（RailwayのbackendサービスURL） |
| `REVALIDATE_SECRET` | オンデマンド再検証Webhookの認証シークレット。Railway側の値と一致させる |

## backendとの通信

- 公開ページのSSG/ISR時のfetchは、VercelのサーバーからRailwayのbackend（Laravel）へインターネット経由でHTTPリクエストする
- オンデマンド再検証のWebhookは逆方向（Railway→Vercel）。[docs/frontend/rendering-strategy.md](../frontend/rendering-strategy.md)参照
- CORSの許可オリジンとして、Laravel側にVercelの公開ドメインを設定する（[docs/backend/auth.md](../backend/auth.md)参照）
