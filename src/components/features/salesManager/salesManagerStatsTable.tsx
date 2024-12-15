"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";
import MyTable from "@/components/tables/ui/baseTable";
import { Button } from "@material-tailwind/react";
import { Card } from "@material-tailwind/react";
import { faAddressCard, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import formatThousandDelimiter from "@/lib/utils/formatFncs";

type Props = {
  defaultData: any[];
  detailLinkPath?: string;
};

export default function SalesManagerStatsTable({
  defaultData,
  detailLinkPath,
}: Props) {
  // Change type of the defaultData.registrationNumber to string
  defaultData.forEach((data) => {
    data.registrationNumber = data.registrationNumber.toString();
  });

  const tableName = "Sales Manager Stats";

  // Column definitions
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "registrationNumber",
        header: "Registrační číslo",
      },
      {
        accessorKey: "fullName",
        header: "Jméno salonu",
      },
      {
        accessorKey: "address",
        header: "Adresa",
      },
      {
        accessorKey: "town",
        header: "Město",
      },
      {
        accessorKey: "psc",
        header: "PSČ",
      },
      {
        accessorKey: "phone",
        header: "Telefon",
        filterFn: "auto",
      },
      {
        accessorKey: "dealer.fullName",
        header: "Jméno Obchodníka",
      },
      {
        accessorKey: "quarterSums.Q1",
        header: "Suma za Q1",
        footer: (info) => {
          const total = info.table.getFilteredRowModel().rows.reduce(
            (sum, row) => sum + row.getValue<number>('quarterSums.Q1'),
            0
          );
          return `${formatThousandDelimiter(total)}`;
        },
      },
      {
        accessorKey: "quarterSums.Q2",
        header: "Suma za Q2",
        cell: (info) => info.getValue(),
        footer: (info) => {
          const total = info.table.getFilteredRowModel().rows.reduce(
            (sum, row) => sum + row.getValue<number>('quarterSums.Q2'),
            0
          );
          return `${formatThousandDelimiter(total)}`;
        },
      },
      {
        accessorKey: "quarterSums.Q3",
        header: "Suma za Q3",
        cell: (info) => info.getValue(),
        footer: (info) => {
          const total = info.table.getFilteredRowModel().rows.reduce(
            (sum, row) => sum + row.getValue<number>('quarterSums.Q3'),
            0
          );
          return `${formatThousandDelimiter(total)}`;
        },
      },
      {
        accessorKey: "quarterSums.Q4",
        header: "Suma za Q4",
        cell: (info) => info.getValue(),
        footer: (info) => {
          const total = info.table.getFilteredRowModel().rows.reduce(
            (sum, row) => sum + row.getValue<number>('quarterSums.Q4'),
            0
          );
          return `${formatThousandDelimiter(total)}`;
        },
      },
      {
        accessorKey: "account.lifetimePoints",
        header: "Klubové konto",
      },
      {
        accessorKey: "actions",
        header: "Akce",
        cell: (info) => (
          <Link href={`/customers/${info.row.original.id}/stats`}>
            <Button size="sm" className="font-light"><FontAwesomeIcon icon={faUser} style={{ color: "#ffffff", }} /> Detail </Button>
          </Link>
        ),
        enableColumnFilter: false,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [data, _setData] = React.useState(() => [...defaultData]);

  return (
    <>
      <MyTable
        {...{
          data,
          columns,
          tableName,
        }}
      />
    </>
  );
}
