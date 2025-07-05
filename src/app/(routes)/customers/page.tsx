import { Suspense } from 'react'
import CustomerTable from '@/components/features/customer/customerTable'
import Loader from '@/components/ui/loader'
import PageComponent from '@/components/features/detailPage/pageComponent'

export default function CustomersPage() {
    return (
        <PageComponent full>
            <Suspense
                fallback={
                    <div className="w-full flex justify-center p-8">
                        <Loader />
                    </div>
                }>
                <CustomerTable detailLinkPath="/customers" />
            </Suspense>
        </PageComponent>
    )
}
