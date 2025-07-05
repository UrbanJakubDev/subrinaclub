"use client"

import { Column, Table } from "@tanstack/react-table";
import React, { ChangeEvent, useMemo, useState } from "react";

// Type for the props
interface DebouncedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
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
      className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all duration-200"
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
      <div className="flex flex-col gap-1">
        <input
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(e) =>
            column.setFilterValue((old: [number, number]) => [
              e.target.value,
              old?.[1],
            ])
          }
          placeholder="Min"
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all duration-200"
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
          placeholder="Max"
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all duration-200"
        />
      </div>
    );
  }

  // Handle specific boolean columns with custom labels
  if (typeof firstValue === "boolean" || column.id === "active" || column.id === "hasCurrentYearPoints") {
    let options = [
      { value: "", label: "Vše" },
      { value: "true", label: "Ano" },
      { value: "false", label: "Ne" }
    ];

    // Custom labels for specific columns
    if (column.id === "active") {
      options = [
        { value: "", label: "Vše" },
        { value: "true", label: "Aktivní" },
        { value: "false", label: "Neaktivní" }
      ];
    } else if (column.id === "hasCurrentYearPoints") {
      options = [
        { value: "", label: "Vše" },
        { value: "true", label: "S body" },
        { value: "false", label: "Bez bodů" }
      ];
    }

    return (
      <select
        value={columnFilterValue?.toString() ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "") {
            column.setFilterValue(undefined);
          } else {
            column.setFilterValue(value === "true");
          }
        }}
        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all duration-200"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  // Add special case for status columns
  if (column.id === "status" && (firstValue === "ACTIVE" || firstValue === "CLOSED")) {
    return (
      <select
        value={(columnFilterValue as string) ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          column.setFilterValue(value === "" ? undefined : value);
        }}
        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all duration-200"
      >
        <option value="">Vše</option>
        <option value="ACTIVE">Aktivní</option>
        <option value="CLOSED">Uzavřené</option>
      </select>
    );
  }

  return (
    <DebouncedInput
      type="text"
      value={(columnFilterValue as string) ?? ""}
      onChange={value => column.setFilterValue(value)}
      placeholder="Hledat..."
      debounceTime={300}
    />
  );
} 