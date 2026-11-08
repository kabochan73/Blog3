# 実装ロードマップ

機能ごとの縦切り（1機能をbackend→frontendまで一気通貫で作って、都度ローカルで動作確認する）で進める。デプロイはせず、ローカルのDocker Composeで動作確認する。コミットは機能単位、目安5ファイル前後。

[Blog2のロードマップ](../../Blog2/docs/04-implementation-roadmap.md)をベースに、各ステップへテストを組み込み、frontendのファイルパスをfeature-base構成（[docs/frontend/folder-structure.md](./frontend/folder-structure.md)）に更新している。テスト方針の詳細は[docs/backend/testing.md](./backend/testing.md)・[docs/frontend/testing.md](./frontend/testing.md)参照。

進捗はこのファイルのチェックボックスで管理する。

## コミット規約

- コミットは機能単位、目安5ファイル前後。実装したら同じコミットでテストも書く
- **ロードマップのステップ単位で、1ステップ実装したらすぐコミットする。** 複数ステップをまとめて実装してから後でコミットを分割する、という進め方はしない
- **コミットする前に必ず変更内容をユーザーに提示し、確認を得てからコミットする。** 確認を待たずに実行しない
- **ロードマップのチェックボックス更新は、そのステップの実装コミットに含める。** 別コミットに分けない
- **フェーズ1（土台）の環境構築関連コミットは、このファイル数の目安を当てはめない**（Docker構成などは性質上まとまった変更になるため）
- コミットメッセージ: 1行目に日本語の題名、その下に箇条書きで補足
  ```
  記事の作成・編集フォームを追加

  - react-hook-form + zodでバリデーション
  - PostForm.tsx / PostForm.schema.ts
  - PostForm.test.tsx / PostForm.schema.test.ts
  ```

## フェーズ1: 土台

- [x] 1. Laravel初期化（scaffold一式。Pestインストール含む）
- [x] 2. Next.js初期化（scaffold一式。Vitest + React Testing Libraryセットアップ含む）
- [x] 3. Docker構成（`docker-compose.yml`, `backend/Dockerfile`, `backend/docker/nginx.conf`, `.env.example`×2）

## フェーズ2: 認証

**backend**
- [x] 4. DB＋User: `personal_access_tokens`マイグレーション, `User.php`（HasApiTokens）, `config/sanctum.php`
- [x] 5. 管理者seed: `AdminUserSeeder.php`, `DatabaseSeeder.php`, `.env.example`更新
- [x] 6. ログインAPI: `Api/AuthController.php`, `LoginRequest.php`, `routes/api.php`追加, `config/cors.php` ＋ `tests/Feature/Api/AuthControllerTest.php`

**frontend**
- [x] 7. APIクライアント基盤: `shared/lib/api.ts`, `.env.local.example`（ドメイン型は各featureに持たせる方針のため、共有の`types.ts`は作らない）
- [x] 8. ログイン画面: `shared/lib/auth.ts`, `features/admin/auth/types.ts`, `features/admin/auth/components/LoginForm.tsx`＋`LoginForm.schema.ts`, `app/login/page.tsx` ＋ `features/admin/auth/__tests__/LoginForm.test.tsx`
- [x] 9. 管理画面ガード: `app/admin/layout.tsx`, `features/admin/auth/components/AdminShell.tsx`, `features/admin/auth/components/AdminHeader.tsx` ＋ `features/admin/auth/__tests__/AdminShell.test.tsx`

## フェーズ3: タグ管理

**backend**
- [x] 10. DB: `tags`マイグレーション, `Tag.php`
- [x] 11. 管理タグAPI: `Admin/TagController.php`, `StoreTagRequest.php`, `UpdateTagRequest.php`, `TagAdminResource.php`, routes追加 ＋ `tests/Feature/Api/Admin/TagControllerTest.php`（`count`フィールドは記事との紐付けがまだ無いためステップ14以降で追加）

**frontend**
- [x] 12. TanStack Query導入: `QueryClientProvider`設定, `app/admin/layout.tsx`への組み込み（公開ページには影響させないため、ルートlayoutではなくadmin配下のみ）
- [x] 13. タグ管理画面: `app/admin/tags/page.tsx`＋`features/admin/tags/components/`, `features/admin/tags/hooks/useTagsAdmin.ts`＋`TagForm.schema.ts` ＋ `features/admin/tags/__tests__/`

## フェーズ4: 記事CRUD

