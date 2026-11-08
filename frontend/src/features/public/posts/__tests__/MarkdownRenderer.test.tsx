import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarkdownRenderer } from "../components/MarkdownRenderer";

describe("MarkdownRenderer", () => {
  it("renders headings with ids for anchor links", () => {
    render(<MarkdownRenderer content="## Getting Started" />);

    const heading = screen.getByRole("heading", { name: "Getting Started", level: 2 });
    expect(heading).toHaveAttribute("id", "getting-started");
  });

  it("renders paragraphs", () => {
    render(<MarkdownRenderer content="Hello world" />);

    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders links that open in a new tab safely", () => {
    render(<MarkdownRenderer content="[Next.js](https://nextjs.org)" />);

    const link = screen.getByRole("link", { name: "Next.js" });
    expect(link).toHaveAttribute("href", "https://nextjs.org");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders unordered and ordered lists", () => {
    render(<MarkdownRenderer content={"- one\n- two"} />);

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("supports GFM strikethrough", () => {
    render(<MarkdownRenderer content="~~deleted~~" />);

    expect(screen.getByText("deleted").tagName.toLowerCase()).toBe("del");
  });

  it("renders fenced code blocks distinctly from inline code", () => {
    const { container } = render(<MarkdownRenderer content={"```js\nconst a = 1;\n```"} />);

    expect(container.querySelector("pre")).toBeInTheDocument();
  });

  it("renders images", () => {
    render(<MarkdownRenderer content="![alt text](/storage/images/example.jpg)" />);

    expect(screen.getByRole("img", { name: "alt text" })).toHaveAttribute("src", "/storage/images/example.jpg");
  });
});
