import StatusChip from "@/components/tables/ui/statusChip";
import Card from "@/components/ui/mtui";
import Typography from "@/components/ui/typography";
import { CustomerCardProps } from "@/lib/services/customer/types";
import React from 'react';



const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => {
   return (
      <Card className="p-8 border-gray-300 rounded-sm">
         <Typography variant="h2" color="black">{customer.fullName}</Typography>
         <div className="flex gap-2">
         <StatusChip status={customer.active} /><span> Registrační číslo - {customer.registrationNumber}</span> 
         </div>



         <div className="flex py-4 gap-4">


            <article>
               <Typography variant="h5" color="black">Osobní informace</Typography>
               <p>IČO: {customer.ico}</p>
               <p>Registrován od: {customer.registratedSince?.toLocaleDateString()}</p>
               <p>Datum narození: {customer.birthDate?.toLocaleDateString()}</p>
            </article>

            <article>
               <Typography variant="h5" color="black">Kontaktní informace</Typography>
               <p>Email: {customer.email}</p>
               <p>Telefon: {customer.phone}</p>
               <p>Jméno Salonu: {customer.salonName}</p>
               <p>Adresa: {customer.address}</p>
               <p>Město: {customer.town}</p>
               <p>PSČ: {customer.psc}</p>

            </article>
         </div>

         <Typography variant="h5" color="black">Poznámka</Typography>
         <p>{customer.note || "..."}</p>

      </Card>
   );
};

export default CustomerCard;