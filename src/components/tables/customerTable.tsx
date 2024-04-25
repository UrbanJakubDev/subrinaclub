"use client";
import { faChartSimple, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";
import MyTable from "./ui/baseTable";
import Button from "../ui/button";

type Props = {
  defaultData: any[];
  detailLinkPath?: string;
};

export default function CustomerTable({ defaultData, detailLinkPath }: Props) {
  // Column definitions
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "registrationNumber",
        header: "Registrační číslo",
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
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
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "ic",
        header: "IČ",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "poznamka",
        header: "Poznámka",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "action",
        header: "Akce",
        cell: (row) => (
          <div className="flex">
            <div className="flex justify-center gap-2">
              <Link
                href={`${detailLinkPath}/${row.row.original.id}`}
                className="text-center"
              >
                <Button variant="danger">
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
                <Button variant="primary">
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
