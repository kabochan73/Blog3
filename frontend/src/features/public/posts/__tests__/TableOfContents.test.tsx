import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TableOfContents } from "../components/TableOfContents";
import type { TocHeading } from "../markdown";

describe("TableOfContents", () => {
  it("renders nothing when there are no headings", () => {
    const { container } = render(<TableOfContents headings={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders each heading as a link to its anchor", () => {
    const headings: TocHeading[] = [
      { id: "getting-started", text: "Getting Started", depth: 2 },
      { id: "installation", text: "Installation", depth: 3 },
    ];

    render(<TableOfContents headings={headings} />);

    expect(screen.getByRole("link", { name: "Getting Started" })).toHaveAttribute("href", "#getting-started");
    expect(screen.getByRole("link", { name: "Installation" })).toHaveAttribute("href", "#installation");
  });

  it("indents h3 headings but not h2 headings", () => {
    const headings: TocHeading[] = [
      { id: "getting-started", text: "Getting Started", depth: 2 },
      { id: "installation", text: "Installation", depth: 3 },
    ];

    render(<TableOfContents headings={headings} />);

    const h2Item = screen.getByRole("link", { name: "Getting Started" }).closest("li");
    const h3Item = screen.getByRole("link", { name: "Installation" }).closest("li");

    expect(h2Item?.className).not.toContain("pl-4");
    expect(h3Item?.className).toContain("pl-4");
  });

  it("preserves heading order", () => {
    const headings: TocHeading[] = [
      { id: "first", text: "First", depth: 2 },
      { id: "second", text: "Second", depth: 2 },
    ];

    render(<TableOfContents headings={headings} />);

    const links = screen.getAllByRole("link").map((link) => link.textContent);
    expect(links).toEqual(["First", "Second"]);
  });
});
