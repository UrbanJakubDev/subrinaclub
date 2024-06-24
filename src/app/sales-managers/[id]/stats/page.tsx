import PageHeader from "@/components/detailPage/pageHeader";
import SalesManagerStats from "@/components/detailPage/salesManagerStats";
import { getCustomerCountBySalesManagerId, getCustomerCountBySalesManagerIdAndStatus, getSalesManagerById, getTotalAmountOfTransactionsBySalesManagerId, getTotalPointsBySalesManagerId } from "@/db/queries/salesManagers";

export default async function SalesManagersDetailStats({
  params,
}: {
  params: { id: string };
}) {
  let sales_manager_id = parseInt(params.id);
  const salesManager = await getSalesManagerById(sales_manager_id);
  const totalPoints = await getTotalAmountOfTransactionsBySalesManagerId(sales_manager_id);
  const customersClubPoints = await getTotalPointsBySalesManagerId(sales_manager_id);
  const numOfCusomers = await getCustomerCountBySalesManagerId(sales_manager_id);
  const numOfActiveCusomers = await getCustomerCountBySalesManagerIdAndStatus(sales_manager_id, true);

  if (!salesManager) {
    return <div>Uživatel nenalezen</div>;
  }

  return (
    <div className="content-container p-6 my-2">
      <PageHeader
        userId={salesManager.id.toString()}
        userName={salesManager.fullName}
        active={salesManager.active}
      />
      <h2>Statisitka o zákaznících</h2>
      <div className="flex ">
        <SalesManagerStats
          salesManager={salesManager}
          totalPoints={totalPoints}
          numOfCusomers={numOfCusomers}
          numOfActiveCusomers={numOfActiveCusomers}
          customersTotalPoints={customersClubPoints}
        />
      </div>
    </div>
  );
}
