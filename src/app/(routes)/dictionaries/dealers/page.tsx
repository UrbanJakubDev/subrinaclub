'use client'
import { Suspense } from 'react'
import PageComponent from '@/components/features/detailPage/pageComponent'
import { DealerTable } from '@/components/features/dealers/dealerTable'
import Typography from '@/components/ui/typography'
import { useDealers } from '@/lib/queries/dealer/queries'
import Skeleton from '@/components/ui/skeleton'

// Component that uses the query
function DealerTableWithData() {
    const { data: dealers } = useDealers(true)

    return (
        <DealerTable
            data={dealers?.data ?? []}
            detailLinkPath="/dictionaries/dealers"
            timeInfo={dealers?.metadata?.loadedAt}
        />
    )
}

export default function DealersPage() {
    return (
        <PageComponent>
            <div className="w-full mb-4 p-6 flex flex-row justify-between bg-white shadow-lg rounded-xl">
                <Typography variant="h5" color="black">
                    Seznam obchodníku
                </Typography>
            </div>

            <Suspense fallback={<Skeleton type="table" />}>
                <DealerTableWithData />
            </Suspense>
        </PageComponent>
    )
}
