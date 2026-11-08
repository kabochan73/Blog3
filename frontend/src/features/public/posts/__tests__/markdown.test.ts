import { describe, expect, it } from "vitest";

import { extractHeadings } from "../markdown";

describe("extractHeadings", () => {
  it("extracts h2 and h3 headings only", () => {
    const content = "# Title\n\n## Section One\n\n### Subsection\n\n#### Detail";

    const headings = extractHeadings(content);

    expect(headings).toEqual([
      { id: "section-one", text: "Section One", depth: 2 },
      { id: "subsection", text: "Subsection", depth: 3 },
    ]);
  });

  it("returns an empty array when there are no headings", () => {
    expect(extractHeadings("just a paragraph")).toEqual([]);
  });

  it("deduplicates slugs for repeated heading text, matching rehype-slug's behavior", () => {
    const headings = extractHeadings("## Overview\n\n## Overview");

    expect(headings.map((h) => h.id)).toEqual(["overview", "overview-1"]);
  });

  it("slugifies Japanese heading text", () => {
    const headings = extractHeadings("## はじめに");

    expect(headings).toEqual([{ id: "はじめに", text: "はじめに", depth: 2 }]);
  });
});
