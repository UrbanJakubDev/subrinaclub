import SalesManagerTable from "@/components/tables/salesManagertable";
import Typography from "@/components/ui/typography";
import PageComponent from "@/components/detailPage/pageComponent";
import { getSalesManagers } from "@/actions/salesManager";

export default async function SalesManagers() {
  const salesManagers = await getSalesManagers();

  return (
    <PageComponent>
      <div className="w-full mb-4 p-6 flex flex-row justify-between bg-white shadow-lg rounded-xl">
        <Typography variant="h5" color="black">Seznam obchodních zástupců</Typography>
      </div>
      <SalesManagerTable defaultData={salesManagers} detailLinkPath="sales-managers/" />
    </PageComponent>
  );
}