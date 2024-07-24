import PageComponent from "@/components/detailPage/pageComponent";
import PageHeader from "@/components/detailPage/pageHeader";
import SalesManagerForm from "@/components/forms/salesManagerForm";
import { CustomerService } from "@/db/queries/customers";
import {

  getSalesManagerById,
} from "@/db/queries/salesManagers";

export default async function SalesManagersDetail({
  params,
}: {
  params: { id: string };
}) {



  let sales_manager_id = parseInt(params.id);
  const sales_manager = await getSalesManagerById(sales_manager_id);
  // const allPoints = await getCustomerPointsBySalesManagerId(sales_manager_id);
  

  if (!sales_manager) {
    return <div>Loading...</div>;
  }
  return (
    <PageComponent>
      <div>
        <PageHeader
          userName={sales_manager.fullName}
          userId={sales_manager_id.toString()}
          active={sales_manager?.active}
          statsUrl={`/sales-managers/${sales_manager_id}/stats`}
        />
      </div>
      <div className="mx-auto w-8/12">
        <SalesManagerForm sales_manager={sales_manager} />
      
      </div>
    </PageComponent>
  );
}
