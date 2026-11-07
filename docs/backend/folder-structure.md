# バックエンドのフォルダ構成（確定）

Laravel標準構成をベースに、公開用/管理用のController分離とバリデーション・レスポンス整形の切り出しを行う。Blog2からの変更点は`tests/`の追加のみ（テスト方針は[docs/backend/testing.md](./testing.md)参照）。

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── AuthController.php        # login / logout
│   │   │       ├── PostController.php        # 公開: 一覧・詳細
│   │   │       ├── TagController.php         # 公開: 一覧
│   │   │       └── Admin/
│   │   │           ├── PostController.php    # 一覧・詳細・作成・更新・削除
│   │   │           ├── TagController.php     # 一覧・作成・更新・削除
│   │   │           └── ImageController.php   # アップロード
│   │   ├── Requests/
│   │   │   ├── LoginRequest.php
│   │   │   ├── StorePostRequest.php
│   │   │   ├── UpdatePostRequest.php
│   │   │   ├── StoreTagRequest.php
│   │   │   ├── UpdateTagRequest.php
│   │   │   └── UploadImageRequest.php
│   │   └── Resources/
│   │       ├── PostResource.php              # 公開用（statusなし）
│   │       ├── PostAdminResource.php         # 管理用（status含む）
│   │       ├── TagResource.php               # 公開用（name, count）
│   │       └── TagAdminResource.php          # 管理用（id, name, count）
│   ├── Models/
│   │   ├── Post.php
│   │   ├── Tag.php
│   │   └── User.php
│   └── Services/
│       └── ImageUploadService.php            # リサイズ・圧縮して保存しURLを返す
├── database/
│   ├── migrations/                           # users / personal_access_tokens / posts / tags / post_tag
│   └── seeders/
│       ├── DatabaseSeeder.php
│       └── AdminUserSeeder.php                # .envのADMIN_EMAIL/ADMIN_PASSWORDを読む
├── routes/
│   └── api.php
├── tests/
│   ├── Feature/
│   │   └── Api/
│   │       ├── AuthControllerTest.php
│   │       ├── PostControllerTest.php            # 公開API
│   │       ├── TagControllerTest.php             # 公開API
│   │       └── Admin/
│   │           ├── PostControllerTest.php        # 管理API（認証込みのリクエスト〜レスポンス）
│   │           ├── TagControllerTest.php
│   │           └── ImageControllerTest.php
│   └── Unit/
│       └── Services/
│           └── ImageUploadServiceTest.php        # リサイズ・圧縮ロジック単体
└── config/
    ├── cors.php
    ├── sanctum.php
    └── filesystems.php                        # localディスク / 本番bucketディスク
```

## ポイント（Blog2から変更なし）

- Controllerは「公開用」と「管理用（`Admin/`サブフォルダ）」で分離。公開側は認証不要、管理側は`auth:sanctum`ミドルウェア配下（[docs/backend/auth.md](./auth.md)参照）
- バリデーションは`FormRequest`クラスに切り出し、コントローラーを薄く保つ
- レスポンス整形は`Resource`クラスに切り出し。公開用と管理用で見せるフィールドが異なる（`status`の有無）ため別クラスにする
- 画像のリサイズ・圧縮ロジックのみ`Services/ImageUploadService`に分離。それ以外の処理は規模に見合わずコントローラーに直接書く
- `posts`/`tags`はEloquentモデル（PostgreSQL管理）。Markdownパーサー等は使わない（[docs/backend/database-schema.md](./database-schema.md)参照）

## テスト配置（Blog3で追加）

- `tests/Feature/`: HTTPリクエスト〜レスポンスを通しで検証する機能テスト。`Api/`配下は公開APIと同じ階層に`Admin/`を切る（Controllerの配置と対応させる）
- `tests/Unit/`: 外部I/O（HTTPリクエスト・DB）を介さないロジック単体のテスト。今回は`ImageUploadService`のリサイズ・圧縮ロジックが対象
- 詳細な方針（データベースのリセット方法、ファクトリの使い方など）は[docs/backend/testing.md](./testing.md)参照
