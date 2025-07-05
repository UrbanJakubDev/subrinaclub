"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ColumnDef } from "@tanstack/react-table";
import { deleteBonusServerAction, refreshBonusesDataServerAction } from "@/actions/bonus";
import ActionButtons from "@/components/tables/ui/ActionButtons";
import MyTable from "@/components/tables/baseTable";

type Props = {
  defaultData: any[];
  detailLinkPath?: string;
};

export default function BonusesTable({ defaultData, detailLinkPath }: Props) {
  const router = useRouter();
  const [data, setData] = useState(() => [...defaultData]);

  const handleAddClick = () => {
    router.push("/dictionaries/bonus/new");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this bonus?")) {
      try {
        await deleteBonusServerAction(id);
        await refreshBonusesDataServerAction();
        setData(data.filter(item => item.id !== id));
        toast.success("Bonus deleted successfully");
        router.refresh();
      } catch (error) {
        console.error("Error deleting bonus:", error);
        toast.error("Failed to delete bonus");
      }
    }
  };

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      { accessorKey: "id", header: "ID", filterFn: "auto" },
      { accessorKey: "name", header: "Název", filterFn: "auto" },
      { accessorKey: "description", header: "Popis" },
      { accessorKey: "points", header: "Body" },
      { accessorKey: "price", header: "Hodnota" },
      {
        accessorKey: "action",
        header: "Akce",
        cell: ({ row }) => (
          <ActionButtons 
            id={row.original.id} 
            detailLinkPath={detailLinkPath} 
            deleteAction={handleDelete}
          />
        ),
        enableColumnFilter: false,
      },
    ],
    [detailLinkPath]
  );

  return (
    <MyTable
      data={data}
      columns={columns}
      tableName="bonus"
      addBtn={true}
      onAddClick={handleAddClick}
    />
  );
}