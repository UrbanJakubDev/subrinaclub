'use client';
import CustomerTable from "@/components/tables/customerTable";
import Loader from "@/components/ui/loader";
import { Card, Switch, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";

type Props = {
   initialData: any[]
}

export default function OverviewDataWrapper({ initialData }: Props) {

   const [data, setData] = useState(initialData);
   const [loading, setLoading] = useState(false);
   const [activeUsers, setActiveUsers] = useState(true);

   const fetchData = async (activeFlag: boolean) => {
      setLoading(true);
      try {
         const response = await fetch(`/api/customers?active=${activeFlag}`);
         if (response.ok) {
            const fetchedData = await response.json();
            setData(fetchedData);
         } else {
            console.error("Failed to fetch customers");
         }
      } catch (error) {
         console.error("Error fetching customers:", error);
      } finally {
         setLoading(false);
      }
   }

   // Handle active users switch
   const handleActiveUsers = () => {
      setActiveUsers((prevActiveUsers) => !prevActiveUsers);
   }

   // Fetch data when active users switch is changed
   useEffect(() => {
      fetchData(activeUsers);
   }, [activeUsers]);

   if (loading) {
      return <Loader />;
   }

   return (
      <>
         <Card className="w-full mb-4 p-6 flex flex-row justify-between">
            <Typography variant="h5" color="black" >Seznam zákazníku</Typography>
            <Switch
               label={`Zobrazit ${activeUsers ? "aktivní" : "neaktivní"} zákazníky`}
               onChange={handleActiveUsers}
               checked={activeUsers} />
         </Card>
         {data && <CustomerTable defaultData={data} detailLinkPath="/customers" />}
      </>
   );
}
