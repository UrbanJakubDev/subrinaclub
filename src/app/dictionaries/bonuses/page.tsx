import BonusDataWrapper from '@/components/blocks/bonus/bonusDataWrapper';
import BonusFormComponent from '@/components/blocks/bonus/bonusFormComponent';
import PageComponent from '@/components/detailPage/pageComponent';
import PageHeader from '@/components/detailPage/pageHeader';
import { getAllBonuses } from '@/db/queries/bonuses';

export default async function BonusesPage() {

   const bonuses = await getAllBonuses();

   return (
      <PageComponent>
         <PageHeader
            userName='Všechny bonusy'
            userId='0'
            active
            openModal
            modalId='bonusFormModal'
         />
         BonusesPage
         <BonusDataWrapper initalData={bonuses} />
         <BonusFormComponent />
      </PageComponent>
   )
}