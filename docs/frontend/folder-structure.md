# フロントエンドのフォルダ構成（確定）

Next.js 16 / App Router / TypeScript。決定済みのルーティング（[docs/frontend/routing.md](./routing.md)）に対応させている。

Blog2はtype-base構成（`components/`/`hooks/`/`lib/`で分割）だったが、Blog3ではfeature-base構成に変更する。画面（`public`/`admin`）を最初に分け、その配下をドメイン（`posts`/`tags`/`auth`）で分割する。

```
frontend/
├── src/
│   ├── app/                                # ルーティング専用。page.tsx/layout.tsx/sitemap.tsなどNext.jsの規約ファイルのみ
│   │   ├── layout.tsx                      # ルートレイアウト（html/body、フォント読み込み）
│   │   ├── globals.css
│   │   ├── login/
│   │   │   └── page.tsx                    # /login（admin配下とは独立）
│   │   ├── (public)/                       # ルートグループ。URLには影響しない整理用フォルダ
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    # "/" 記事一覧1ページ目
│   │   │   ├── page/[n]/page.tsx
│   │   │   ├── posts/[slug]/page.tsx
│   │   │   ├── tags/[tag]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── page/[n]/page.tsx
│   │   │   └── sitemap.ts
│   │   └── admin/
│   │       ├── layout.tsx                  # ルーティング専用のServer Component。instant=falseでCache Components検証を除外
│   │       ├── (articles)/
│   │       │   ├── posts/
│   │       │   │   ├── page.tsx
│   │       │   │   ├── new/page.tsx
│   │       │   │   └── [slug]/edit/page.tsx
│   │       │   └── drafts/page.tsx
│   │       └── tags/page.tsx
│   ├── features/
│   │   ├── public/
│   │   │   ├── posts/
│   │   │   │   ├── components/             # PostCard, Pagination, MarkdownRenderer, TableOfContents
│   │   │   │   ├── types.ts                # 公開APIのPost型（adminとは別定義）
│   │   │   │   └── __tests__/
│   │   │   └── tags/
│   │   │       ├── components/             # TagList（prefetch付き）
│   │   │       ├── types.ts
│   │   │       └── __tests__/
│   │   └── admin/
│   │       ├── posts/
│   │       │   ├── components/             # PostForm（+PostForm.schema.ts）, ImageUploader
│   │       │   ├── hooks/                  # usePostsAdmin, useCreatePost, usePostEditor
│   │       │   ├── types.ts                # 管理APIのPost型
│   │       │   └── __tests__/
│   │       ├── tags/
│   │       │   ├── components/             # タグ管理画面UI（+TagForm.schema.ts）, TagPicker
│   │       │   ├── hooks/                  # useTagsAdmin, useTagsList
│   │       │   ├── types.ts                # 管理APIのTag型
│   │       │   └── __tests__/
│   │       └── auth/
│   │           ├── components/             # AdminShell, AdminHeader, LoginForm（+LoginForm.schema.ts）
│   │           ├── hooks/
│   │           └── __tests__/
│   └── shared/
│       └── lib/
│           ├── api.ts                      # 公開APIと管理APIのfetchラッパー
│           ├── auth.ts                     # トークンのlocalStorage読み書き
│           └── pagination.ts               # 総ページ数の算出（generateStaticParams共通ロジック）
├── public/
├── vitest.config.ts
├── next.config.ts
└── package.json
```

## feature分割の方針

- 画面（`public`/`admin`）を最初に分け、その配下をドメイン（`posts`/`tags`、`admin`のみ`auth`も追加）でさらに分割する
- 各featureディレクトリは`components/`（必要なら`hooks/`）・`types.ts`・`__tests__/`を持つ。featureをまたいだ共有は原則しない
- **複数featureから使われるコンポーネント**: `TagPicker`（記事フォームのタグ複数選択UI）と`useTagsList`（タグ一覧取得フック）は`admin/posts`・`admin/tags`の両方から使われる。データの所有者を明確にするため`features/admin/tags`に置き、`features/admin/posts`からimportする。`shared/`には逃がさない
- **型定義**: 共有の`types.ts`は作らない。`features/public/posts/types.ts`と`features/admin/posts/types.ts`のように、public/adminそれぞれのfeature配下に独立した型を持つ（Post/TagのAPI型はほぼ同じ形だが、重複を許容してfeatureの独立性を優先する）
- **zodスキーマ**: 共有の`schemas.ts`は作らない。`PostForm.tsx`に対して`PostForm.schema.ts`のように、フォームコンポーネントごとに専用ファイルを隣に置く
- `shared/lib/`には、本当に全feature共通のもの（APIクライアント、認証トークンの読み書き、ページネーション計算）だけを置く

## ポイント（Blog2から変更なし）

- `/login`は`/admin`配下に置かない。`admin/layout.tsx`は「配下は全部認証必須」という単純なルールだけでガードできるようにし、例外分岐を作らない
- 公開ページ（`/`, `/posts/[slug]`, `/tags/[tag]`, `/sitemap.xml`）は`(public)`ルートグループでまとめる
- 公開ページはServer Componentから直接Laravelの公開APIをfetch（SEO・サイトマップに有利）
- ページ送りはクエリパラメータではなくパスベース（`page/[n]`）
- frontendはVercelにデプロイするため、Dockerfile・Nginx設定は不要（[docs/infra/vercel.md](../infra/vercel.md)参照）
- 管理画面はClient Component中心。`localStorage`のトークンを使って管理APIを直接fetch（[docs/backend/auth.md](../backend/auth.md)の方針どおり）
- `middleware.ts`は作らない。認証チェックは`AdminShell.tsx`内のクライアント側ガードのみで行う（本当の防御線はバックエンドの`auth:sanctum`）
- `admin/layout.tsx`はルーティング専用のServer Component（`export const instant = false`）とし、実際のガード・Providers・ヘッダー描画は`features/admin/auth/components/AdminShell.tsx`（Client Component）に分離する
- `app/`配下にはNext.jsのルーティング用ファイルだけを置く。ロジックは`features/`配下に分離する
