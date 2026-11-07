# ルーティング設計（確定）

## 公開ページ（Next.js, 認証不要）

| パス | 内容 |
|---|---|
| `/` | 記事一覧（1ページ目。`/page/1`と同じ内容） |
| `/page/[n]` | 記事一覧のページ送り（パスベース。`n`が範囲外なら404） |
| `/posts/[slug]` | 記事詳細 |
| `/tags/[tag]` | タグ別一覧（1ページ目） |
| `/tags/[tag]/page/[n]` | タグ別一覧のページ送り（パスベース。`n`が範囲外なら404） |
| `/sitemap.xml` | サイトマップ |

ページ送りはクエリパラメータ（`?page=`）ではなく**パスベースの動的セグメント**にする。理由は[docs/frontend/rendering-strategy.md](./rendering-strategy.md)参照（全ページをISR化するため）。

## ログイン（認証不要）

| パス | 内容 |
|---|---|
| `/login` | ログイン |

`/admin`配下には置かない。`/admin/*`は「認証済み前提」で例外なくガードするため、未認証でもアクセスするログインページは独立したパスにする。

## 管理画面（Next.js, `/admin/*`, 認証必須）

| パス | 内容 |
|---|---|
| `/admin/posts` | 公開記事一覧（`GET /api/admin/posts?status=published`） |
| `/admin/drafts` | 下書き一覧（`GET /api/admin/posts?status=draft`） |
| `/admin/posts/new` | 新規作成 |
| `/admin/posts/[slug]/edit` | 編集（削除ボタンもここに配置） |
| `/admin/tags` | タグ管理（作成・編集・削除） |

## 補足

- 管理画面の記事一覧は「公開」と「下書き」を別画面に分ける（1画面でステータス切り替えはしない）
- API自体（`GET /api/admin/posts?status=`）は変更なし。管理画面からは常にどちらか一方のステータスを指定して呼ぶ
