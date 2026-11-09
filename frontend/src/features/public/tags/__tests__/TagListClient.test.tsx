import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { describe, expect, it, vi } from "vitest";

import { TagListClient } from "../components/TagListClient";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

const tags = [
  { name: "laravel", count: 3 },
  { name: "nextjs", count: 1 },
];

describe("TagListClient", () => {
  it("renders a prefetch-enabled link for each tag", () => {
    vi.mocked(usePathname).mockReturnValue("/");

    render(<TagListClient tags={tags} />);

    expect(screen.getByRole("link", { name: "laravel" })).toHaveAttribute("href", "/tags/laravel");
    expect(screen.getByRole("link", { name: "nextjs" })).toHaveAttribute("href", "/tags/nextjs");
  });

  it("highlights only the tag matching the current path", () => {
    vi.mocked(usePathname).mockReturnValue("/tags/laravel");

    render(<TagListClient tags={tags} />);

    expect(screen.getByRole("link", { name: "laravel" }).className).toContain("bg-foreground");
    expect(screen.getByRole("link", { name: "nextjs" }).className).not.toContain("bg-foreground");
  });

  it("highlights the tag on its paginated pages too", () => {
    vi.mocked(usePathname).mockReturnValue("/tags/laravel/page/2");

    render(<TagListClient tags={tags} />);

    expect(screen.getByRole("link", { name: "laravel" }).className).toContain("bg-foreground");
  });

  it("highlights a tag containing non-ASCII characters even when the pathname is still percent-encoded", () => {
    vi.mocked(usePathname).mockReturnValue("/tags/test%EF%BC%92");

    render(<TagListClient tags={[{ name: "test２", count: 1 }]} />);

    expect(screen.getByRole("link", { name: "test２" }).className).toContain("bg-foreground");
  });

  it("links the active tag back to the top page, to deselect it", () => {
    vi.mocked(usePathname).mockReturnValue("/tags/laravel");

    render(<TagListClient tags={tags} />);

    expect(screen.getByRole("link", { name: "laravel" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "nextjs" })).toHaveAttribute("href", "/tags/nextjs");
  });
});
