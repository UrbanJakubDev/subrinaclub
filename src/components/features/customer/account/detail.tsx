import KpiCard from '@/components/ui/stats/cardsWidgets/KpiCard';

type Props = {
   isLoading?: boolean;
   account: any;
   data: {
      year: number,
      clubPoints: number,
      yearPoints: number,
      quarterPoints: any[]
   }
}


export default function CustomerAccountDetail({ account, data }: Props) {

   

   const { year, clubPoints, yearPoints, quarterPoints } = data;
   return (
      <div className='flex flex-col rounded-lg'>
         
         <div className='flex gap-4 flex-grow '>
            <div className='w-1/2'>
               <KpiCard title="Klubové konto" percentage={account.balancePointsCorrection} price={clubPoints.toString() + " b."} color={account.balancePointsCorrection > 0 ? "green" : "red"} icon={<i className="fas fa-arrow-up"></i>} />
            </div>
            <div className='w-1/2'>
               <KpiCard title="Roční konto pro rok:" percentage={year} price={yearPoints + " b."} icon={<i className="fas fa-arrow-up"></i>} />
            </div>
         </div>
         {
            quarterPoints.length > 0 &&
            <div className='flex w-full justify-between py-4 gap-4'>
               {quarterPoints.map((quarter: any, index: number) => (
                  <KpiCard key={index} title={`${quarter.quarter}. čtvrtletí`} percentage={year} price={quarter.sumPoints + " b."} icon={<i className="fas fa-arrow-up"></i>} />
               ))
               }
            </div>
         }
      </div >
   )
}

