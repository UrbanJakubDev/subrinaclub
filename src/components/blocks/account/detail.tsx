

import KpiCard from '@/components/ui/stats/cardsWidgets/KpiCard';
import { getQuarterPointsByAccountIdAndYear, getTotalDepositsByAccountId, getTotalDepositsByAccountIdAndYear } from '@/db/queries/transactions';

type Props = {
   account: any;
}

const AccountDetail = async ({ account }: Props) => {
   const actualYear = new Date().getFullYear();
   const clubPoints = await getTotalDepositsByAccountId(account.id);
   const yearPoints = await getTotalDepositsByAccountIdAndYear(account.id, actualYear);
   const quarterPoints = await getQuarterPointsByAccountIdAndYear(account.id, actualYear);

   return (
      <div className='flex flex-col'>
         <h2 className="text-lg font-semibold">Přehled - účtu</h2>
         <small className=" text-gray-700">Přehled atributů pro ůčet s ID: {account.id}</small>
         <div className='flex gap-4 flex-grow '>
            <div className='w-1/2'>
               <KpiCard title="Klubové konto" percentage={account.balancePointsCorrection} price={clubPoints.toString() + " b."} color={account.balancePointsCorrection > 0 ? "green" : "red"} icon={<i className="fas fa-arrow-up"></i>} />
            </div>
            <div className='w-1/2'>
               <KpiCard title="Roční konto pro rok:" percentage={actualYear} price={yearPoints + " b."} icon={<i className="fas fa-arrow-up"></i>} />
            </div>
         </div>

         {quarterPoints.length > 0 &&
            <div className='flex w-full justify-between py-4 gap-4'>
               {quarterPoints.map((quarter: any, index: number) => (
                  <KpiCard key={index} title={`${quarter.quarter}. čtvrtletí`} percentage={actualYear} price={quarter.sumPoints + " b."} icon={<i className="fas fa-arrow-up"></i>} />
               ))
               }
            </div>
         }
      </div>
   )
}

export default AccountDetail