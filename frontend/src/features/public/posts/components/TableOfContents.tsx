import type { TocHeading } from "../markdown";

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="border-b border-foreground/40 p-4 text-sm">
      <p className="font-heading mb-2 text-xl font-bold">目次</p>
      <ul className="flex flex-col gap-1">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.depth === 3 ? "pl-4" : undefined}>
            <a href={`#${heading.id}`} className="text-foreground/80 hover:text-foreground hover:underline font-medium">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
