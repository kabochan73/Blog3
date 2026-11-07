# 決定事項ログ

決めたことと、まだ決めていないことを記録していく。

## Blog2から引き継ぐ決定（変更なし）

詳細は[Blog2/docs/02-decisions-log.md](../../Blog2/docs/02-decisions-log.md)参照。要点のみ再掲。

| 項目 | 決定内容 |
|---|---|
| バックエンド | Laravel / PHP 8.4 |
| フロントエンド | Next.js 16 / TypeScript |
| 記事データ保存 | PostgreSQLの`posts`テーブル |
| 認証方式 | 1人用シンプルログイン（Laravel Sanctum + PostgreSQL） |
| スタイリング | Tailwind CSS |
| Markdownエディタ | プレビュー付き（@uiw/react-md-editor） |
| Web配信 | Nginx + PHP-FPM |
| 環境構築 | Docker Compose |
| ディレクトリ構成 | 1リポジトリ内に backend/ と frontend/ を分離 |
| デプロイ | frontendはVercel、backend/DB/画像はRailway（Dockerfile） |
| カテゴリ機能 | やらない（タグのみ） |
| 記事ステータス | 公開/下書きの切り替えを持つ |
| 記事プレビュー | 専用機能は作らず、管理画面の記事詳細ページで代替 |
| 管理者アカウント | database seederで投入（username: admin） |
| 機能スコープ | [docs/03-features.md](./03-features.md) |
| タグ管理方式 | タグは紐付く記事がなくても独立して作成・編集・削除できる |
| DB設計 | [docs/backend/database-schema.md](./backend/database-schema.md) |
| 公開/管理API設計 | [docs/api/public.md](./api/public.md)・[docs/api/admin.md](./api/admin.md) |
| 認証設計 | [docs/backend/auth.md](./backend/auth.md) |
| ルーティング設計 | [docs/frontend/routing.md](./frontend/routing.md) |
| スラッグ生成規則 | [docs/backend/slug-rule.md](./backend/slug-rule.md) |
| レンダリング戦略 | 全公開ページをSSG＋オンデマンド再検証（ISR）。[docs/frontend/rendering-strategy.md](./frontend/rendering-strategy.md) |
| ページネーション方式 | パスベース（`/page/[n]`） |
| 管理画面のデータ取得 | TanStack Query |
| フォームライブラリ | react-hook-form + zod（`@hookform/resolvers/zod`） |

## Blog3で新たに決めたこと

| 項目 | 決定内容 |
|---|---|
| テスト方針 | backend: Pest（PHPUnit）で単体・機能テスト。frontend: Vitest + React Testing Libraryで単体テスト。E2E（Playwright等）はやらない。実装と同じコミットでテストを書く。[docs/backend/testing.md](./backend/testing.md)・[docs/frontend/testing.md](./frontend/testing.md) |
| frontendフォルダ構成 | type-base（`components/`/`hooks/`/`lib/`）からfeature-baseへ変更。画面単位（`public`/`admin`）で大きく分け、その配下をドメイン（`posts`/`tags`/`auth`）で分割。[docs/frontend/folder-structure.md](./frontend/folder-structure.md) |
| featureをまたぐ共有コンポーネント | `TagPicker`・`useTagsList`（postsとtags両方から使われる）は`features/admin/tags`に置き、`features/admin/posts`からimportする。データの所有者を明確にするため、`shared/`には逃がさない |
| 型定義の分割 | 共有の`types.ts`は作らない。`features/public/posts`・`features/admin/posts`のように、public/adminそれぞれのfeature配下に独立した`types.ts`を持つ（重複を許容） |
| zodスキーマの分割 | 共有の`schemas.ts`は作らない。フォームごとに専用ファイル（例: `PostForm.tsx`に対し`PostForm.schema.ts`）を隣に置く |
| デザイン | Blog2の「LOGBOOK.」から刷新。オフホワイト基調、記事カードにサムネイル画像・抜粋・全付与タグを表示、サイドバーの「About Me」はテキストのみ（リンクボタンなし）。[docs/frontend/design-reference.md](./frontend/design-reference.md) |
| フォント | 見出し: Playfair Display（英欧文）＋ Noto Serif JP（和文）で統一。本文: Noto Sans JP（可読性重視でゴシックのまま）。[docs/frontend/design-reference.md](./frontend/design-reference.md) |

## 未決定（これから詰める項目）

- 実装ロードマップの詳細（[docs/04-implementation-roadmap.md](./04-implementation-roadmap.md)でBlog2のロードマップにテスト工程を組み込みながら進める）
