import GithubSlugger from "github-slugger";
import type { Heading } from "mdast";
import { toString } from "mdast-util-to-string";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export type TocHeading = {
  id: string;
  text: string;
  depth: number;
};

/**
 * Extracts h2/h3 headings for the table of contents.
 * Walks every heading (not just h2/h3) through the same github-slugger sequence
 * that rehype-slug uses when rendering, so the ids stay in sync with MarkdownRenderer's anchors.
 */
export function extractHeadings(content: string): TocHeading[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(content);
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];

  visit(tree, "heading", (node: Heading) => {
    const text = toString(node);
    const id = slugger.slug(text);

    if (node.depth === 2 || node.depth === 3) {
      headings.push({ id, text, depth: node.depth });
    }
  });

  return headings;
}
