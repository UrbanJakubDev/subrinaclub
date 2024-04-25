"use client";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
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

export default function DealerTable({ defaultData, detailLinkPath }: Props) {
  // Column definitions
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
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
        accessorKey: "note",
        header: "Poznámka",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "action",
        header: "Akce",
        cell: (row) => (
          <div className="flex justify-center gap-2">
            <Link
              href={`${detailLinkPath}/${row.row.original.id}`}
              className="text-center"
            >
              <Button>
                <FontAwesomeIcon icon={faPenToSquare} />
                {/* {row.row.original.id} */}
              </Button>
            </Link>
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