'use client'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useAccount } from '@/lib/queries/account/queries'
import Skeleton from '@/components/ui/skeleton'
import { useParams } from 'next/navigation'
import SavingPeriodsListContainer from '@/components/features/savingPeriod/SavingPeriodsListContainer'
import { Typography, Card } from '@material-tailwind/react'
import PageComponent from '@/components/features/detailPage/pageComponent'
import Button from '@/components/ui/button'
import NoData from '@/components/ui/noData'
import { Suspense } from 'react'

interface PageProps {
    params: {
        id: string
    }
}

function AccountSavingPeriodsContent() {
    const router = useParams()
    const accountId = parseInt(router.id as string)

    const { 
        data: accountResponse, 
        isLoading: isAccountLoading,
        isError: isAccountError,
        error: accountError
    } = useAccount(accountId)



    if (isAccountLoading) {
        return <Skeleton className="h-screen w-full" />
    }

    if (isAccountError) {
        return (
            <div className="w-full max-w-4xl mx-auto p-4">
                <Typography variant="h5" color="red">
                    Error loading data. Please try again later.
                </Typography>
            </div>
        )
    }

    if (!accountResponse?.data) {
        return <NoData />
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                    <Typography variant="h3" className="mb-2">
                        Šetřící období účtu: {accountResponse.data.customer.fullName}
                    </Typography>
                    <Typography variant="paragraph" className="text-gray-600">
                        ID účtu: {accountResponse.data.id} | Registrační číslo:{' '}
                        {accountResponse.data.customer.registrationNumber}
                    </Typography>
                </div>
                <div className="mt-3 md:mt-0 flex gap-3">
                    <Link
                        href={`/accounts/${accountId}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <span>Zpět na účet</span>
                    </Link>

                    <Link
                        href={`/customers/${accountResponse.data.customerId}/stats`}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        <span>Statistiky zákazníka</span>
                    </Link>
                </div>
            </div>

            <Card className="p-6 my-4">
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h5">Seznam šetřících období</Typography>
                    <Button
                        variant="filled"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => {
                            /* TODO: Create new saving period */
                        }}>
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Vytvořit nové období
                    </Button>
                </div>

                <SavingPeriodsListContainer
                    accountId={accountId}
                />
            </Card>
        </div>
    )
}

export default function AccountSavingPeriodsPage({ params }: PageProps) {
    return (
        <PageComponent>
            <Suspense fallback={<Skeleton className="h-screen w-full" />}>
                <AccountSavingPeriodsContent />
            </Suspense>
        </PageComponent>
    )
}
