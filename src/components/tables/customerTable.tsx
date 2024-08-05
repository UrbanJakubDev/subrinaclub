"use client";
import { faChartSimple, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";
import MyTable from "./ui/baseTable";
import { Button } from "@material-tailwind/react";

type Props = {
  defaultData: any[];
  detailLinkPath?: string;
};

export default function CustomerTable({ defaultData, detailLinkPath }: Props) {

   // Change the data registrationNumber to a string
    defaultData.forEach((row) => {
        row.registrationNumber = row.registrationNumber.toString();
    });

  // Column definitions
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "registrationNumber",
        header: "R.Č.",
        cell: (info) => info.getValue(),
        filterFn: "auto",
      },
      {
        accessorKey: "fullName",
        header: "Jméno",
        cell: (info) => info.getValue(),
        filterFn: "auto",
      },
      {
        accessorKey: "salonName",
        header: "Salón",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "address",
        header: "Adresa",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "town",
        header: "Město",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "psc",
        header: "PSČ",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "ico",
        header: "IČ",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "salesManager",
        header: "OZ",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "totalPoints",
        header: "Klubové konto",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "currentYearPoints",
        header: "Body posledni rok",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "lastTransactionYear",
        header: "Posledni aktivita",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "hasCurrentYearPoints",
        header: "Aktivní",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "action",
        header: "Akce",
        cell: (row) => (
          <div className="flex gap-1">
            <div className="flex justify-center gap-2">
              <Link
                href={`${detailLinkPath}/${row.row.original.id}`}
                className="text-center"
              >
                <Button size="sm">
                  <FontAwesomeIcon icon={faPenToSquare} />
                  {/* {row.row.original.id} */}
                </Button>
              </Link>
            </div>
            <div className="flex justify-center gap-2">
              <Link
                href={`${detailLinkPath}/${row.row.original.id}/stats`}
                className="text-center"
              >
                <Button size="sm">
                  <FontAwesomeIcon icon={faChartSimple} />
                  {/* {row.row.original.id} */}
                </Button>
              </Link>
            </div>
          </div>
        ),
        enableColumnFilter: false,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [data, _setData] = React.useState(() => [...defaultData]);

  return (
    <>
      <MyTable
        {...{
          data,
          columns,
        }}
      />
    </>
  );
}
