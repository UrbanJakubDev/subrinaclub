"use client"
import { Card, CardBody, Progress, Slider, Typography } from "@material-tailwind/react";

interface KpiCardPropsType {
   title: string;
   points: string;
   color: string;
   icon: React.ReactNode;
 }
 
 export function KpiCardProgress({
   title,
   points,
   color,
   icon,
 }: KpiCardPropsType) {

    // Calculate the percentage of the points max is 2000
    const percentage = (parseInt(points) / 2000) * 100;

   return (
     <Card className="shadow-sm border border-gray-200 !rounded-lg w-full">
       <CardBody className="p-4">
         <div className="flex justify-between items-center">
           <Typography
             className="!font-medium !text-xs text-gray-600"
           >
             {title}
           </Typography>
         </div>
          <Typography
            color="blue-gray"
            className="mt-1 font-bold text-2xl"
          >
            {points}<span className="!font-medium !text-xs text-gray-600"> bodů</span>
          </Typography>

          <div>
          <span className="!font-medium !text-xs text-gray-600" >{percentage}% z 2000 bodů</span>
         <Progress value={percentage} />
          </div>
       </CardBody>
     </Card>
   );
 }