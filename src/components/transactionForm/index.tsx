import { IAccount } from '@/interfaces/interfaces';
import React, { Fragment, useRef, useState } from 'react'
import TransactionForm from '../forms/transactionForm';
import { Dialog, Transition } from '@headlessui/react'

type Props = {
   account: IAccount;
   onTransactionCreated: () => void;
}

const TransactionComponent = ({ account, onTransactionCreated }: Props) => {
   return (
      <div className='bg-zinc-50 border p-4 drop-shadow-sm'>
         <h1>Transaction Component</h1>
         <p>{account.id}</p>
         <TransactionForm accountId={account.id} onTransactionCreated={onTransactionCreated} />
      </div>
   )



}

export default TransactionComponent