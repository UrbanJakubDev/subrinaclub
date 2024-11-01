"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import MyTable from "../../tables/ui/baseTable";
import ActionButtons from "../../tables/ui/actionButtons";

type DealerData = {
  id: string;
  fullName: string;
  note: string;
};

type DealerTableProps = {
  defaultData: DealerData[];
  detailLinkPath?: string;
};

const useTableColumns = (detailLinkPath?: string): ColumnDef<DealerData>[] => {
  return React.useMemo(() => [
    {
      accessorKey: "id",
      header: "ID",
      enableColumnFilter: false,
    },
    {
      accessorKey: "fullName",
      header: "Jméno",
      filterFn: "auto",
    },
    {
      accessorKey: "note",
      header: "Poznámka",
      filterFn: "auto",
    },
    {
      accessorKey: "actions",
      header: "Akce",
      cell: ({ row }) => (
        <ActionButtons id={row.original.id} detailLinkPath={detailLinkPath} />
      ),
      enableColumnFilter: false,
    },
  ], [detailLinkPath]);
}

export function DealerTable({
  defaultData,
  detailLinkPath
}: DealerTableProps) {
  const router = useRouter();
  const columns = useTableColumns(detailLinkPath);
  const [data] = React.useState<DealerData[]>(() => [...defaultData]);

  const handleAdd = React.useCallback(() => {
    router.push("/dictionaries/dealers/new");
  }
    , [router]);

  return <MyTable
    data={data}
    columns={columns}
    addBtn
    onAddClick={handleAdd} tableName={""}
  />;
}