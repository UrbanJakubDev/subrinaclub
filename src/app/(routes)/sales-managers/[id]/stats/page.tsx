import PageHeader from '@/components/features/detailPage/pageHeader';
import SalesManagerStats from '@/components/features/salesManager/salesManagerStats';
import {
    getActiveCustomersWithTransactionsBySalesManagerId,
    getCustomerCountBySalesManagerId,
    getCustomerCountBySalesManagerIdAndStatus
} from '@/lib/db/queries/salesManagers';
import PageComponent from '@/components/features/detailPage/pageComponent';
import { salesManagerService } from '@/lib/services/salesManager';

export default async function SalesManagersDetailStats({
    params,
}: {
    params: { id: string };
}) {
    let sales_manager_id = parseInt(params.id)
    const salesManager = await salesManagerService.get(sales_manager_id)
    const totalPoints = await salesManagerService.getLifeTimePointsOfCustomers(sales_manager_id)

    // TODO: Reowrk all of these to use the salesManagerService instead of the db queries and make that as one method
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
                />
            </div>
           
        </PageComponent>
    )
}
