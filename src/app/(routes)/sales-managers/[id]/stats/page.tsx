import PageHeader from '@/components/features/detailPage/pageHeader';
import SalesManagerStats from '@/components/features/salesManager/salesManagerStats';
import PageComponent from '@/components/features/detailPage/pageComponent';
import { salesManagerService } from '@/lib/services/salesManager';

export default async function SalesManagersDetailStats({
    params,
}: {
    params: { id: string };
}) {
    let sales_manager_id = parseInt(params.id)

    // const currentYear = new Date().getFullYear()
    const salesManager = await salesManagerService.get(sales_manager_id)
    // const totalPoints = await salesManagerService.getLifeTimePointsOfCustomers(sales_manager_id)

    // const customersCountsInfo = await salesManagerService.getCustomersCountsInfo(sales_manager_id, currentYear)
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
            <div className="w-full mx-auto">
                <SalesManagerStats
                    salesManager={salesManager}
                />
            </div>
           
        </PageComponent>
    )
}
