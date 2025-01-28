'use client';
import Loader from "@/components/ui/loader";
import { Card, Switch, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import CustomerTable from "./customerTable";
import { toast } from "react-toastify";

// Define the Customer type locally to match the table's requirements
interface Customer {
   id: string;
   active: boolean;
   registrationNumber: string;
   fullName: string;
   salonName: string;
   address?: string;
   town?: string;
   psc?: string;
   phone?: string;
   ico?: string;
   salesManager?: {
      fullName: string;
   };
   dealer?: {
      fullName: string;
   };
   account?: {
      currentYearPoints: number;
      lifetimePoints: number;
      savingPeriodAvailablePoints: number;
   };
}

type Props = {
   initialData: Customer[]
}

export default function OverviewDataWrapper({ initialData }: Props) {
   const [data, setData] = useState(initialData);
   const [loading, setLoading] = useState(false);
   const [activeUsers, setActiveUsers] = useState(true);

   const fetchData = async (activeFlag: boolean) => {
      setLoading(true);
      try {
         const response = await fetch(`/api/customers?active=${activeFlag}`);
         if (!response.ok) {
            throw new Error("Failed to fetch customers");
         }
         const fetchedData = await response.json();
         // Transform the data to match the expected structure
         const formattedData = fetchedData.map((customer: any) => ({
            ...customer,
            id: customer.id.toString(),
            account: {
               ...customer.account,
               // Transform the nested savingPeriod.availablePoints to savingPeriodAvailablePoints
               savingPeriodAvailablePoints: customer.account?.savingPeriod?.availablePoints ?? 0
            }
         }));
         setData(formattedData);
      } catch (error) {
         console.error("Error fetching customers:", error);
         toast.error("Nepodařilo se načíst seznam zákazníků");
      } finally {
         setLoading(false);
      }
   }

   // Handle active users switch
   const handleActiveUsers = () => {
      const newActiveUsers = !activeUsers;
      setActiveUsers(newActiveUsers);
      fetchData(newActiveUsers);
   }

   // We don't need the useEffect anymore since we:
   // 1. Have initial data from the server
   // 2. Only fetch when the switch changes

   if (loading) {
      return <Loader />;
   }

   return (
      <>
         <Card className="w-full mb-4 p-6 flex flex-row justify-between">
            <Switch
               label={`Zobrazit ${activeUsers ? "aktivní" : "neaktivní"} zákazníky`}
               onChange={handleActiveUsers}
               checked={activeUsers}
               crossOrigin={undefined} />
         </Card>
         {data && <CustomerTable defaultData={data} detailLinkPath="/customers" />}
      </>
   );
}
