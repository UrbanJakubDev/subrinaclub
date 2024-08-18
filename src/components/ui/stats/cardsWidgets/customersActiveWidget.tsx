"use client"

import { Card, CardBody, Typography } from "@material-tailwind/react"

type Props = {
   title:string
   allCustomers:number
   systemActiveCustomers:number
   activeCustomers:number
}


export default function CustomersActiveWidget({title, allCustomers, systemActiveCustomers, activeCustomers}:Props) {

   let inactiveCustomers = allCustomers - systemActiveCustomers

   return (
      <Card>
         <CardBody>
            <div className="flex flex-col justify-between text-gray-900">
               <Typography variant="small">{title}</Typography>
               <Typography variant="h4" color="inherit" > {activeCustomers} / {systemActiveCustomers} </Typography>
            </div>
            <div>
               <Typography variant="small" >Celkový počet zákazníků: {allCustomers}</Typography>
               <Typography variant="small" >Deaktivovani zákazníci: {inactiveCustomers}</Typography>
            </div>
         </CardBody>
      </Card>
   );
}