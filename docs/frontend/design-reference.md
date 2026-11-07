# デザイン参考（確定）

公開ページのビジュアルイメージとして以下のスクリーンショットを参考にしている。

- 参照画像: [images/design-reference.png](../images/design-reference.png)（トップページ案「Blog」）

## 方向性

- オフホワイト基調のミニマルなデザイン（Blog2の「LOGBOOK.」から刷新）
- 左: 記事一覧（サムネイル画像＋日付＋タイトル＋抜粋＋付与された全タグを表示）
- 右: サイドバー（「About Me」で名前・年齢・自己紹介をテキストのみで表示。リンクボタンは置かない）、「Tags」でタグ一覧

## フォント

| 用途 | フォント |
|---|---|
| 見出し（英欧文） | Playfair Display（クラシックなセリフ体） |
| 見出し（和文。サイトタイトル・記事タイトル・About Me等） | Noto Serif JP |
| 本文（説明文・記事本文） | Noto Sans JP（可読性重視でゴシックのまま） |

- 見出しのみセリフ/明朝を使い、本文はゴシックのままにすることで可読性を保つ
- `next/font/google`で読み込む。Noto Serif JPは画数の多い漢字が小さいサイズで潰れやすいため、記事タイトルなど見出し用途のフォントサイズ・太さ（medium〜bold）は実際の文言で確認しながら調整する

## 記事カードに表示する情報

- サムネイル画像（`posts.thumbnail`）。`thumbnail`がnull（未設定）の記事は、固定のプレースホルダー画像を表示する（画像エリア自体は詰めずに維持する）
- 日付（`posts.created_at`）
- タイトル（`posts.title`）
- 抜粋（`posts.excerpt`）
- 付与された全タグ（Blog2は代表タグ1つのみ表示だったが、Blog3では全件表示に変更）

## サイドバー

- 「About Me」: 名前・年齢・自己紹介のテキストのみ。DB化・管理画面からの編集はせず、コンポーネント内に直書き（ハードコード）する。詳細ページへのリンクボタンは作らない
- 「Tags」: タグ一覧（[docs/frontend/component-types.md](./component-types.md)の`TagList`、prefetch方針はBlog2から変更なし）

この方向性を前提にした具体的なコンポーネント実装（`PostCard`のレイアウトなど）は、frontendの実装着手時に詰める。

## 管理画面のデザイン（確定）

公開ページと同じデザイン（オフホワイト基調、Playfair Display + Noto Serif JPの見出し）をそのまま使う。管理画面専用のビジュアルは作らない。

- ヘッダーのナビゲーションは`Public` / `Draft` / `Tags` / `Logout`の4項目をフラットに並べる（Blog2は`Articles`タブ配下に`Public`/`Draft`のサブタブという2階層構成だったが、Blog3では1階層にする）
  - `Public` → `/admin/posts`（公開記事一覧）
  - `Draft` → `/admin/drafts`（下書き一覧）
  - `Tags` → `/admin/tags`（タグ管理）
  - `Logout` → ログアウト処理
