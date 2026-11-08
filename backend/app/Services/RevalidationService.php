<?php

namespace App\Services;

use App\Models\Post;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class RevalidationService
{
    private const PER_PAGE = 20;

    public function postCreatedOrDeleted(Post $post): void
    {
        $paths = $this->postListPaths();
        $paths[] = "/posts/{$post->slug}";
        $paths[] = '/sitemap.xml';

        foreach ($post->tags as $tag) {
            array_push($paths, ...$this->tagListPaths($tag->name));
        }

        $this->send($paths);
    }

    public function postUpdated(Post $post, ?string $oldSlug = null): void
    {
        $paths = ["/posts/{$post->slug}"];

        if ($oldSlug !== null && $oldSlug !== $post->slug) {
            $paths[] = "/posts/{$oldSlug}";
        }

        array_push($paths, ...$this->postListPaths());

        foreach ($post->tags as $tag) {
            array_push($paths, ...$this->tagListPaths($tag->name));
        }

        $this->send($paths);
    }

    public function tagChanged(string $name, ?string $oldName = null): void
    {
        $paths = $this->tagListPaths($name);

        if ($oldName !== null && $oldName !== $name) {
            array_push($paths, ...$this->tagListPaths($oldName));
        }

        $this->send($paths);
    }

    /**
     * @return array<int, string>
     */
    private function postListPaths(): array
    {
        $count = Post::query()->where('status', 'published')->count();

        return $this->pagedPaths('', $count);
    }

    /**
     * @return array<int, string>
     */
    private function tagListPaths(string $name): array
    {
        $count = Post::query()
            ->where('status', 'published')
            ->whereHas('tags', fn ($query) => $query->where('name', $name))
            ->count();

        return $this->pagedPaths("/tags/{$name}", $count);
    }

    /**
     * @return array<int, string>
     */
    private function pagedPaths(string $base, int $postCount): array
    {
        $totalPages = max(1, (int) ceil($postCount / self::PER_PAGE));

        $paths = [$base === '' ? '/' : $base];

        for ($page = 1; $page <= $totalPages; $page++) {
            $paths[] = "{$base}/page/{$page}";
        }

        return $paths;
    }

    /**
     * @param  array<int, string>  $paths
     */
    private function send(array $paths): void
    {
        $paths = array_values(array_unique($paths));

        if (empty($paths)) {
            return;
        }

        try {
            $response = Http::timeout(3)
                ->withToken(config('services.revalidate.secret'))
                ->post(config('services.revalidate.url'), ['paths' => $paths]);

            if ($response->failed()) {
                Log::warning('Revalidation webhook returned an error response.', [
                    'paths' => $paths,
                    'status' => $response->status(),
                ]);
            }
        } catch (Throwable $e) {
            Log::warning('Revalidation webhook failed.', [
                'paths' => $paths,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
