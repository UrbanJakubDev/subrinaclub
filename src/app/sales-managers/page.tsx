import SalesManagerTable from "@/components/tables/salesManagertable";
import { getSalesManagers } from "@/db/queries/salesManagers";
import Typography from "@/components/ui/typography";

export default async function SalesManagers() {
  const salesManagers = await getSalesManagers();

  return (
    <div className="content-container w-2/3">
      <div className="w-full mb-4 p-6 flex flex-row justify-between bg-white shadow-lg rounded-xl">
        <Typography variant="h5" color="black" >Seznam obchodních zástupců</Typography>
      </div>
      <SalesManagerTable defaultData={salesManagers} detailLinkPath="sales-managers/" />
    </div>
  );
}
