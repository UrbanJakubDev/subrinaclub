"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import ActionButtons from "@/components/tables/ui/actionButtons";
import StatusChip from "@/components/tables/ui/statusChip";
import MyTable from "@/components/tables/ui/baseTable";
import StatusIcon from "@/components/tables/ui/statusIcon";
import Link from "next/link";


interface SalesManagerData {
  id: string;
  active: boolean;
  registrationNumber: string;
  ico: string;
  fullName: string;
  phone: string;
  note: string;
}

interface SalesManagerTableProps {
  defaultData: SalesManagerData[];
  detailLinkPath?: string;
}


const useTableColumns = (detailLinkPath?: string): ColumnDef<SalesManagerData>[] => {
  return React.useMemo(() => [
    // {
    //   accessorKey: "id",
    //   header: "ID",
    //   enableColumnFilter: false,
    // },
    {
      accessorKey: "active",
      header: "Aktivní v systému",
      cell: ({ getValue }) => <StatusIcon active={getValue() as boolean} />,
      filterFn: (row, columnId, filterValue) => {
        if (filterValue === "") return true;
        const cellValue = row.getValue(columnId);
        return cellValue === (filterValue === "true");
      },
    },
    {
      accessorKey: "registrationNumber",
      header: "Registrační číslo",
      enableColumnFilter: false,
    },
    {
      accessorKey: "ico",
      header: "IČO",
      enableColumnFilter: false,
    },
    {
      accessorKey: "fullName",
      header: "Jméno",
      filterFn: "auto",
      cell: ({ row }) => (
        <Link href={`/sales-managers/${row.original.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
          {row.original.fullName}
        </Link>
      ),
    },
    {
      accessorKey: "phone",
      header: "Telefon",
      filterFn: "auto",
    },
    {
      accessorKey: "note",
      header: "Poznámka",
    },
    {
      accessorKey: "action",
      header: "",
      cell: ({ row }) => (
        <ActionButtons 
          id={row.original.id} 
          detailLinkPath={detailLinkPath} 
          // hasStats
        />
      ),
      enableColumnFilter: false,
      enableSorting: false,
    },
  ], [detailLinkPath]);
};

export default function SalesManagerTable({
  defaultData,
  detailLinkPath,
}: SalesManagerTableProps) {
  const router = useRouter();
  const columns = useTableColumns(detailLinkPath);
  const [data] = React.useState<SalesManagerData[]>(() => [...defaultData]);
  const tableName = "Obchodní zástupci"

  const handleAdd = React.useCallback(() => {
    router.push("/sales-managers/new");
  }, [router]);

  return (
    <MyTable
      data={data}
      columns={columns}
      tableName={tableName}
      addBtn={true}
      onAddClick={handleAdd}
    />
  );
}