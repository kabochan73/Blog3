<?php

namespace App\Providers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // API設計（docs/api/public.md・docs/api/admin.md）では非ページネーションの一覧は
        // dataラップなしの生配列で返す方針のため、デフォルトの自動ラップを無効化する。
        // ページネーション付きレスポンス（paginate()由来）はこの設定に関わらず data/links/meta を保持する。
        JsonResource::withoutWrapping();
    }
}
