"use client";
import { useEffect, useState, useCallback } from 'react';
import InputField from '../../ui/inputs/basicInput';
import InputDateFiled from '../../ui/inputs/dateInput';
import { toast } from 'react-toastify';
import Loader from '../../ui/loader';
import { Typography } from '@material-tailwind/react';
import UniversalForm from '../../forms/universalForm';
import SelectField from '../../ui/inputs/selectInput';
import { quarterSelectOptions, yearSelectOptions } from '@/utils/dateFnc';
import { Transaction } from '@/types/transaction';
import { transactionValidationSchema } from '@/lib/services/transaction/validation';


const newTransaction: Transaction = {
   id: 0,
   accountId: 0,
   year: 0,
   quarter: 0,
   amount: 0,
   acceptedBonusOrder: null,
   sentBonusOrder: null,
   bonusAmount: 0,
   bonusId: 0,
   description: '',
};


type Props = {
   transaction: Transaction
};



const TransactionForm = ({ transaction }: Props) => {

   const [transactionData, setTransactionData] = useState<Transaction>(transaction || newTransaction);
   const [bonusesDial, setBonusesDial] = useState<any>(null);
   const [transactionType, setTransactionType] = useState('DEPOSIT');


   // Fetch bonuses and transaction data
   const fetchBonuses = useCallback(async () => {
      try {
         const response = await fetch(`/api/dictionaries/bonuses/options`);
         if (!response.ok) throw new Error('Failed to fetch bonuses');
         setBonusesDial(await response.json());
      } catch (error) {
         console.error('Error fetching bonuses:', error);
      }
   }, []);

   // Send request to create or update transaction
   const createOrUpdateTransaction = async (data: Transaction) => {
      try {
         const response = await fetch(`/api/transactions`, {
            method: data.id ? 'PUT' : 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
         });

         if (!response.ok) {
            throw new Error('Failed to create or update transaction');
         }

         const result = await response.json();
         setTransactionData(result);
         toast.success(data.id ? 'Transaction updated' : 'Transaction created');
      } catch (error) {
         console.error('Error creating or updating transaction:', error);
         toast.error('Failed to create or update transaction');
      }
   }

   useEffect(() => {
      fetchBonuses();
   }, [transactionData]);


   const handleSubmit = async (data: Transaction) => {
      alert('submit');
      await createOrUpdateTransaction(data);
   };

   if (!bonusesDial) {
      return <Loader />;
   }

   return (
      <UniversalForm<Transaction>
         initialData={transactionData}
         validationSchema={transactionValidationSchema}
         onSubmit={handleSubmit}
         successMessage={transactionData.id ? "Prodejce byl úspěšně upraven." : "Prodejce byl úspěšně vytvořen."}
      >
         {() => (
            <>
               <div className="flex flex-row gap-4">
                  <SelectField
                     label="Rok"
                     name="year"
                     options={yearSelectOptions()}
                  // defaultValue={savingPeriod.year}
                  />

                  <SelectField
                     label="Čtvrtletí"
                     name="quarter"
                     options={quarterSelectOptions()}
                  // defaultValue={savingPeriod.quarter}
                  />
               </div>

               <div className="my-4">
                  <InputField
                     label="Množství"
                     type="number"
                     name="points"
                     defaultValue={transactionData.points}
                  />
                  <InputDateFiled
                     label="Přijetí objednávky"
                     name="acceptedBonusOrder"
                  />
               </div>


               <div className="mb-4">
                  <Typography>Vyběr bodů</Typography>
                  <InputField
                     label="Popis"
                     type="text"
                     name="description"
                  />

                  <InputDateFiled
                     label="Odeslání Bonusu"
                     name="sentBonusOrder"
                  />
                  <InputField
                     label="Bonus - cena"
                     type="number"
                     name="bonusAmount"
                     defaultValue={0}
                  />
                  <SelectField
                     label="Bonus"
                     name="bonusId"
                     options={bonusesDial}
                     defaultValue={transactionData.bonusId}
                  />
               </div>

            </>

         )}
      </UniversalForm>
   );
}

export default TransactionForm;

