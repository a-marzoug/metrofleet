"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

type SqlBlockProps = {
  query: string;
};

const SQL_KEYWORDS = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "AND",
  "OR",
  "ORDER",
  "BY",
  "GROUP",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "JOIN",
  "LEFT",
  "RIGHT",
  "INNER",
  "OUTER",
  "ON",
  "AS",
  "DISTINCT",
  "COUNT",
  "SUM",
  "AVG",
  "MIN",
  "MAX",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
  "IN",
  "NOT",
  "NULL",
  "IS",
  "LIKE",
  "BETWEEN",
  "UNION",
  "INSERT",
  "UPDATE",
  "DELETE",
  "CREATE",
  "DROP",
  "ALTER",
  "TABLE",
  "INDEX",
  "VIEW",
  "WITH",
  "ASC",
  "DESC",
  "OVER",
  "PARTITION",
  "ROUND",
  "COALESCE",
]);

const highlightSql = (sql: string): React.ReactNode[] => {
  const tokens = sql.split(/(\s+|[(),;])/);

  return tokens.map((token, i) => {
    const upper = token.toUpperCase();
    if (SQL_KEYWORDS.has(upper)) {
      return (
        <span key={i} className="text-sky-400 font-medium">
          {token}
        </span>
      );
    }
    if (/^'.*'$/.test(token)) {
      return (
        <span key={i} className="text-amber-300">
          {token}
        </span>
      );
    }
    if (/^\d+(\.\d+)?$/.test(token)) {
      return (
        <span key={i} className="text-purple-400">
          {token}
        </span>
      );
    }
    return <span key={i}>{token}</span>;
  });
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
