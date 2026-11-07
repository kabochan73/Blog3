# テスト方針（frontend、確定）

実装と同じコミットでテストを書く（[docs/04-implementation-roadmap.md](../04-implementation-roadmap.md)の各ステップにテストを含める）。E2E（Playwright等）はやらない。

## ツール

- Vitest（テストランナー）
- React Testing Library（コンポーネントのレンダリング・操作）

## テストの配置

feature-base構成（[docs/frontend/folder-structure.md](./folder-structure.md)）に合わせ、各featureの`__tests__/`配下にそのfeatureのテストを置く（テスト対象と同じfeatureディレクトリ内で完結させる）。

```
features/admin/posts/
├── components/
│   ├── PostForm.tsx
│   └── PostForm.schema.ts
├── hooks/
│   └── usePostEditor.ts
└── __tests__/
    ├── PostForm.test.tsx
    ├── PostForm.schema.test.ts
    └── usePostEditor.test.ts
```

## 範囲

- **公開ページのコンポーネント**（Server Component）: `PostCard`・`Pagination`・`TagList`・`MarkdownRenderer`・`TableOfContents`など、propsを与えたときの表示内容を検証
- **管理画面のコンポーネント**（Client Component）: `PostForm`・`TagPicker`・`ImageUploader`などのフォーム操作・バリデーションエラー表示
- **zodスキーマ**: `PostForm.schema.ts`などバリデーションルール単体
- **カスタムフック**: `usePostsAdmin`・`useCreatePost`・`usePostEditor`・`useTagsAdmin`・`useTagsList`など、TanStack Queryを使うフックの挙動（モックしたAPIクライアントに対して）

## ファイル命名

`*.test.ts` / `*.test.tsx`で統一する（`.spec.ts`は使わない）。

## 未決定（実装時に詰める）

- API呼び出し（`shared/lib/api.ts`）のモック方法（MSW or 手動モック）
- TanStack Queryのテスト用セットアップ（`QueryClientProvider`のラッパー）
- `localStorage`（認証トークン）のテスト時の扱い
