'use client'
import BonusesTable from '@/components/features/bonus/bonusesTable'
import PageComponent from '@/components/features/detailPage/pageComponent'
import Loader from '@/components/ui/loader'
import Typography from '@/components/ui/typography'
import { useBonuses } from '@/lib/queries/bonus/queries'
import { Suspense } from 'react'

function BonusesTableWithData() {
    const { data: bonuses } = useBonuses()
    return (
        <BonusesTable
            data={bonuses?.data ?? []}
            detailLinkPath="bonus/"
            timeInfo={bonuses?.metadata?.loadedAt}
        />
    )
}

export default async function BonusesPage() {
    const { data: bonuses, isLoading } = useBonuses()

    return (
        <PageComponent>
            <div className="w-full mb-4 p-6 flex flex-row justify-between bg-white shadow-lg rounded-xl">
                <Typography variant="h5" color="black">
                    Seznam premium bonusu
                </Typography>
            </div>

            <Suspense fallback={<Loader />}>
                <BonusesTableWithData />
            </Suspense>
        </PageComponent>
    )
}
