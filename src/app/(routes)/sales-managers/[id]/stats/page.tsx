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

    const { data: salesManager } = useSalesManager(sales_manager_id)

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
