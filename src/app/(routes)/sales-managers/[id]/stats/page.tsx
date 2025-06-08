'use client'
import PageHeader from '@/components/features/detailPage/pageHeader';
import SalesManagerStats from '@/components/features/salesManager/salesManagerStats';
import PageComponent from '@/components/features/detailPage/pageComponent';
import { useSalesManager } from '@/lib/queries/salesManager/queries';
export default async function SalesManagersDetailStats({
    params,
}: {
    params: { id: string };
}) {
    let sales_manager_id = parseInt(params.id)

    // const currentYear = new Date().getFullYear()
    const { data: salesManager } = useSalesManager(sales_manager_id)
    // const totalPoints = await salesManagerService.getLifeTimePointsOfCustomers(sales_manager_id)

    // const customersCountsInfo = await salesManagerService.getCustomersCountsInfo(sales_manager_id, currentYear)
    if (!salesManager) {
        return <div>Uživatel nenalezen</div>
    }

    return (
        <PageComponent>
                <PageHeader
                    userId={salesManager.data?.id.toString()}
                userName={salesManager.data?.fullName}
                active={salesManager.data?.active}
                formUrl={`/sales-managers/${salesManager.data?.id}`}
            />
            <div className="w-full mx-auto">
                <SalesManagerStats
                    salesManager={salesManager.data}
                />
            </div>
           
        </PageComponent>
    )
}
