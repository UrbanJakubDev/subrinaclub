'use client';
import React, { useState } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { Button, Typography } from '@material-tailwind/react';
import ModalComponent from '@/components/ui/modal';

interface Props {
   accountId: number;
   onCreateSavingPeriod: (startYear: number, startQuarter: number) => Promise<void>;
}

const SavingPeriodModalWrapper: React.FC<Props> = ({ accountId, onCreateSavingPeriod }) => {
   const { openModal, handleCloseModal } = useModal();
   const [year, setYear] = useState(new Date().getFullYear());
   const [quarter, setQuarter] = useState(Math.floor(new Date().getMonth() / 3) + 1);

   const handleSubmit = async () => {
      await onCreateSavingPeriod(year, quarter);
      handleCloseModal();
   };

   if (openModal !== 'newSavingPeriodForm') return null;

   return (
      <ModalComponent
         modalId="newSavingPeriodForm"
         title="Create New Saving Period"
      >
         <Typography className="mb-4">
            No active saving period found. Please create a new one to add a transaction.
         </Typography>
         <div className="mb-4">
            <label className="block mb-2">Year</label>
            <input
               type="number"
               value={year}
               onChange={(e) => setYear(Number(e.target.value))}
               className="w-full p-2 border rounded"
            />
         </div>
         <div className="mb-4">
            <label className="block mb-2">Quarter</label>
            <select
               value={quarter}
               onChange={(e) => setQuarter(Number(e.target.value))}
               className="w-full p-2 border rounded"
            >
               <option value={1}>Q1</option>
               <option value={2}>Q2</option>
               <option value={3}>Q3</option>
               <option value={4}>Q4</option>
            </select>
         </div>
         <Button onClick={handleSubmit}>Create Saving Period</Button>
      </ModalComponent>
   );
};

export default SavingPeriodModalWrapper;