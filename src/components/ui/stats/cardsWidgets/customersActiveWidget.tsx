"use client"

import { Card, CardBody, Typography } from "@material-tailwind/react"

type Props = {
   title: string
   allCustomers: number
   activeCustomers: number
}


export default function CustomersActiveWidget({ title, allCustomers, activeCustomers }: Props) {

   let inactiveCustomers = allCustomers - activeCustomers

   return (
      <Card>
         <CardBody>
            <Typography variant="h4">{title}</Typography>
            <div className="flex flex-col justify-between text-gray-900">
               <Typography variant="small" color="inherit" >Aktivní zákazníci: {activeCustomers}</Typography>
               <Typography variant="small" >Neaktivní zákazníci: {inactiveCustomers}</Typography>
               <Typography variant="small" color="inherit" >Zákazníci celkem: {allCustomers}</Typography>
            </div>
         </CardBody>
      </Card>
   );
}