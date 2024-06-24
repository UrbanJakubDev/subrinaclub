
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
import { KpiCard } from '../ui/stats/KpiCard';
import { getTotalDepositsByAccountId } from '@/db/queries/transactions';

type Props = {
   account: any;
}

const AccountDetail = async ({ account }: Props) => {
   const clubPoints = await getTotalDepositsByAccountId(account.id);

   return (
      <div className='w-full'>
         <KpiCard title="Klubové konto" percentage={account.balancePointsCorrection} price={clubPoints.toString()} color={account.balancePointsCorrection > 0 ? "green" : "red"} icon={<i className="fas fa-arrow-up"></i>} />
      </div>
   )
}

export default AccountDetail