import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminTagList } from "../components/AdminTagList";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

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

describe("AdminTagList", () => {
  it("renders a link to filter the admin post list for each tag", async () => {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams() as ReturnType<typeof useSearchParams>);
    adminApiFetchMock.mockResolvedValueOnce([
      { id: 1, name: "laravel", count: 3 },
      { id: 2, name: "nextjs", count: 1 },
    ]);

    renderWithClient(<AdminTagList />);

    expect(await screen.findByRole("link", { name: "laravel" })).toHaveAttribute(
      "href",
      "/admin/posts?tag=laravel",
    );
    expect(screen.getByRole("link", { name: "nextjs" })).toHaveAttribute("href", "/admin/posts?tag=nextjs");
  });

  it("highlights the tag matching the current ?tag= query and links it back to the unfiltered list", async () => {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams("tag=laravel") as ReturnType<
      typeof useSearchParams
    >);
    adminApiFetchMock.mockResolvedValueOnce([
      { id: 1, name: "laravel", count: 3 },
      { id: 2, name: "nextjs", count: 1 },
    ]);

    renderWithClient(<AdminTagList />);

    const activeLink = await screen.findByRole("link", { name: "laravel" });
    expect(activeLink.className).toContain("bg-foreground");
    expect(activeLink).toHaveAttribute("href", "/admin/posts");
    expect(screen.getByRole("link", { name: "nextjs" }).className).not.toContain("bg-foreground");
  });

  it("renders nothing when there are no tags", async () => {
    vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams() as ReturnType<typeof useSearchParams>);
    adminApiFetchMock.mockResolvedValueOnce([]);

    const { container } = renderWithClient(<AdminTagList />);

    await vi.waitFor(() => expect(adminApiFetchMock).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });
});
