import SalesManagerTable from "@/components/tables/salesManagertable";
import { getSalesManagers } from "@/db/queries/salesManagers";
import Typography from "@/components/ui/typography";

export default async function SalesManagers() {
  const salesManagers = await getSalesManagers();

  return (
    <div className="content-container w-2/3">
      <Typography variant="h3" color="blue-gray" className="font-medium">
        Přehled - Obchodníci
      </Typography>
      <SalesManagerTable defaultData={salesManagers} detailLinkPath="sales-managers/" />
    </div>
  );
}
