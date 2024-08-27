import OverviewDataWrapper from "@/components/blocks/customer/overviewDataWraper";
import PageComponent from "@/components/detailPage/pageComponent";
import Loader from "@/components/ui/loader";
import { CustomerService } from "@/db/queries/customers";

type Props = {};

export default async function Users({ }: Props) {
  // Get all users
  const customerService = new CustomerService();
  const customers = await customerService.getCustomers(true);


  if (!customers) {
    <Loader />
  }

  return (
    <PageComponent>
      <OverviewDataWrapper initialData={customers} />
    </PageComponent>
  );
}
