"use client";
import KpiCard from '@/components/ui/stats/cardsWidgets/KpiCard';
import Image from 'next/image';
import gmedal from '/public/img/medalG.svg';
import smedal from '/public/img/medalS.svg';
import Skeleton from '@/components/ui/skeleton';

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


export default function CustomerAccountDetail({ isLoading, account, data }: Props) {

   const { year, clubPoints, yearPoints, quarterPoints } = data;
   return (
      <div className='flex flex-col'>
         <h2 className="text-lg font-semibold">Přehled - účtu</h2>
         <small className=" text-gray-700">Přehled atributů pro ůčet s ID: {account.id}</small>
         <div className='flex gap-4 flex-grow '>
            <div className='w-1/2'>
               <KpiCard title="Klubové konto" percentage={account.balancePointsCorrection} price={clubPoints.toString() + " b."} color={account.balancePointsCorrection > 0 ? "green" : "red"} icon={<i className="fas fa-arrow-up"></i>} />
            </div>
            <div className='w-1/2'>
               <KpiCard title="Roční konto pro rok:" percentage={year} price={yearPoints + " b."} icon={<i className="fas fa-arrow-up"></i>} />
            </div>
         </div>
         <div className="w-full mb-4 p-6 flex flex-row justify-start gap-6 bg-white rounded-md mt-4">
            <div>
               <Image priority src={gmedal} alt="medal" width={32} height={32} />
               <span>2023</span>
            </div>
            <div>
               <Image priority src={smedal} alt="medal" width={32} height={32} />
               <span>2022</span>
            </div>
            <div>
               <Image priority src={gmedal} alt="medal" width={32} height={32} />
               <span>2021</span>
            </div>
         </div >

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

