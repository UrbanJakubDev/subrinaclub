"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";
import Button from "../ui/button";
import MyTable from "./ui/baseTable";
import { Card } from "@material-tailwind/react";
import { faAddressCard, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "customerFullName",
        header: "Jméno",
        cell: (info) => info.getValue(),
        filterFn: "auto",
      },
      {
        accessorKey: "dealerName",
        header: "Jméno Obchodníka",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "sumQ1",
        header: "Suma za Q1",
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
      },
      {
        accessorKey: "sumQ2",
        header: "Suma za Q2",
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
      },
      {
        accessorKey: "sumQ3",
        header: "Suma za Q3",
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
      },
      {
        accessorKey: "sumQ4",
        header: "Suma za Q4",
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
      },
      {
        accessorKey: "totalPoints",
        header: "Klubové konto",
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
      },
      {
        accessorKey: "actions",
        header: "Akce",
        cell: (info) => (
          <Link href={`/users/${info.row.original.customerID}/stats`}>
            <Button size="sm" className="font-light"><FontAwesomeIcon icon={faUser} style={{color: "#ffffff",}} /> Detail </Button>
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
