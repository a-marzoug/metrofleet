"use client";

import { Streamdown } from "streamdown";

type MarkdownProps = {
  children: string;
  isStreaming?: boolean;
};

export const Markdown = ({ children, isStreaming = false }: MarkdownProps) => (
  <Streamdown
    isAnimating={isStreaming}
    components={{
      p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
      ul: ({ children }) => <ul className="list-disc pl-6 mb-3">{children}</ul>,
      ol: ({ children }) => (
        <ol className="list-decimal pl-6 mb-3">{children}</ol>
      ),
      li: ({ children }) => <li className="mb-1">{children}</li>,
      h1: ({ children }) => (
        <h1 className="text-xl font-semibold mb-2">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-lg font-semibold mb-2">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-base font-semibold mb-2">{children}</h3>
      ),
      strong: ({ children }) => (
        <strong className="font-semibold">{children}</strong>
      ),
      code: ({ children }) => (
        <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      ),
    }}
  >
    {children}
  </Streamdown>
);
