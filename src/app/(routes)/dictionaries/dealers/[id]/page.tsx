'use client'
import DealerForm from '@/components/features/dealers/dealerForm'
import PageComponent from '@/components/features/detailPage/pageComponent'
import Button from '@/components/ui/button'
import Loader from '@/components/ui/loader'
import Typography from '@/components/ui/typography'
import { useDealer } from '@/lib/queries/dealer/queries'
import Link from 'next/link'

type DealersDetailProps = {
    params: { id: string }
}

export default function DealersDetail({ params }: DealersDetailProps) {
    const isNewDealer = params.id === 'new'
    const dealer_id = parseInt(params.id)

    if (isNewDealer) {
        return (
            <PageComponent>
                <div className="mx-auto w-8/12">
                    <DealerForm initialDealerData={null} />
                </div>
            </PageComponent>
        )
    }

    const { data: dealer, isLoading } = useDealer(dealer_id)

    if (!dealer || isLoading) {
        return <Loader />
    }

    return (
        <PageComponent>
            <div className="w-full mb-4 p-6 flex flex-row justify-between bg-white shadow-lg rounded-xl">
                <Link href="/dictionaries/dealers">
                    <Button>&lt;&lt;</Button>
                </Link>
                <Typography variant="h5" color="black">
                    Editace - {dealer.data?.fullName}
                </Typography>
                <span> </span>
            </div>
            <div className="mx-auto w-8/12">
                <DealerForm initialDealerData={dealer.data} />
            </div>
        </PageComponent>
    )
}
