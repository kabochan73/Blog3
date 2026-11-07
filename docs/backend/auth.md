# 認証設計（確定）

## 方式

Laravel Sanctumのトークン認証（SPA Cookie方式は使わず、Bearerトークン方式）。

## 管理者アカウント

- Laravelの標準`User`モデル・`users`テーブルを使用（PostgreSQL。[docs/backend/database-schema.md](./database-schema.md)参照）
- `database seeder`で1件だけ作成
  - email: `admin@example.com`（実在しないダミー。本人確認用アドレスではなくログインIDとしての役割のみ）
  - password: `.env`の`ADMIN_PASSWORD`から読み込んでハッシュ化
- ユーザー登録機能は作らない（seederのみ）

### パスワードの初期値

- **ローカル開発**: `.env.example`に適当な固定値（例: `password`）を入れておき、そのまま使って良い
- **本番（Railway）**: ローカルの値は使わず、Railwayの環境変数で別の強固なパスワードを設定する（デプロイ時に決定）

## トークン

- 有効期限: **30日**（`config/sanctum.php`の`expiration`を`60 * 24 * 30`分に設定）
- 期限切れ・無効なトークンでAPIを呼んだ場合は401を返す
- フロントエンドは401を受け取ったら`localStorage`のトークンを破棄し`/login`へリダイレクト

## エンドポイント

- `POST /api/login`
  - リクエスト: `{ "email": "admin@example.com", "password": "..." }`
  - レスポンス: `{ "token": "..." }`
  - 失敗時: 422（バリデーションエラー）または401（認証失敗）
- `POST /api/logout`（認証必須）
  - 現在のトークンを削除（failure時401）
  - レスポンス: 204

## サーバー側の防御（本当の防御線）

- `/api/admin/*`配下の全ルートをLaravelの`auth:sanctum`ミドルウェアでラップする（ルーティング定義レベルでガード）
- トークンが無い・無効・期限切れの場合、コントローラーの処理に入る前にミドルウェアが401 Unauthorizedを返す
- フロントエンドの「トークンが無ければ`/login`へリダイレクト」はUX向けの仕組みであり、実際の防御線ではない。フロント側のガードを迂回されても、バックエンドの`auth:sanctum`が未認証リクエストを拒否するため、記事削除などの操作は実行されない

## フロントエンド側の扱い

- ログイン成功時にトークンを`localStorage`へ保存
- `/admin/*`配下のページはクライアント側ガードでトークンの有無をチェックし、無ければ`/login`へリダイレクト
- `/api/admin/*`への全リクエストに`Authorization: Bearer {token}`ヘッダーを付与

## CORS

- Laravel側でフロントエンドのオリジン（開発: `http://localhost:3000`、本番: Vercelの公開ドメイン）を許可（[docs/infra/vercel.md](../infra/vercel.md)参照）
- Cookieを使わないため`supports_credentials`は不要
