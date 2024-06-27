import DealerTable from "@/components/tables/dealerTable";
import { prisma } from "@/db/pgDBClient";
import { DealerService } from "@/db/queries/dealers";

export default async function Dealers() {
  const dealerService = new DealerService(prisma.dealer);
  const dealers = await dealerService.getDealers();

  return (
    <div className="content-container">
      <h1>Dealers</h1>
      <DealerTable defaultData={dealers} detailLinkPath="/dealers" />
    </div>
  );
}
