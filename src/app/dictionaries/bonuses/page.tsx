import BonusFormComponent from '@/components/blocks/bonus/bonusFormComponent';
import PageComponent from '@/components/detailPage/pageComponent';
import PageHeader from '@/components/detailPage/pageHeader';
import BonusForm from '@/components/forms/bonusForm';
import BonusesTable from '@/components/tables/bonusesTable';
import ModalComponent from '@/components/ui/modal';
import { getAllBonuses } from '@/db/queries/bonuses';
import React from 'react'

export default async function BonusesPage() {

   const bonuses = await getAllBonuses();

   return (
      <PageComponent>
         <PageHeader
            userName='Všechny bonusy'
            userId='0'
            active
            openModal
            modalId='bonusForm2'
         />
         BonusesPage
         <BonusesTable defaultData={bonuses} />
         <BonusFormComponent />
      </PageComponent>
   )
}