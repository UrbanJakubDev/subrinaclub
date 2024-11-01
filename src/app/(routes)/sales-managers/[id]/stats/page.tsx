import PageHeader from '@/components/features/detailPage/pageHeader'
import SalesManagerStats from '@/components/features/salesManager/salesManagerStats'
import {
    fetchSalesManagerByIdFromDB,
    getActiveCustomersWithTransactionsBySalesManagerId,
    getCustomerCountBySalesManagerId,
    getCustomerCountBySalesManagerIdAndStatus,
    getTotalAmountOfTransactionsBySalesManagerId,
    getTotalPointsBySalesManagerId,
} from '@/lib/db/queries/salesManagers'
import PageComponent from '@/components/features/detailPage/pageComponent'

export default async function SalesManagersDetailStats({
                                                           params,
                                                       }: {
    params: { id: string };
}) {
    let sales_manager_id = parseInt(params.id)
    const salesManager = await fetchSalesManagerByIdFromDB(sales_manager_id as number)
    const totalPoints = await getTotalAmountOfTransactionsBySalesManagerId(sales_manager_id)
    const customersClubPoints = await getTotalPointsBySalesManagerId(sales_manager_id)
    const numberCustomers = await getCustomerCountBySalesManagerId(sales_manager_id)
    const numOfActiveCustomers = await getActiveCustomersWithTransactionsBySalesManagerId(sales_manager_id, 2024)
    const numOfSystemActiveCustomers = await getCustomerCountBySalesManagerIdAndStatus(sales_manager_id, true)

    if (!salesManager) {
        return <div>Uživatel nenalezen</div>
    }

    return (
        <PageComponent>
            <PageHeader
                userId={salesManager.id.toString()}
                userName={salesManager.fullName}
                active={salesManager.active}
                formUrl={`/sales-managers/${salesManager.id}`}
            />
            <div className="w-11/12 mx-auto">
                <SalesManagerStats
                    salesManager={salesManager}
                    totalPoints={totalPoints}
                    numOfCusomers={numberCustomers}
                    numOfActiveCusomers={numOfActiveCustomers}
                    numOfSystemActiveCusomers={numOfSystemActiveCustomers}
                    customersTotalPoints={customersClubPoints}
                />
            </div>
        </PageComponent>
    )
}
