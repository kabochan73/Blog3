# レンダリング戦略（確定・Vercel前提）

frontendは**Vercelにデプロイ**する（backend・PostgreSQL・bucketはRailwayのまま）。Vercelのエッジキャッシュ基盤を活かし、公開ページは**全ページSSG＋オンデマンド再検証（ISR）**で統一する。時間ベースの`revalidate`は使わない。

## なぜVercel前提に変えたか

- ISR（Full Route Cache）の最大のメリットは、キャッシュ済みページをオリジンサーバーに到達する前にエッジ/CDNから配信できること
- Railwayの自前Docker運用にはそのエッジ層が無く、ISRでも動的レンダリングでも必ずオリジンのNext.jsサーバープロセスに到達してしまうため、ISRを使うメリットが薄かった
- Vercelならこのエッジ配信の恩恵をそのまま受けられるため、全ページを静的化する価値がある

## ページネーションをパスベースに変更

クエリパラメータ（`?page=`）方式だと、`searchParams`を読む時点でルート全体が動的レンダリング扱いになり、1ページ目を含めて静的化できない。そのため、ページ送りは**パスベースの動的セグメント**（`/page/[n]`、`/tags/[tag]/page/[n]`）に変更する（[docs/frontend/routing.md](./routing.md)参照）。

## ルートごとの方針

| ルート | 方式 |
|---|---|
| `/`（記事一覧1ページ目） | SSG（`/page/1`と同じ内容）＋オンデマンド再検証 |
| `/page/[n]` | SSG（`generateStaticParams()`で全ページ番号を動的に算出）＋オンデマンド再検証 |
| `/posts/[slug]` | SSG（`generateStaticParams()`で全公開記事のslugを事前生成）＋オンデマンド再検証 |
| `/tags/[tag]` | SSG（`/api/tags`の全タグ名で`generateStaticParams()`）＋オンデマンド再検証 |
| `/tags/[tag]/page/[n]` | SSG（同様に動的算出）＋オンデマンド再検証 |
| `/sitemap.xml` | SSG＋オンデマンド再検証 |

全ルートが`generateStaticParams()`で事前生成され、ビルド後に増えたslug・ページ番号・タグは`dynamicParams`のデフォルト動作で初回アクセス時に生成・キャッシュされる。

### `generateStaticParams()`でのページ数の算出

ページ数を固定値でハードコードしない。ビルド時に公開APIへ問い合わせて動的に算出する。

```
総ページ数 = ceil(公開記事の総数 / per_page(20))
```

この総ページ数ぶんの`{ page: '1' }, { page: '2' }, ...`を返す。記事が増減すれば、次のビルドまたは再検証のたびに自動的に追従する。

### 範囲外のページ番号

`/page/[n]`で`n`が現在の総ページ数を超えている場合は`notFound()`で404を返す（空のページとして表示しない）。

## キャッシュの仕組み

- **Full Route Cache（ISR）**: ページ全体のレンダリング結果を1つの静的な実体としてキャッシュする仕組み。Vercelではキャッシュがエッジ/CDNに配置され、ヒットすればオリジン（Next.jsサーバーの実行）に到達せずに配信される
- 再検証（`revalidatePath`）が呼ばれると、そのページのキャッシュは「無効」になる。**次にそのページへ最初にアクセスした人の時だけ**裏側で1回再生成され、それ以降は新しいキャッシュが配信され続ける（即時に全員へ反映されるわけではない）
- Vercelのキャッシュは共有の永続基盤上にあるため、Railwayの自前運用で懸念していた「コンテナ再起動で消える」「複数インスタンスで別々に持つ」といった問題は発生しない

## Webhookの仕組み（オンデマンド再検証）

### Next.js側: `app/api/revalidate/route.ts`（Route Handler）

- `POST`、`Authorization: Bearer {REVALIDATE_SECRET}`ヘッダーで認証
- body: `{ "paths": string[] }`
- 受け取った各pathに`revalidatePath()`を実行
- 認証失敗時は401、不正なbodyは422

### Laravel側: 管理用APIからの呼び出し

`Admin\PostController`・`Admin\TagController`の`store`/`update`/`destroy`が成功した直後に、上記Webhookをインターネット経由でHTTP呼び出しする（RailwayからVercelの公開URLへ。タイムアウトは短め、例: 3秒）。

記事は新しい順に並ぶため、記事が1件増減すると**既存の全ページの内容が1件ずつズレる**。そのため、記事作成・更新・削除のたびに、現在の総ページ数を計算し直し、`/page/1`から`/page/N`まで全て再検証対象に含める。

| イベント | 送る`paths` |
|---|---|
| 記事作成・削除 | `["/", "/page/1", ..., "/page/{現在の総ページ数}", "/posts/{slug}", "/sitemap.xml"]`（紐づくタグがあれば`/tags/{tag}`と`/tags/{tag}/page/1..N`も追加） |
| 記事更新 | `["/posts/{slug}", "/", "/page/1", ..., "/page/{現在の総ページ数}"]`（slugが変わった場合は旧slugの`/posts/{oldSlug}`も含める。紐づくタグがあれば同様に追加） |
| タグ作成・更新・削除 | `["/tags/{name}", "/tags/{name}/page/1", ...]`（リネーム時は新旧両方の名前を含める） |

- Webhook呼び出しが失敗しても記事・タグの保存自体は失敗させない（ログに残すだけ）。キューイングやリトライは行わない
- シークレット（`REVALIDATE_SECRET`）はbackend（Railway）・frontend（Vercel）両方の環境変数に同じ値を設定して共有する
