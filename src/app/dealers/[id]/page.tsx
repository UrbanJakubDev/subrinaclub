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
    <div className="content-container">
      <h1>Dealers Detail</h1>
      <DealerForm dealer={dealer} />
    </div>
  );
}
