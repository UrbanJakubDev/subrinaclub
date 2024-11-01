import DealerForm from "@/components/features/dealers/dealerForm";
import PageComponent from "@/components/features/detailPage/pageComponent";
import Button from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Typography from "@/components/ui/typography";
import { dealerService } from "@/lib/services/dealer";
import Link from "next/link";

type DealersDetailProps = {
  params: { id: string };
};

export default async function DealersDetail({ params } : DealersDetailProps) {
  const isNewDealer = params.id === "new";
  const dealer_id = parseInt(params.id);

  if (isNewDealer) {
    return (
      <PageComponent>
        <div className="mx-auto w-8/12">
          <DealerForm />
        </div>
      </PageComponent>
    );
  }

  
  const dealer = await dealerService.get(dealer_id);

  if (!dealer) {
    return <Loader />;
  }

  return (
    <PageComponent>
      <div className="w-full mb-4 p-6 flex flex-row justify-between bg-white shadow-lg rounded-xl">
        <Link href="/dictionaries/dealers">
          <Button>&lt;&lt;</Button>
        </Link>
        <Typography variant="h5" color="black">
          Editace - {dealer.fullName}
        </Typography>
        <span> </span>
      </div>
      <div className="mx-auto w-8/12">
        <DealerForm initialDealerData={dealer} />
      </div>
    </PageComponent>
  );
}
