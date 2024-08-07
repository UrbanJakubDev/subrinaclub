"use client"
import { Card, CardBody, CardFooter } from "@material-tailwind/react";
import Typography from "../../typography";
import React from 'react'
import formatThousandDelimiter from "@/utils/formatFncs";

type ProductCardWidgetPropsType = {
   title: string;
   count: string | number;
   price: number;
   points: number;
   color?: string;
   icon?: React.ReactNode;
}

const ProductCardWidget: React.FC<ProductCardWidgetPropsType> = ({ title, count, price, points, color, icon }) => {

   // Format thousand delimiter for price and points values ufins fuction formatThousandDelimiter from utils
   const formattedPrice = formatThousandDelimiter(price);
   const formattedPoints = formatThousandDelimiter(points);



   return (
      <Card className="shadow-sm border border-gray-200 !rounded-lg grow">
         <CardBody className="p-4">
            <div className=" text-gray-900 text-center">
               <Typography variant="small" children={title} color="gray" />
               <Typography variant="h4" color="inherit" children={`${formattedPrice} Kč`} />
            </div>
         </CardBody>
         <CardFooter>
            <div className="flex justify-between">
               <Typography className="font-semibold" children={`${count} x`} />
               <Typography children={`${formattedPoints} bodů`} />
            </div>
         </CardFooter>
      </Card>
   );
}

export default ProductCardWidget