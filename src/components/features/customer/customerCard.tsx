import StatusChip from "@/components/tables/ui/statusChip";
import Card from "@/components/ui/mtui";
import Skeleton from "@/components/ui/skeleton";
import Typography from "@/components/ui/typography";
import { CustomerCardProps } from "@/lib/services/customer/types";
import React from 'react';

const formatDate = (date: string | Date | null) => {
   if (!date) return "...";
   const dateObj = typeof date === 'string' ? new Date(date) : date;
   return dateObj.toLocaleDateString('cs-CZ');
};

const CustomerCard = ({ customer, isLoading }: CustomerCardProps) => {
   if (isLoading || !customer) return <Skeleton className="w-1/4" />;
   return (
      <Card className="p-8 border-gray-300 rounded-sm w-1/3">
         <Typography variant="h2" color="black">{customer.registrationNumber} - {customer.fullName}</Typography>
         <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-500">Systém</span><StatusChip status={customer.active} /><span className="text-sm text-gray-500">ID -{customer.id}</span>
         </div>
         <div className="flex py-4 gap-4">
            <article>
               <Typography variant="h5" color="black">Osobní informace</Typography>
               <p>IČO: {customer.ico}</p>
               <p>Registrován od: {formatDate(customer.registratedSince)}</p>
               <p>Datum narození: {formatDate(customer.birthDate)}</p>
            </article>
            <article>
               <Typography variant="h5" color="black">Kontaktní informace</Typography>
               <p>Email: {customer.email || "..."}</p>
               <p>Telefon: {customer.phone || "..."}</p>
               <p>Jméno Salonu: {customer.salonName || "..."}</p>
               <p>Adresa: {customer.address || "..."}</p>
               <p>Město: {customer.town || "..."}</p>
               <p>PSČ: {customer.psc || "..."}</p>
            </article>
         </div>
         <div className="">
            <div className="max-w-1/2">
               <p>Obchodní zástupce: {customer.salesManager?.fullName || "..."}</p>
               <p>Od: {customer.salesManagerSinceQuarter || "..."}  {customer.salesManagerSinceYear || "..."}</p>
            </div>
            <div className="max-w-1/2">
               <p>Velkoobchod: {customer.dealer?.fullName || "..."}</p>
            </div>
         </div>
         <div className="max-w-1/2">
            <Typography variant="h5" color="black">Poznámka</Typography>
            <p>{customer.note || "..."}</p>
         </div>
      </Card>
   );
}

export default CustomerCard;