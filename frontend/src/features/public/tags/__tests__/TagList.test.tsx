import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { publicApiFetch } from "@/shared/lib/api";
import { TagList } from "../components/TagList";

// `cacheLife()` requires the `cacheComponents` runtime config, which the test environment doesn't provide.
vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("@/shared/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/shared/lib/api")>("@/shared/lib/api");
  return {
    ...actual,
    publicApiFetch: vi.fn(),
  };
});

beforeEach(() => {
  vi.mocked(publicApiFetch).mockReset();
});

describe("TagList", () => {
  it("renders nothing when there are no tags", async () => {
    vi.mocked(publicApiFetch).mockResolvedValueOnce([]);

    const { container } = render(await TagList());

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a prefetch-enabled link for each tag", async () => {
    vi.mocked(publicApiFetch).mockResolvedValueOnce([
      { name: "laravel", count: 3 },
      { name: "nextjs", count: 1 },
    ]);

    render(await TagList());

    expect(screen.getByRole("link", { name: "laravel" })).toHaveAttribute("href", "/tags/laravel");
    expect(screen.getByRole("link", { name: "nextjs" })).toHaveAttribute("href", "/tags/nextjs");
  });
});
