import BonusesTable from '@/components/features/bonus/bonusesTable';
import PageComponent from '@/components/features/detailPage/pageComponent';
import Typography from '@/components/ui/typography';
import { fetchActiveBonusesFromDB } from '@/lib/db/queries/bonuses';

export default async function BonusesPage() {
   const bonuses = await fetchActiveBonusesFromDB();

   return (
      <PageComponent>
         <div className="w-full mb-4 p-6 flex flex-row justify-between bg-white shadow-lg rounded-xl">
            <Typography variant="h5" color="black">Seznam premium bonusu</Typography>
         </div>
         <BonusesTable defaultData={bonuses} detailLinkPath='bonus/' />
      </PageComponent>
   )
}