**backend**
- [x] 14. DB: `posts`/`post_tag`マイグレーション, `Post.php`（リレーション）, `Tag.php`更新
- [x] 15. 管理記事API（読み取り・作成）: `Admin/PostController.php`(index/show/store), `StorePostRequest.php`, `PostAdminResource.php`, routes追加 ＋ `tests/Feature/Api/Admin/PostControllerTest.php`（読み取り・作成分）
- [x] 16. 管理記事API（更新・削除）: `Admin/PostController.php`(update/destroy追加), `UpdatePostRequest.php` ＋ 同テストに更新・削除分を追加

**frontend**
- [ ] 17. 一覧画面: `app/admin/(articles)/posts/page.tsx`, `app/admin/(articles)/drafts/page.tsx`, `features/admin/posts/types.ts`（一覧表示は共通の`PostList.tsx`に切り出し） ＋ `features/admin/posts/__tests__/PostList.test.tsx`
- [ ] 18. タグ選択UI: `features/admin/tags/components/TagPicker.tsx`（`useTagsList.ts`を切り出し、`useTagsAdmin.ts`と共用。`features/admin/posts`からimportして使う） ＋ `features/admin/tags/__tests__/TagPicker.test.tsx`
- [ ] 19. 記事フォーム＋新規作成: `features/admin/posts/components/PostForm.tsx`＋`PostForm.schema.ts`, `app/admin/(articles)/posts/new/page.tsx`（`useCreatePost.ts`で作成ロジックを分離） ＋ `features/admin/posts/__tests__/PostForm.test.tsx`, `PostForm.schema.test.ts`
- [ ] 20. 編集・削除: `app/admin/(articles)/posts/[slug]/edit/page.tsx`, `features/admin/posts/hooks/usePostEditor.ts` ＋ `features/admin/posts/__tests__/usePostEditor.test.ts`

## フェーズ5: 画像アップロード

**backend**
- [ ] 21. 画像アップロードAPI: `Admin/ImageController.php`, `UploadImageRequest.php`, `ImageUploadService.php`（intervention/image、最大幅1600px・品質80）, routes追加 ＋ `tests/Feature/Api/Admin/ImageControllerTest.php`, `tests/Unit/Services/ImageUploadServiceTest.php`

**frontend**
- [ ] 22. 画像アップロードUI: `features/admin/posts/components/ImageUploader.tsx`, `PostForm.tsx`への統合（サムネイル・本文挿入の両方） ＋ `features/admin/posts/__tests__/ImageUploader.test.tsx`

## フェーズ6: 公開ページ

**backend**
- [ ] 23. 公開記事API: `Api/PostController.php`(index/show), `PostResource.php`, routes追加 ＋ `tests/Feature/Api/PostControllerTest.php`
- [ ] 24. 公開タグAPI: `Api/TagController.php`(index), `TagResource.php`, routes追加 ＋ `tests/Feature/Api/TagControllerTest.php`

**frontend**
- [ ] 25. 共通レイアウト＋フォント: `app/layout.tsx`（Playfair Display・Noto Serif JP・Noto Sans JPの`next/font/google`読み込み）, `globals.css`, `app/(public)/layout.tsx`
- [ ] 26. 記事一覧1ページ目: `app/(public)/layout.tsx`, `app/(public)/page.tsx`, `features/public/posts/components/PostCard.tsx`（サムネイル・抜粋・全タグ表示）, `features/public/posts/types.ts` ＋ `features/public/posts/__tests__/PostCard.test.tsx`
- [ ] 27. ページ送り: `app/(public)/page/[n]/page.tsx`, `features/public/posts/components/Pagination.tsx`, `shared/lib/pagination.ts` ＋ `features/public/posts/__tests__/Pagination.test.tsx`
- [ ] 28. 記事詳細: `app/(public)/posts/[slug]/page.tsx`, `features/public/posts/components/MarkdownRenderer.tsx` ＋ `features/public/posts/__tests__/MarkdownRenderer.test.tsx`
- [ ] 29. 目次(TOC): `features/public/posts/components/TableOfContents.tsx`, 詳細ページへの統合 ＋ `features/public/posts/__tests__/TableOfContents.test.tsx`
- [ ] 30. タグ別一覧: `app/(public)/tags/[tag]/page.tsx`, `app/(public)/tags/[tag]/page/[n]/page.tsx`, `features/public/tags/components/TagList.tsx`（prefetch付き）, `features/public/tags/types.ts` ＋ `features/public/tags/__tests__/TagList.test.tsx`

## フェーズ7: 仕上げ

- [ ] 31. サイトマップ: `app/(public)/sitemap.ts`
- [ ] 32. 再検証Webhook（Next.js側）: `app/api/revalidate/route.ts`
- [ ] 33. 再検証Webhook呼び出し（Laravel側）: `RevalidationService.php`, `Admin/PostController.php`・`Admin/TagController.php`への組み込み ＋ `tests/Unit/Services/RevalidationServiceTest.php`
