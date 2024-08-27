import DealerTable from "@/components/tables/dealerTable";
import { prisma } from "@/db/pgDBClient";
import { DealerService } from "@/db/queries/dealers";

export default async function Dealers() {
  const dealerService = new DealerService(prisma.dealer);
  const dealers = await dealerService.getDealers();

  return (
    <div className="content-container w-2/3">
      <div className="w-full mb-4 p-6 flex flex-row justify-between bg-white rounded-xl">
        <h5 className="text-black font-semibold">Seznam velkoobchodníků</h5>
      </div>
      <DealerTable defaultData={dealers} detailLinkPath="/dictionaries/dealers" />
    </div>
  );
}
