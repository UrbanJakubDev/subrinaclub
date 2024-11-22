import { useEffect } from 'react';
import { useStatsStore } from '@/stores/CustomerStatsStore';

export function useTransactionUpdates(onUpdate: () => void) {
   const lastTransactionUpdate = useStatsStore(state => state.lastTransactionUpdate);

   useEffect(() => {
      if (lastTransactionUpdate) {
         onUpdate();
      }
   }, [lastTransactionUpdate, onUpdate]);
}