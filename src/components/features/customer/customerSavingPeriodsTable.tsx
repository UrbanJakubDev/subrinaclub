"use client";;
import { faChartSimple, faCheck, faExclamation, faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";
import MyTable from "../../tables/ui/baseTable";
import { Button, Chip } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { transform } from "next/dist/build/swc";
import { format } from "path";
import formatThousandDelimiter from "@/lib/utils/formatFncs";
import ActionButtons from "@/components/tables/ui/actionButtons";
import StatusChip from "@/components/tables/ui/statusChip";

type Props = {
    defaultData: any[];
    detailLinkPath?: string;
};

export default function CustomerSavingPeriodsTable({ defaultData, detailLinkPath }: Props) {

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
                accessorKey: "ico",
                header: "IČ",
            },
            {
                accessorKey: "salesManager.fullName",
                header: "OZ",
                filterFn: "includesString"
            },
            {
                accessorKey: "account.lifetimePoints",
                header: "Klubové konto",
                cell: (info) => <ChipComponent value={info.getValue()} />,
                footer: (info) => {
                    const total = info.table
                        .getFilteredRowModel()
                        .rows.reduce(
                            (sum, row) => {
                                // Safely access the nested value
                                const points = row.original.account?.lifetimePoints ?? 0;
                                return sum + points;
                            },
                            0
                        );
                    return `${formatThousandDelimiter(total)}`;
                },
            },
            {
                accessorKey: "account.savingPeriod.availablePoints",
                header: "Body v šetřícím období",
                cell: (info) => <ChipComponent value={info.getValue()} />,
                footer: (info) => {
                    const total = info.table
                        .getFilteredRowModel()
                        .rows.reduce(
                            (sum, row) => {
                                // Safely access the nested value
                                const points = row.original.account?.lifetimePoints ?? 0;
                                return sum + points;
                            },
                            0
                        );
                    return `${formatThousandDelimiter(total)}`;
                },
            },
            {
                accessorKey: "account.id",
                header: "ID Účtu",
                accessorFn: (row) => {return row.account?.id.toString()}
            },

            {
                accessorKey: "account.active",
                header: "Status účtu",
                accessorFn: (row) => {
                    return row.account?.active ?? false;
                },
                cell: ({ getValue }) => <StatusChip status={getValue()} />,
                filterFn: (row, columnId, filterValue) => {
                    const cellValue = row.getValue(columnId);
                    const boolFilterValue = filterValue === "true";
                    return filterValue === "" || cellValue === boolFilterValue;
                },
            },
            {
                accessorKey: "account.savingPeriod.status",
                header: "Šetřící období",
                accessorFn: (row) => {
                    return row.account?.savingPeriod?.status === 'ACTIVE';
                },
                cell: ({ getValue }) => <StatusChip status={getValue()} />,
                filterFn: (row, columnId, filterValue) => {
                    const cellValue = row.getValue(columnId);
                    const boolFilterValue = filterValue === "true";
                    return filterValue === "" || cellValue === boolFilterValue;
                },
            },
            {
                accessorKey: "account.savingPeriod.startYear",
                header: "od Rok",
                accessorFn: (row) => {
                    return row.account?.savingPeriod?.startYear?.toString() ?? '';
                },
                filterFn: "auto"
            },
            {
                accessorKey: "account.savingPeriod.startQuarter",
                header: "od Q",
                accessorFn: (row) => {
                    return row.account?.savingPeriod?.startQuarter?.toString() ?? '';
                },
                filterFn: "auto"
            },
            {
                accessorKey: "account.savingPeriod.endYear",
                header: "do Rok",
                accessorFn: (row) => {
                    return row.account?.savingPeriod?.endYear?.toString() ?? '';
                },
                filterFn: "auto"
            },
            {
                accessorKey: "account.savingPeriod.endQuarter",
                header: "do Q",
                accessorFn: (row) => {
                    return row.account?.savingPeriod?.endQuarter?.toString() ?? '';
                },
                filterFn: "auto"
            },
            {
                accessorKey: "account.savingPeriod.endDateTime", 
                header: "Datum konce šetřícího období",
                cell: ({ getValue }) => {
                    const endDate = getValue() as string;
                    if (!endDate) return "";
                    const date = new Date(endDate)
                    return `${date.toLocaleDateString('cs-CZ', { timeZone: 'UTC' })}`;
                }
            },
            {
                accessorKey: "account.savingPeriod.daysLeft", 
                header: "Zbývá dní",
             
            },
            {
                accessorKey: "account.savingPeriod.endThisQuarter",
                header: "Končí tento Q",
                accessorFn: (row) => {
                    return row.account?.savingPeriod?.endThisQuarter ?? false;
                },
                cell: ({ getValue }) => getValue() ? <FontAwesomeIcon icon={faExclamation} style={{color: "#e61414"}} /> :"-",
                filterFn: (row, columnId, filterValue) => {
                    const cellValue = row.getValue(columnId);
                    const boolFilterValue = filterValue === "true";
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
                        router.push(`${detailLinkPath}/new`);
                    }
                }}
            />
        </>
    );
}
