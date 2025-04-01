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

   const { data: customer, isLoading, isError, isPending } = useCustomer(parseInt(customerId as string));


   if (isLoading || !customer || isPending) return <Skeleton className="w-1/4" />;

   if (isError) {
      toast.error("Nastala chyba při načítání zákazníka");
   };

   return (
      <Card className="p-8 border-gray-300 rounded-sm w-1/3">
         <Typography variant="h2" color="black">{customer.data.registrationNumber} - {customer.data.fullName}</Typography>
         <ServerStatus systemStatus={customer.data.active} lastUpdated={customer.metadata.loadedAt} id={customer.data.id} />
         <div className="flex py-4 gap-4">
            <article>
               <Typography variant="h5" color="black">Osobní informace</Typography>
               <p>IČO: {customer.data.ico}</p>
               <p>Registrován od: {formatDate(customer.data.registratedSince)}</p>
               <p>Datum narození: {formatDate(customer.data.birthDate)}</p>
            </article>
            <article>
               <Typography variant="h5" color="black">Kontaktní informace</Typography>
               <p>Email: {customer.data.email || "..."}</p>
               <p>Telefon: {customer.data.phone || "..."}</p>
               <p>Jméno Salonu: {customer.data.salonName || "..."}</p>
               <p>Adresa: {customer.data.address || "..."}</p>
               <p>Město: {customer.data.town || "..."}</p>
               <p>PSČ: {customer.data.psc || "..."}</p>
            </article>
         </div>
         <div className="">
            <div className="max-w-1/2">
               <p>Obchodní zástupce: <Link href={`/sales-managers/${customer.data.salesManagerId}/stats`} className="text-blue-600 hover:text-blue-800 hover:underline">{customer.data.salesManager?.fullName || "..."}</Link></p>
               <p>Od: {customer.data.salesManagerSinceYear ? `${customer.data.salesManagerSinceYear} / 0${customer.data.salesManagerSinceQ}` : "..."}</p>

            </div>
            <div className="max-w-1/2">
               <p>Velkoobchod: {customer.data?.dealer?.fullName || "..."}</p>
            </div>
         </div>
         <div className="max-w-1/2">
            <Typography variant="h5" color="black">Poznámka</Typography>
            <p>{customer.data.note || "..."}</p>
         </div>
      </Card>
   );
}

export default CustomerCard;