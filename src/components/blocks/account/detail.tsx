
import React from 'react'
// @material-tailwind/react
import {
   Button,
   Typography,
   Menu,
   MenuHandler,
   MenuList,
   MenuItem,
   Card,
   CardBody,
} from "@material-tailwind/react";
import { KpiCard } from '../../ui/stats/KpiCard';
import { getTotalDepositsByAccountId, getTotalDepositsByAccountIdAndYear } from '@/db/queries/transactions';

type Props = {
   account: any;
}

const AccountDetail = async ({ account }: Props) => {
   const clubPoints = await getTotalDepositsByAccountId(account.id);
   const yearPoints = await getTotalDepositsByAccountIdAndYear(account.id, new Date().getFullYear());

   return (
      <>
         <h2 className="text-lg font-semibold">Přehled - účtu</h2>
         <small className=" text-gray-700">Přehled atributů pro ůčet s ID: {account.id}</small>
         <div className='flex gap-4 flex-grow '>
            <div className='w-1/2'>
               <KpiCard title="Klubové konto" percentage={account.balancePointsCorrection} price={clubPoints.toString()} color={account.balancePointsCorrection > 0 ? "green" : "red"} icon={<i className="fas fa-arrow-up"></i>} />
            </div>
            <div className='w-1/2'>
               <KpiCard title="Roční konto" percentage={account.balancePointsCorrection} price={yearPoints} color={account.balancePointsCorrection > 0 ? "green" : "red"} icon={<i className="fas fa-arrow-up"></i>} />
            </div>
         </div>
      </>
   )
}

export default AccountDetail