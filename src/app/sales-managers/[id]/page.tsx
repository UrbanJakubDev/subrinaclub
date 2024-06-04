import PageHeader from "@/components/detailPage/pageHeader";
import { CustomerService } from "@/db/queries/customers";
import {

  getSalesManagerById,
} from "@/db/queries/salesManagers";

export default async function SalesManagersDetail({
  params,
}: {
  params: { id: string };
}) {

  const customerService = new CustomerService();

  let sales_manager_id = parseInt(params.id);
  const sales_manager = await getSalesManagerById(sales_manager_id);
  // const allPoints = await getCustomerPointsBySalesManagerId(sales_manager_id);
  

  if (!sales_manager) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-container">
      <div>
        <PageHeader
          userName={sales_manager?.fullName}
          userId={sales_manager_id.toString()}
          active={sales_manager?.active}
        />
      </div>
      <div>
        {/* <p>Total points: {allPoints}</p> */}
        <pre>
          {JSON.stringify(sales_manager, null, 2)}
        </pre>
      </div>
    </div>
  );
}
