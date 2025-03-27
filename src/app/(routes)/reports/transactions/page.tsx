'use client'

import ReportObratTable from "@/components/features/reports/obratTable"
import Skeleton from "@/components/ui/skeleton";
import { SeznamObratuDTO } from "@/lib/services/customer/types";
import { useEffect, useState } from "react";


export default function TransactionsReportPage() {

   const [customers, setCustomers] = useState<SeznamObratuDTO[]>([]);

   const fetchCustomers = async () => {
      const endpoint = '/api/transactions/report-obratu';
      const response = await fetch(endpoint);
      const data = await response.json();
      setCustomers(data);
   }

   useEffect(() => {
      fetchCustomers();
   }, []);


   return (
      <div className="w-full p-6 my-2">
         {customers.length === 0 ? (
            <Skeleton className="h-96" type="table" />
         ) : (
            <ReportObratTable defaultData={customers} detailLinkPath="/customers" />
         )}
      </div>
   )
}
