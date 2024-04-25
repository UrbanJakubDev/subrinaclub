import PageHeader from "@/components/detailPage/pageHeader";
import SalesManagerStats from "@/components/detailPage/salesManagerStats";
import {
  getCustomersListBySalesManagerId,
  getListOfTransactionsBySalesManagerId,
  getSalesManagerById,
} from "@/db/queries/salesManagers";
import { Suspense } from "react";

export default async function SalesManagersDetailStats({
  params,
}: {
  params: { id: string };
}) {
  let sales_manager_id = parseInt(params.id);
  const salesManager = await getSalesManagerById(sales_manager_id);
  // const customers = await getCustomersListBySalesManagerId(sales_manager_id);

  // const salesTransactions = await getListOfTransactionsBySalesManagerId(
  //   sales_manager_id,
  //   2023
  // );


  if (!salesManager) {
    return <div>Uživatel nenalezen</div>;
  }

  return (
    <div className="content-container">
      <PageHeader
        userId={salesManager.id.toString()}
        userName={salesManager.fullName}
        active={salesManager.active}
      />
      <h2>Customers</h2>
      <div className="flex ">
        <SalesManagerStats salesManager={salesManager} />
      </div>
    </div>
  );
}
