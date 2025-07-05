'use client';
import Link from "next/link";
import Card from "@/components/ui/mtui";
import Typography from "@/components/ui/typography";
import { accountService } from "@/lib/services/account";
import { Suspense, useEffect, useState } from "react";
import MyTable from "@/components/tables/baseTable";
import Loader from "@/components/ui/loader";
import { ColumnDef } from "@tanstack/react-table";
import PageComponent from "@/components/features/detailPage/pageComponent";
import React from "react";

// Define Account type based on what we need for the table
interface Account {
   id: string;
   customer: {
      fullName: string;
      registrationNumber: string;
   };
   lifetimePoints: number;
   currentYearPoints: number;
}

// Table content with data fetching
function AccountTableWithData() {
   const [accounts, setAccounts] = useState<Account[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         try {
            const response = await fetch('/api/accounts');
            if (!response.ok) {
               throw new Error("Failed to fetch accounts");
            }
            const data = await response.json();

            setAccounts(data);
         } catch (error) {
            console.error("Error fetching accounts:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   const columns = React.useMemo<ColumnDef<Account>[]>(
      () => [
         {
            accessorKey: "customer.fullName",
            header: "Jméno",
            filterFn: "auto",
            cell: ({ row }) => (
               <Link
                  href={`/accounts/${row.original.id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
               >
                  {row.original.customer.fullName}
               </Link>
            ),
         },
         {
            accessorKey: "customer.registrationNumber",
            header: "Registrační číslo",
         },
         {
            accessorKey: "lifetimePoints",
            header: "Klubové konto",
            filterFn: "auto",
         },
         {
            accessorKey: "currentYearPoints",
            header: "Roční konto",
            filterFn: "auto",
         },
         {
            id: "savingPeriods",
            header: "Akce",
            cell: ({ row }) => (
               <Link
                  href={`/accounts/${row.original.id}/saving-periods`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
               >
                  Šetřící období
               </Link>
            ),
         }
      ],
      []
   );

   if (loading) {
      return <Loader />;
   }

   return (
      <MyTable
         data={accounts}
         columns={columns}
         tableName="Seznam účtů"
      />
   );
}

export default function AccountsPage() {
   return (
      <PageComponent>
         <Typography variant="h2" color="black" className="mb-6">
            Seznam účtů
         </Typography>
         
         <Suspense fallback={<div className="w-full flex justify-center p-8"><Loader /></div>}>
            <AccountTableWithData />
         </Suspense>
      </PageComponent>
   );
} 