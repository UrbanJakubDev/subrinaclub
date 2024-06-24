import { Column, Table } from "@tanstack/react-table";
import React from "react";

export default function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  if (typeof firstValue === "number") {
    return (
      <div className="flex space-x-2 flex-col">
        <input
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(e) =>
            column.setFilterValue((old: [number, number]) => [
              e.target.value,
              old?.[1],
            ])
          }
          placeholder={`Min`}
          className="w-24 rounded ps-1"
        />
        <input
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(e) =>
            column.setFilterValue((old: [number, number]) => [
              old?.[0],
              e.target.value,
            ])
          }
          placeholder={`Max`}
          className="w-24 rounded ps-1"
        />
      </div>
    );
  }

  return (
    <input
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={column.columnDef.header as string}
      className="w-full rounded ps-1 !text-black !bg-none"
    />
  );
}
