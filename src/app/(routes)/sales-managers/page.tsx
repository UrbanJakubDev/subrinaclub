import PageComponent from "@/components/features/detailPage/pageComponent";
import SalesManagerTable from "@/components/features/salesManager/salesManagertable";
import { salesManagerService } from "@/lib/services/salesManager";

export default async function SalesManagers() {
  const salesManagers = await salesManagerService.getAll();

  return (
    <PageComponent>
      <SalesManagerTable defaultData={salesManagers} detailLinkPath="sales-managers/" />
    </PageComponent>
  );
}