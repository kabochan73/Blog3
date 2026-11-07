# テスト方針（backend、確定）

実装と同じコミットでテストを書く（[docs/04-implementation-roadmap.md](../04-implementation-roadmap.md)の各ステップにテストを含める）。

## ツール

- Pest（PHPUnit上に構築されたテストフレームワーク）。Laravel 11系以降の標準インストールに合わせる

## 範囲

- **機能テスト（`tests/Feature`）**: HTTPリクエスト〜レスポンスを通しで検証
  - 公開API（`Api/PostController`・`Api/TagController`）: ステータス、ページネーション、タグ絞り込み、下書き非表示など
  - 管理API（`Api/Admin/*`）: 認証必須であること（未認証401）、CRUDの正常系・バリデーションエラー（422）、スラッグ重複、画像アップロードの制限（サイズ・形式）
  - 認証（`AuthController`）: ログイン成功・失敗、ログアウト
- **単体テスト（`tests/Unit`）**: 外部I/O（HTTP・DB）を介さないロジックのみ
  - `ImageUploadService`のリサイズ・圧縮ロジック

他のクラス（Model、FormRequest、Resource）は基本的に機能テスト側でカバーされる前提とし、個別の単体テストは作らない（薄いラッパーのため）。

## ファイル命名

Pestの慣例どおり`*Test.php`で統一する。

## 未決定（実装時に詰める）

- テスト用DBのリセット方法（`RefreshDatabase` or `DatabaseTransactions`）
- ファクトリ（`PostFactory`・`TagFactory`・`UserFactory`）の設計
- 画像アップロードのテストでファイルをどう用意するか（`UploadedFile::fake()`想定）
- カバレッジ目標の有無
