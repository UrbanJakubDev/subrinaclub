import React from 'react'
import { KpiCardProgress } from '../ui/stats/KpiCardProgress';
import LineChart from '../ui/charts/line';

type Props = {
   savingPeriod: any;
}

const SavingPeriodForm = ({savingPeriod}: Props) => {
   const series = [
      {
        name: "Body",
        data: [50, 40, 300, 320],
      },
    ]


  return (
    <div className='pt-2'>
        <div className='flex gap-4 pb-4'>
         <KpiCardProgress title="Dvouleté šetřící období" points={800} color={savingPeriod.balancePointsCorrection > 0 ? "green" : "red"} icon={<i className="fas fa-arrow-up"></i>} />
         <KpiCardProgress title="Dvouleté šetřící období" points={800} color={savingPeriod.balancePointsCorrection > 0 ? "green" : "red"} icon={<i className="fas fa-arrow-up"></i>} />
        </div>
         <LineChart 
         title='Dvouleté šetřící období'
         description='Graf vývoje bodů za dvouleté šetřící období'
         series={series}
          />
    </div>
  )
}

export default SavingPeriodForm