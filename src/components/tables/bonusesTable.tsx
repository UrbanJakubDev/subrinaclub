"use client"
import { faPenToSquare, faChartSimple, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@material-tailwind/react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";
import MyTable from "./ui/baseTable";
import { useModal } from "@/contexts/ModalContext";
import { toast } from "react-toastify";

type Props = {
   defaultData: any[];
   detailLinkPath?: string;
};


export default function BonusesTable({ defaultData, detailLinkPath }: Props) {

   const tableName = "bonus";

   // Get modal context
   const { handleOpenModal, setModalSubmitted } = useModal();
   const onEdit = (data: any) => {
      handleOpenModal("bonusFormModal", data);
   }

   const onAdd = () => {
      handleOpenModal("bonusFormModal", {});
   }

   const deleteBonus = async (id: number) => {
      try {
         const response = await fetch(`/api/dictionaries/bonuses/${id}`, {
            method: "DELETE",
         });
         if (!response.ok) {
            throw new Error("Error deleting bonus");
         }
         const data = await response.json();
         return data;
      } catch (error) {
         console.error("Failed to delete bonus", error);
      }
   }

   const onDelete = (id: number) => {
      if (confirm('Opravdu chcete smazat tento bonus?')) {
         deleteBonus(id);
         toast.success("Bonus byl smazán");
         setModalSubmitted(true);
      }
   };

   // Column definitions
   const columns = React.useMemo<ColumnDef<any>[]>(
      () => [
         {
            accessorKey: "id",
            header: "ID",
            cell: (info) => info.getValue(),
            filterFn: "auto",
         },
         {
            accessorKey: "name",
            header: "Název",
            cell: (info) => info.getValue(),
            filterFn: "auto",
         },
         {
            accessorKey: "description",
            header: "Popis",
            cell: (info) => info.getValue(),
         },
         {
            accessorKey: "points",
            header: "Body",
            cell: (info) => info.getValue(),
         },
         {
            accessorKey: "price",
            header: "Hodnota",
            cell: (info) => info.getValue(),
         },
         {
            accessorKey: "action",
            header: "Akce",
            cell: (row) => (
               <div className="flex gap-1">
                  <div className="flex justify-center gap-2">
                     <Button onClick={() => onEdit(row.row.original)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                     </Button>
                     <Button onClick={() => onDelete(row.row.original.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                     </Button>
                  </div>
               </div>
            ),
            enableColumnFilter: false,
         },
      ],
      []
   );

   const [data, _setData] = React.useState(() => [...defaultData]);

   return (
      <>
         <MyTable
            {...{
               data,
               columns,
               tableName,
               addBtn: true,
               onAddClick: onAdd,
            }}
         />
      </>
   );
}
