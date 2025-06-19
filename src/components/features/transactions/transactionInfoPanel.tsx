import { Typography } from "@material-tailwind/react";

export const TransactionInfoPanel = ({ account }: { account: any }) => {
    const activeSavingPeriod = account?.savingPeriods?.[0];
    
    return (
      <div className='p-8 flex justify-between'>
        <div>
          <Typography variant='h4'>Zákazník</Typography>
          <p>Jméno: {account?.customer?.fullName}</p>
          <p>Registrační číslo: {account?.customer?.registrationNumber}</p>
          
          <Typography variant='h5' className='mt-8'>Aktivní šetřící období</Typography>
          {activeSavingPeriod ? (
            <>
              <p>ID: {activeSavingPeriod.id}</p>
              <p>
                od: {activeSavingPeriod.startYear}/{activeSavingPeriod.startQuarter} 
                {' '}do: {activeSavingPeriod.endYear}/{activeSavingPeriod.endQuarter}
              </p>
              <Typography variant='h5' className='mt-8'>Body v šetřícím období k dispozici</Typography>
              <p>{activeSavingPeriod.availablePoints}</p>
            </>
          ) : (
            <p className='text-red-600'>Žádné aktivní šetřící období</p>
          )}
        </div>
        
        <div>
          <Typography variant='h6'>Upozornění</Typography>
          <p className='text-red-600 text-xs'>Nelze zadat transakci mimo šetřící období</p>
        </div>
      </div>
    );
  };