import BonusForm from "@/components/features/bonus/bonusForm";
import PageComponent from "@/components/features/detailPage/pageComponent";
import Button from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Typography from "@/components/ui/typography";
import { fetchBonusByIdFromDB } from "@/lib/db/queries/bonuses";
import { bonusService } from "@/lib/services/bonus";
import Link from "next/link";

type BonusPageDetailProps = {
  params: { id: string };
};

export default async function BonusPageDetail({ params }: BonusPageDetailProps) {
  const isNewBonus = params.id === "new";

  if (isNewBonus) {
    return (
      <PageComponent>
        <div className="mx-auto w-8/12">
          <BonusForm />
        </div>
      </PageComponent>
    );
  }

  const bonusId = parseInt(params.id);
  const bonus = await bonusService.get(bonusId) ;

  if (!bonus) {
    return <Loader />;
  }

  return (
    <PageComponent>
      <div className="w-full mb-4 p-6 flex flex-row justify-between bg-white shadow-lg rounded-xl">
        <Link href="/dictionaries/bonus">
          <Button>&lt;&lt;</Button>
        </Link>
        <Typography variant="h5" color="black">
          Editace - {bonus.name}
        </Typography>
      </div>
      <div className="mx-auto w-8/12">
        <BonusForm initialBonusData={bonus} />
        <pre>
          {JSON.stringify(bonus, null, 2)}
        </pre>
      </div>
    </PageComponent>
  );
}