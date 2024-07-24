"use client"
import SavingPeriodForm from '@/components/forms/savingPeriodForm';
import ModalComponent from '@/components/ui/modal';
import { useModal } from '@/contexts/ModalContext';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, CardBody, CardFooter, Collapse } from '@material-tailwind/react';
import React from 'react'

type Props = {
   savingPeriod: any;
}

const SavingPeriodCard = ({ savingPeriod }: Props) => {

   const [modalOpen, setModalOpen] = React.useState(false)
   const { handleOpenModal } = useModal();


   return (
      <Card className='my-4 p-4 bg-gray-100'>
         <div className='flex justify-between'>
            <div>
               <h2 className="text-lg font-semibold">Setřící období</h2>
               <small className=" text-gray-700">{savingPeriod.savingStartDate} - {savingPeriod.savingEndDate}</small>
            </div>
            <div className='flex gap-2'>
               <Button onClick={() => { handleOpenModal(`savingPeriodForm-${savingPeriod.id}`) }}> Upravit </Button>
               <Button><FontAwesomeIcon icon={faCaretDown} style={{ color: "#ffffff", }} /></Button>
            </div>
         </div>
         <ModalComponent
            modalId={`savingPeriodForm-${savingPeriod.id}`}
            title='Upravit šetřící období'
            description='Vyplňte formulář pro úpravu šetřícího období'
         >
            <SavingPeriodForm savingPeriod={savingPeriod} />
         </ModalComponent>


      </Card>
   )
}

export default SavingPeriodCard