"use client"

import { Card, CardBody, Typography } from "@material-tailwind/react"

type Props = {
   title:string
   allCustomers:number
   activeCustomers:number
}


export default function CustomersActiveWidget({title, allCustomers, activeCustomers}:Props) {

   let inactiveCustomers = allCustomers - activeCustomers

   return (
      <Card>
         <CardBody>
            <div className="flex flex-col justify-between text-gray-900">
               <Typography variant="small">{title}</Typography>
               <Typography variant="h4" color="inherit" >{allCustomers}</Typography>
            </div>
            <div>
               <Typography variant="small" >Aktivní zákazníci: {activeCustomers}</Typography>
               <Typography variant="small" >Neaktivní zákazníci: {inactiveCustomers}</Typography>
            </div>
         </CardBody>
      </Card>
   );
}