"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import React from "react";
import MyTable, { getFooterValue } from "@/components/tables/ui/baseTable";
import { Button } from "@material-tailwind/react";
import { Card } from "@material-tailwind/react";
import { faAddressCard, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import formatThousandDelimiter from "@/lib/utils/formatFncs";

type CustomerData = {
  id: number;
  publicId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  birthDate: string | null;
  registrationNumber: string | number;
  ico: string | null;
  phone: string | null;
  email: string | null;
  registratedSince: string | null;
  salonName: string | null;
  address: string | null;
  town: string | null;
  psc: string | null;
  note: string | null;
  dealerId: number;
  salesManagerId: number | null;
  salesManagerSinceQ: number;
  salesManagerSinceYear: number;
  dealer: {
    id: number;
    active: boolean;
    fullName: string;
    registrationNumber: number;
  };
  salesManager: null | {
    id: number;
    fullName: string;
  };
  account: {
    id: number;
    active: boolean;
    lifetimePoints: number;
    currentYearPoints: number;
    totalDepositedPoints: number;
    totalWithdrawnPonits: number;
    customerId: number;
    savingPeriods: Array<{
      id: number;
      status: string;
      startYear: number;
      startQuarter: number;
      endYear: number;
      endQuarter: number;
      availablePoints: number;
    }>;
  };
  transactions: Array<{
    id: number;
    points: number;
    quarter: number;
    year: number;
  }>;
  quarterSums: {
    Q1: number;
    Q2: number;
    Q3: number;
    Q4: number;
  };
};

type Props = {
  defaultData: CustomerData[];
  detailLinkPath?: string;
  selectedQuarter: number;
  selectedYear: number;
};

export default function SalesManagerStatsTable({
  defaultData,
  detailLinkPath,
  selectedQuarter,
  selectedYear,
}: Props) {
  const tableName = "Sales Manager Stats";

  // Column definitions
  const columns = React.useMemo<ColumnDef<CustomerData>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Jméno salonu",
      },
      {
        accessorKey: "registrationNumber",
        header: "Registrační číslo",
        cell: ({ getValue }) => String(getValue() || ''),
      },
      {
        accessorKey: "address",
        header: "Adresa",
        cell: ({ getValue }) => getValue() || '-',
      },
      {
        accessorKey: "town",
        header: "Město",
        cell: ({ getValue }) => getValue() || '-',
      },
      {
        accessorKey: "psc",
        header: "PSČ",
        cell: ({ getValue }) => getValue() || '-',
      },
      {
        accessorKey: "phone",
        header: "Telefon",
        filterFn: "auto",
        cell: ({ getValue }) => getValue() || '-',
      },
      {
        accessorKey: "dealer.fullName",
        header: "Jméno Obchodníka",
      },
   
      {
        accessorKey: "quarterSums.Q1",
        header: "Q1",
        cell: ({ getValue }) => formatThousandDelimiter(getValue<number>() || 0),
        footer: (props) => getFooterValue('sum', props),
      },
      {
        accessorKey: "quarterSums.Q2",
        header: "Q2",
        cell: ({ getValue }) => formatThousandDelimiter(getValue<number>() || 0),
        footer: (props) => getFooterValue('sum', props),
      },
      {
        accessorKey: "quarterSums.Q3",
        header: "Q3",
        cell: ({ getValue }) => formatThousandDelimiter(getValue<number>() || 0),
        footer: (props) => getFooterValue('sum', props),
      },
      {
        accessorKey: "quarterSums.Q4",
        header: "Q4",
        cell: ({ getValue }) => formatThousandDelimiter(getValue<number>() || 0),
        footer: (props) => getFooterValue('sum', props),
      },
      {
        accessorKey: "account.lifetimePoints",
        header: "Klubové konto",
        cell: ({ getValue }) => formatThousandDelimiter(getValue<number>() || 0),
        footer: (props) => getFooterValue('sum', props),
      },
      {
        accessorKey: "currentYearPoints",
        header: `Roční konto ${selectedYear}`,
        cell: ({ getValue }) => formatThousandDelimiter(getValue<number>() || 0),
        footer: (props) => getFooterValue('sum', props),
      },
      {
        accessorKey: "account.averagePointsBeforeSalesManager",
        header: "Průměr za 4Q",
        cell: ({ getValue }) => formatThousandDelimiter(getValue<number>() || 0),
      },
      {
        accessorKey: "selectedQuarterDifference",
        header: `Rozdíl od ${selectedQuarter}Q ${selectedYear}`,
        cell: ({ getValue }) => formatThousandDelimiter(getValue<number>() || 0),
        footer: (props) => getFooterValue('sum', props),
      },
      {
        accessorKey: "actions",
        header: "Akce",
        cell: ({ row }) => (
          <Link href={`/customers/${row.original.id}/stats`}>
            <Button size="sm" className="font-light"><FontAwesomeIcon icon={faUser} style={{ color: "#ffffff", }} /> Detail </Button>
          </Link>
        ),
        enableColumnFilter: false,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [data] = React.useState<CustomerData[]>(() => [...defaultData]);

  return (
    <MyTable
      {...{
        data,
        columns,
        tableName,
        
      }}
    />
  );
}
