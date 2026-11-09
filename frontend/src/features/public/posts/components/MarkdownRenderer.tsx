import ReactMarkdown, { type Components } from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const components: Components = {
  h1: ({ id, children }) => (
    <h1 id={id} className="font-heading mt-10 mb-4 text-2xl font-bold tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ id, children }) => (
    <h2 id={id} className="font-heading mt-8 mb-3 text-xl font-bold tracking-tight">
      {children}
    </h2>
  ),
  h3: ({ id, children }) => (
    <h3 id={id} className="font-heading mt-6 mb-2 text-lg font-semibold tracking-tight">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="my-4 text-lg leading-8">{children}</p>,
  a: ({ href, children }) => (
    <a href={href} className="underline hover:no-underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="my-4 list-disc pl-6 text-lg">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 list-decimal pl-6 text-lg">{children}</ol>,
  li: ({ children }) => <li className="my-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 border-foreground/20 pl-4 text-foreground/70">{children}</blockquote>
  ),
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element -- markdown images may come from arbitrary external URLs
    <img src={src} alt={alt ?? ""} className="my-4 rounded-lg" />
  ),
  code: ({ className, children }) => {
    const isInline = !className && !String(children).includes("\n");
    if (!isInline) {
      return <code className={className}>{children}</code>;
    }
    return <code className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-sm">{children}</code>;
  },
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-lg bg-foreground p-4 font-mono text-sm text-background">
      {children}
    </pre>
  ),
};

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="ml-4">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
