"use client"

import { Column, Table } from "@tanstack/react-table";
import React, { ChangeEvent, useMemo, useState } from "react";


// Type for the props
interface DebouncedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (value: string) => void;
  debounceTime?: number;
}

// Debounce function
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  } as T;
}

// DebouncedInput Component
const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value: initialValue,
  onChange,
  debounceTime = 300,
  ...props
}) => {
  const [value, setValue] = useState<string>(initialValue);

  const debouncedOnChange = useMemo(
    () => debounce((value: string) => onChange(value), debounceTime),
    [onChange, debounceTime]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedOnChange(newValue);
  };

  return (
    <input
      {...props}
      value={value}
      onChange={handleChange}
    />
  );
};




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

  if (typeof firstValue === "boolean") {
    return (
      <select
        value={columnFilterValue ?? ""}
        onChange={(e) => column.setFilterValue(e.target.value)}
        className="w-full ps-1"
      >
        <option value="">Vše</option>
        <option value="true">Ano</option>
        <option value="false">Ne</option>
      </select>
    );
  }

  return (
    <DebouncedInput
      type="text"
      value={columnFilterValue ?? ""}
      onChange={value => column.setFilterValue(value)}
      placeholder="Hledat"
      className="w-full ps-1"
      debounceTime={300} // Optional, defaults to 300ms
    />
  );
}
