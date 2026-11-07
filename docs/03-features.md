# 機能スコープ（確定版）

[Blog2](../../Blog2/docs/03-features.md)から変更なし。

## 公開ページ

- [ ] 記事一覧ページ
- [ ] 記事詳細ページ
- [ ] タグ別一覧（タグ検索）
- [ ] ページネーション
- [ ] 目次（TOC）自動生成
- [ ] サイトマップ

**やらない**: カテゴリ分け、キーワード検索、関連記事表示、シェアボタン、ダークモード、コメント、いいね、RSSフィード

## 管理画面

- [ ] ログイン/ログアウト（Sanctum、1人用）
- [ ] 記事一覧ページ
- [ ] 記事詳細ページ（＝プレビューを兼ねる。別途プレビュー機能は作らない）
- [ ] 記事作成
- [ ] 記事編集
- [ ] 記事削除
- [ ] タグでの絞り込み（検索）
- [ ] 下書き／公開の切り替え
- [ ] 画像アップロード（本文用）
- [ ] サムネイル画像の設定
- [ ] タグのCRUD（作成・編集・削除）と記事への付与
- [ ] 画像の最適化（アップロード時にリサイズ/圧縮）

**やらない**: カテゴリ管理

## 管理者アカウント

- Laravelのdatabase seederで初期管理者を投入（username: `admin`）
- パスワード等の詳細は別途決定

## デプロイ

- 今回のスコープに含める
- frontend: Vercel、backend/DB/画像: Railway（[docs/infra/vercel.md](./infra/vercel.md)・[docs/infra/railway-services.md](./infra/railway-services.md)）

## テスト（Blog2からの追加）

- [ ] backend: 単体・機能テスト（Pest）
- [ ] frontend: 単体テスト（Vitest + React Testing Library）
- E2Eテストはやらない

詳細は[docs/backend/testing.md](./backend/testing.md)・[docs/frontend/testing.md](./frontend/testing.md)参照。
