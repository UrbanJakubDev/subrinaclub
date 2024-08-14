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
      <div className="flex flex-row">
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
          className="w-16 rounded ps-1"
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
          className=" w-16 rounded ps-1"
        />
      </div>
    );
  }

  return (
    <input
      type="text"
      value={(columnFilterValue ?? "") as string}
      placeholder="Hledat"
      onChange={(e) => column.setFilterValue(e.target.value)}
      className="w-full ps-1"
    />
  );
}
