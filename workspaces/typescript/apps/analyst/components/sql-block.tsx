"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

type SqlBlockProps = {
  query: string;
};

const SQL_KEYWORDS =
  /\b(SELECT|FROM|WHERE|AND|OR|ORDER BY|GROUP BY|HAVING|LIMIT|OFFSET|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|DISTINCT|COUNT|SUM|AVG|MIN|MAX|CASE|WHEN|THEN|ELSE|END|IN|NOT|NULL|IS|LIKE|BETWEEN|UNION|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TABLE|INDEX|VIEW|WITH|ASC|DESC)\b/gi;

const highlightSql = (sql: string): React.ReactNode[] => {
  const parts = sql.split(SQL_KEYWORDS);
  const matches = sql.match(SQL_KEYWORDS) || [];

  const result: React.ReactNode[] = [];
  let matchIndex = 0;
  let keyCounter = 0;

  for (const part of parts) {
    if (part) {
      result.push(
        <span key={`p-${keyCounter++}-${part.slice(0, 10)}`}>{part}</span>,
      );
    }
    if (matchIndex < matches.length) {
      const keyword = matches[matchIndex];
      result.push(
        <span
          key={`k-${keyCounter++}-${keyword}`}
          className="text-blue-600 font-medium"
        >
          {keyword}
        </span>,
      );
      matchIndex++;
    }
  }

  return result;
};

export const SqlBlock = ({ query }: SqlBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden my-3">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 text-zinc-400 text-xs">
        <span>sql</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="text-zinc-100 font-mono">{highlightSql(query)}</code>
      </pre>
    </div>
  );
};
