'use client'
import PageComponent from '@/components/features/detailPage/pageComponent'
import SalesManagerTable from '@/components/features/salesManager/salesManagertable'
import Loader from '@/components/ui/loader'
import { useSalesManagers } from '@/lib/queries/salesManager/queries'

export default async function SalesManagers() {
    const { data: salesManagers, isLoading } = useSalesManagers(true)

    return (
        <PageComponent>
            {isLoading ? (
                <Loader />
            ) : (
                <SalesManagerTable
                    defaultData={salesManagers?.data}
                    detailLinkPath="sales-managers/"
                    timeInfo={salesManagers?.metadata?.loadedAt}
                />
            )}
        </PageComponent>
    )
}
