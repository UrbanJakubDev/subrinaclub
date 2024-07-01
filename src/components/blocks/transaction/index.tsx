import { IAccount } from '@/interfaces/interfaces';
import React, { Fragment, useRef, useState } from 'react'
import TransactionForm from '../../forms/transactionForm';
import { Dialog, Transition } from '@headlessui/react'

type Props = {
   account: IAccount;
   onTransactionCreated: () => void;
}

const TransactionComponent = ({ account, onTransactionCreated }: Props) => {
   return (

      <TransactionForm accountId={account.id} onTransactionCreated={onTransactionCreated} />

   )



}

export default TransactionComponent