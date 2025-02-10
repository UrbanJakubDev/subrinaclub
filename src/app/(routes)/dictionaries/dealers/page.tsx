import PageComponent from "@/components/features/detailPage/pageComponent";
import { DealerTable } from "@/components/features/dealers/dealerTable";
import Typography from "@/components/ui/typography";
import { dealerService } from "@/lib/services/dealer";

export default async function DealersPage() {
  const dealers = await dealerService.getAll();

  return (
    <PageComponent>
      <div className="w-full mb-4 p-6 flex flex-row justify-between bg-white shadow-lg rounded-xl">
        <Typography variant="h5" color="black">Seznam obchodníku</Typography>
      </div>
      <DealerTable defaultData={dealers} detailLinkPath="/dictionaries/dealers" />
    </PageComponent>
  );
}
