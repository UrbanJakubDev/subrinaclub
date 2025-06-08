'use client'
import Typography from '@/components/ui/typography'
import PageComponent from '@/components/features/detailPage/pageComponent'
import Loader from '@/components/ui/loader'
import { Suspense } from 'react'
import AccountsTable from '@/components/features/account/AccountTable'
import { useAccounts } from '@/lib/queries/account/queries'
import Skeleton from '@/components/ui/skeleton'

function AccountsListContainerWithData() {
    const { data: accounts, isLoading } = useAccounts()

    if (isLoading) {
        return <Skeleton type="table" />
    }

    return (
        <AccountsTable
            data={accounts?.data}
            timeInfo={accounts?.metadata?.loadedAt ?? ''}
        />
    )
}

export default function AccountsPage() {
    return (
        <PageComponent>
            <Suspense fallback={<Skeleton type="table" />}>
                <AccountsListContainerWithData />
            </Suspense>
        </PageComponent>
    )
}
