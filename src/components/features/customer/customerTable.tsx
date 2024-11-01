"use client";;
import { faChartSimple, faCheck, faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";
import MyTable from "../../tables/ui/baseTable";
import { Button, Chip } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { transform } from "next/dist/build/swc";
import { format } from "path";
import formatThousandDelimiter from "@/utils/formatFncs";
import ActionButtons from "@/components/tables/ui/actionButtons";
import StatusChip from "@/components/tables/ui/statusChip";

type Props = {
  defaultData: any[];
  detailLinkPath?: string;
};

export default function CustomerTable({ defaultData, detailLinkPath }: Props) {

  const router = useRouter()
  const tableName = "zákazník";

  // Render Chip
  const ChipComponent = ({ value }: { value: any }) => {
    if (value > 2500) {
      return (
        <div className="flex items-center">
          <Chip value={value} className="text-center bg-royal-gold text-gray-900" />
        </div>
      );
    } else if (value > 1200) {
      return (
        <div className="flex items-center">
          <Chip value={value} className="text-center bg-chrome-silver text-gray-900" />
        </div>
      );
    } else {
      return value;
    }
  };



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
        filterFn: "auto",
      },
      {
        accessorKey: "fullName",
        header: "Jméno",
        filterFn: "auto",
      },
      {
        accessorKey: "salonName",
        header: "Salón",
      },
      {
        accessorKey: "address",
        header: "Adresa",
      },
      {
        accessorKey: "town",
        header: "Město",
      },
      {
        accessorKey: "psc",
        header: "PSČ",
      },
      {
        accessorKey: "phone",
        header: "Telefon",
      },

      {
        accessorKey: "ico",
        header: "IČ",
      },
      {
        accessorKey: "salesManager",
        header: "OZ",
        filterFn: "includesString"
      },
      {
        accessorKey: "dealer",
        header: "Velkoobchod",
        filterFn: "includesString"
      },
      {
        accessorKey: "currentYearPoints",
        header: "Roční konto",
        cell: (info) => info.getValue(),
        footer: (info) => {
          const total = info.table.getFilteredRowModel().rows.reduce(
            (sum, row) => sum + row.getValue<number>('currentYearPoints'),
            0
          );
          return `${formatThousandDelimiter(total)}`;
        },
      },
      {
        accessorKey: "totalPoints",
        header: "Klubové konto",
        cell: (info) => (<ChipComponent value={info.getValue()} />),
        footer: (info) => {
          const total = info.table.getFilteredRowModel().rows.reduce(
            (sum, row) => sum + row.getValue<number>('totalPoints'),
            0
          );
          return `${formatThousandDelimiter(total)}`;
        },
      },
      {
        accessorKey: "pointsInActiveSavingPeriod",
        header: "Průběžné konto",
        footer: (info) => {
          const total = info.table.getFilteredRowModel().rows.reduce(
            (sum, row) => sum + row.getValue<number>('pointsInActiveSavingPeriod'),
            0
          );
          return `${formatThousandDelimiter(total)}`;
        },
      },
      {
        accessorKey: "lastTransactionYear",
        header: "Posledni aktivita",
      },
      {
        accessorKey: "hasCurrentYearPoints", // Keep the raw boolean value here
        header: "Aktivní",
        cell: ({ getValue }) => <StatusChip status={getValue()} />,
        filterFn: (row, columnId, filterValue) => {
          const cellValue = row.getValue(columnId);
          // Convert filterValue to a boolean
          const boolFilterValue = filterValue === "true";
          // Return true if the cell value matches the filter value or no filter is applied
          return filterValue === "" || cellValue === boolFilterValue;
        },
      },
      {
        accessorKey: "action",
        header: "",
        cell: ({ row }) => (
          <ActionButtons
            id={row.original.id}
            detailLinkPath={detailLinkPath}
            hasStats
          />
        ),
        enableColumnFilter: false,
        enableSorting: false,
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
          tableName,
          addBtn: true,
          onAddClick: () => {
            router.push(`${detailLinkPath}/0`);
          }
        }}
      />
    </>
  );
}
