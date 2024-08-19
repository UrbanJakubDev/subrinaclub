import PageHeader from '@/components/detailPage/pageHeader'
import SalesManagerStats from '@/components/blocks/salesManager/salesManagerStats'
import {
    getActiveCustomersWithTransactionsBySalesManagerId,
    getCustomerCountBySalesManagerId,
    getCustomerCountBySalesManagerIdAndStatus,
    getSalesManagerById,
    getTotalAmountOfTransactionsBySalesManagerId,
    getTotalPointsBySalesManagerId,
} from '@/db/queries/salesManagers'
import PageComponent from '@/components/detailPage/pageComponent'

export default async function SalesManagersDetailStats({
                                                           params,
                                                       }: {
    params: { id: string };
}) {
    let sales_manager_id = parseInt(params.id)
    const salesManager = await getSalesManagerById(sales_manager_id)
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
