import PageComponent from "@/components/detailPage/pageComponent";
import DealerForm from "@/components/forms/dealerForm";
import Loader from "@/components/ui/loader";
import { prisma } from "@/db/pgDBClient";
import { DealerService} from "@/db/queries/dealers";

export default async function DealersDetail({ params }: { params: { id: string } })  {

  const dealerService = new DealerService(prisma.dealer);

  let dealer_id = parseInt(params.id);
  const dealer = await dealerService.getDealerById(dealer_id);

  if (!dealer) {
    return <Loader />;
  }

  return (
    <PageComponent>
      <h1>Dealers Detail</h1>
      <DealerForm dealer={dealer} />
    </PageComponent>
  );
}
