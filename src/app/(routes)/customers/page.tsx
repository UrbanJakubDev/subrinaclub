import OverviewDataWrapper from "@/components/features/customer/overviewDataWraper";
import PageComponent from "@/components/features/detailPage/pageComponent";
import Loader from "@/components/ui/loader";
import { customerService } from "@/lib/services/customer";


export default async function CustomersPage() {

  const customers = await customerService.getAll(true);


  if (!customers) {
    <Loader />
  }

  return (
    <PageComponent>
      <OverviewDataWrapper initialData={customers} />
    </PageComponent>
  );
}
