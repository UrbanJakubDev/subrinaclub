'use client';

import ServerStatus from "@/components/ui/serverStatus";
import Card from "@/components/ui/mtui";
import Skeleton from "@/components/ui/skeleton";
import Typography from "@/components/ui/typography";
import { useCustomer } from "@/lib/queries/customer/queries";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from 'react';
import { toast } from "react-toastify";

const formatDate = (date: string | Date | null) => {
   if (!date) return "...";
   const dateObj = typeof date === 'string' ? new Date(date) : date;
   return dateObj.toLocaleDateString('cs-CZ');
};

const CustomerCard = ({ customer_id }: { customer_id: number }) => {

   const params = useParams();
   const customerId = customer_id || params.id;

   const { data, isLoading, isError } = useCustomer(parseInt(customerId as string));

   // Access the values like this:
   const customerData = data?.data;
   const metadata = data?.metadata;


   if (isLoading || !customerData || !metadata) return <Skeleton className="w-1/4" />;

   if (isError) {
      toast.error("Nastala chyba při načítání zákazníka");
   };

   return (
      <Card className="p-8 border-gray-300 rounded-sm w-1/3">
         <Typography variant="h2" color="black">{customerData.registrationNumber} - {customerData.fullName}</Typography>
         <ServerStatus systemStatus={customerData.active} lastUpdated={metadata?.loadedAt || 'N/A'} id={customerData.id} />
         <div className="flex py-4 gap-4">
            <article>
               <Typography variant="h5" color="black">Osobní informace</Typography>
               <p>IČO: {customerData.ico}</p>
               <p>Registrován od: {formatDate(customerData.registratedSince)}</p>
               <p>Datum narození: {formatDate(customerData.birthDate)}</p>
            </article>
            <article>
               <Typography variant="h5" color="black">Kontaktní informace</Typography>
               <p>Email: {customerData.email || "..."}</p>
               <p>Telefon: {customerData.phone || "..."}</p>
               <p>Jméno Salonu: {customerData.salonName || "..."}</p>
               <p>Adresa: {customerData.address || "..."}</p>
               <p>Město: {customerData.town || "..."}</p>
               <p>PSČ: {customerData.psc || "..."}</p>
            </article>
         </div>
         <div className="">
            <div className="max-w-1/2">
               <p>Obchodní zástupce: <Link href={`/sales-managers/${customerData.salesManagerId}/stats`} className="text-blue-600 hover:text-blue-800 hover:underline">{customerData.salesManager?.fullName || "..."}</Link></p>
               <p>Od: {customerData.salesManagerSinceYear ? `${customerData.salesManagerSinceYear} / 0${customerData.salesManagerSinceQ}` : "..."}</p>
            </div>
            <div className="max-w-1/2">
               <p>Velkoobchod: {customerData?.dealer?.fullName || "..."}</p>
            </div>
         </div>
         <div className="max-w-1/2">
            <Typography variant="h5" color="black">Poznámka</Typography>
            <p>{customerData.note || "..."}</p>
         </div>
      </Card>
   );
}

export default CustomerCard;