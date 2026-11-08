import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PostCard } from "../components/PostCard";
import type { PostListItem } from "../types";

const basePost: PostListItem = {
  slug: "example-post",
  title: "記事タイトル",
  excerpt: "記事の概要文",
  thumbnail: null,
  tags: [],
  created_at: "2026-11-06T10:00:00+09:00",
};

describe("PostCard", () => {
  it("renders the title, date, and excerpt", () => {
    render(<PostCard post={basePost} />);

    expect(screen.getByText("記事タイトル")).toBeInTheDocument();
    expect(screen.getByText("記事の概要文")).toBeInTheDocument();
    expect(screen.getByText("2026/11/6")).toBeInTheDocument();
  });

  it("links the title to the post detail page", () => {
    render(<PostCard post={basePost} />);

    expect(screen.getByRole("link", { name: /記事タイトル/ })).toHaveAttribute(
      "href",
      "/posts/example-post",
    );
  });

  it("shows a placeholder when there is no thumbnail", () => {
    const { container } = render(<PostCard post={basePost} />);

    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(container.querySelector(".bg-foreground")).toBeInTheDocument();
  });

  it("renders the thumbnail image resolved against the API origin", () => {
    const { container } = render(<PostCard post={{ ...basePost, thumbnail: "/storage/images/example.jpg" }} />);

    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", expect.stringContaining("/storage/images/example.jpg"));
  });

  it("renders all tags as plain text, not links", () => {
    render(<PostCard post={{ ...basePost, tags: ["laravel", "nextjs"] }} />);

    expect(screen.getByText("laravel")).toBeInTheDocument();
    expect(screen.getByText("nextjs")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /laravel|nextjs/ })).not.toBeInTheDocument();
  });

  it("renders no tag list when there are no tags", () => {
    const { container } = render(<PostCard post={basePost} />);

    expect(container.querySelector("ul")).not.toBeInTheDocument();
  });
});
