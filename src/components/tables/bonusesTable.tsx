"use client"
import { faPenToSquare, faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@material-tailwind/react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";
import MyTable from "./ui/baseTable";
import { useModal } from "@/contexts/ModalContext";

type Props = {
   defaultData: any[];
   detailLinkPath?: string;
};


export default function BonusesTable({ defaultData, detailLinkPath }: Props) {

   // Get modal context
   const { handleOpenModal } = useModal();
   const onEdit = (data: any) => {
      handleOpenModal("bonusFormModal", data);
   }

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
            accessorKey: "active",
            header: "Aktivní",
            cell: (info) => info.getValue(),
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
            }}
         />
      </>
   );
}
