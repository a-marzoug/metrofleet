"use client";

import type { QueryResult } from "@/types/database";

type DataTableProps = {
  data: QueryResult[];
};

export const DataTable = ({ data }: DataTableProps) => {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);

  const getRowKey = (row: QueryResult, index: number): string => {
    if ("revenue_date" in row) return String(row.revenue_date);
    if ("pickup_datetime" in row) return String(row.pickup_datetime);
    return String(index);
  };

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") {
      return Number.isInteger(value)
        ? value.toLocaleString()
        : value.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    return String(value);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 my-3">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-zinc-50 border-b border-zinc-200">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider"
              >
                {h.replace(/_/g, " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {data.map((row, i) => (
            <tr key={getRowKey(row, i)} className="hover:bg-zinc-50">
              {headers.map((h) => (
                <td key={h} className="px-4 py-2.5 text-zinc-700">
                  {formatValue(row[h as keyof typeof row])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
