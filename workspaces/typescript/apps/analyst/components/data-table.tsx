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
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") return value.toLocaleString();
    return String(value);
  };

  return (
    <div className="overflow-x-auto my-4 rounded-md border">
      <table className="w-full text-sm text-left">
        <thead className="bg-zinc-100 text-zinc-700 uppercase">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={getRowKey(row, i)}
              className="border-b last:border-0 hover:bg-zinc-50"
            >
              {headers.map((h) => (
                <td key={h} className="px-4 py-2">
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
