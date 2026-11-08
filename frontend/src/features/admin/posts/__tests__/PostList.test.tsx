import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PostList } from "../components/PostList";

const adminApiFetchMock = vi.fn();
vi.mock("@/shared/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/shared/lib/api")>("@/shared/lib/api");
  return {
    ...actual,
    adminApiFetch: (...args: unknown[]) => adminApiFetchMock(...args),
  };
});

function renderWithClient(ui: ReactNode) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
  adminApiFetchMock.mockReset();
});

describe("PostList", () => {
  it("shows a loading message while fetching", () => {
    adminApiFetchMock.mockReturnValue(new Promise(() => {}));

    renderWithClient(<PostList status="published" />);

    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  it("shows an error message when the fetch fails", async () => {
    adminApiFetchMock.mockRejectedValueOnce(new Error("network error"));

    renderWithClient(<PostList status="published" />);

    expect(await screen.findByText("記事の取得に失敗しました")).toBeInTheDocument();
  });

  it("shows an empty state when there are no posts", async () => {
    adminApiFetchMock.mockResolvedValueOnce({ data: [] });

    renderWithClient(<PostList status="published" />);

    expect(await screen.findByText("記事がありません")).toBeInTheDocument();
  });

  it("renders posts with their date and tags", async () => {
    adminApiFetchMock.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          title: "記事タイトル",
          slug: "example-post",
          status: "published",
          excerpt: null,
          content: "",
          thumbnail: null,
          tags: ["laravel", "nextjs"],
          created_at: "2026-11-06T10:00:00+09:00",
          updated_at: "2026-11-06T10:00:00+09:00",
        },
      ],
    });

    renderWithClient(<PostList status="published" />);

    expect(await screen.findByText("記事タイトル")).toBeInTheDocument();
    expect(screen.getByText("laravel")).toBeInTheDocument();
    expect(screen.getByText("nextjs")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "記事タイトル" })).toHaveAttribute(
      "href",
      "/admin/posts/example-post/edit",
    );
  });

  it("requests the given status", () => {
    adminApiFetchMock.mockReturnValue(new Promise(() => {}));

    renderWithClient(<PostList status="draft" />);

    expect(adminApiFetchMock).toHaveBeenCalledWith("/api/admin/posts?status=draft");
  });
});
