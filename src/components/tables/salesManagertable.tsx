"use client";
import { faChartSimple, faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";
import MyTable from "./ui/baseTable";
import Button from "../ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/contexts/ModalContext";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";

type Props = {
  defaultData: any[];
  detailLinkPath?: string;
};

export default function SalesManagerTable({
  defaultData,
  detailLinkPath,
}: Props) {

  // Get router
  const router = useRouter();

  const tableName = "salesManager";

  // Get modal context
  const { handleOpenModal, setModalSubmitted } = useModal();

  const handleEdit = (data: any) => {
    router.push(`/sales-managers/${data.id}`);
  }

  const handleAdd = () => {
    router.push("/sales-managers/new");
  }

  const onDelete = (id: number) => {
  }


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
        accessorKey: "active",
        header: "Aktivní v systému",
        cell: ({ getValue }) => {
          const value = getValue();
          return value ? (
            <FontAwesomeIcon icon={faCheck} style={{ color: "#00ff00" }} />
          ) : (
            <FontAwesomeIcon icon={faXmark} style={{ color: "#ff0000" }} />
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue = row.getValue(columnId);
          // Convert filterValue to a boolean
          const boolFilterValue = filterValue === "true";
          // Return true if the cell value matches the filter value or no filter is applied
          return filterValue === "" || cellValue === boolFilterValue;
        },
      },
      {
        accessorKey: "registrationNumber",
        header: "Registrační číslo",
        cell: (info) => info.getValue(),
        enableColumnFilter: false,
      },
      {
        accessorKey: "ico",
        header: "IČO",
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
        accessorKey: "phone",
        header: "Telefon",
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
          <div className="flex gap-2 justify-end">
            <Link
              href={`${detailLinkPath}/${row.row.original.id}`}
              className="text-center"
            >
              <Button size="sm">
                <FontAwesomeIcon icon={faPenToSquare} />
                {/* {row.row.original.id} */}
              </Button>
            </Link>
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
        ),
        enableColumnFilter: false,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [data, _setData] = React.useState(() => [...defaultData]);

  return (

    <MyTable
      {...{
        data,
        columns,
        tableName,
        addBtn: true,
        onAddClick: handleAdd,
      }}
    />

  );
}
