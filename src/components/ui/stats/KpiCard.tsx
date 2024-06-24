"use client"
import { Card, CardBody, Typography } from "@material-tailwind/react";

interface KpiCardPropsType {
   title: string;
   percentage: string;
   price: string;
   color: string;
   icon: React.ReactNode;
 }
 
 export function KpiCard({
   title,
   percentage,
   price,
   color,
   icon,
 }: KpiCardPropsType) {
   return (
     <Card className="shadow-sm border border-gray-200 !rounded-lg">
       <CardBody className="p-4">
         <div className="flex justify-between items-center">
           <Typography
             className="!font-medium !text-xs text-gray-600"
           >
             {title}
           </Typography>
           <div className="flex items-center gap-1">
             {icon}
             <Typography
               color={color as any}
                 className="font-medium !text-xs"
             >
               {percentage}
             </Typography>
           </div>
         </div>
         <Typography
           color="blue-gray"
           className="mt-1 font-bold text-2xl"
         >
           {price}
         </Typography>
       </CardBody>
     </Card>
   );
 }