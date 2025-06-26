'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import PageComponent from '@/components/features/detailPage/pageComponent'
import PageHeader from '@/components/features/detailPage/pageHeader'
import CustomerStatsView from '@/components/features/customer/CustomerStatsView'
import { CustomerWithAccountDataAndActiveSavingPeriodDTO } from '@/lib/services/customer/types'
import { Transaction } from '@/types/transaction'
import LoadingSpinner from '@/components/ui/loadingSpinner'

export default function UserDetailStats() {
    const params = useParams()
    const id = params.id as string

    const [customer, setCustomer] =
        useState<CustomerWithAccountDataAndActiveSavingPeriodDTO | null>(null)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const customer_id = parseInt(id)

            // Fetch customer data
            const customerResponse = await fetch(`/api/customers/${customer_id}`)
            if (!customerResponse.ok) {
                throw new Error('Failed to fetch customer data')
            }
            const customerData = await customerResponse.json()

            // Fetch transactions
            if (customerData?.account?.id) {
                const transactionsResponse = await fetch(
                    `/api/transactions?accountId=${customerData.account.id}`,
                )
                if (!transactionsResponse.ok) {
                    throw new Error('Failed to fetch transactions')
                }
                const transactionsData = await transactionsResponse.json()
                setTransactions(Array.isArray(transactionsData) ? transactionsData : [])
            }

            setCustomer(customerData)
        } catch (err) {
            console.error('Error fetching data:', err)
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchData()
        }
    }, [id])

    if (isLoading) {
        return (
            <PageComponent>
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner />
                </div>
            </PageComponent>
        )
    }

    if (error) {
        return (
            <PageComponent>
                <div className="flex justify-center items-center h-64">
                    <div className="text-red-500">Error: {error}</div>
                </div>
            </PageComponent>
        )
    }

    if (!customer) {
        return (
            <PageComponent>
                <div className="flex justify-center items-center h-64">
                    <div>Customer not found</div>
                </div>
            </PageComponent>
        )
    }

    const account = customer.account

    return (
        <PageComponent>
            {customer && account && (
                <>
                    <PageHeader
                        userName={customer.fullName}
                        userId={customer.id.toString()}
                        active={customer.active}
                        formUrl={`/customers/${customer.id}`}
                        accountUrl={`/accounts/${account?.id}`}
                        addBtn
                    />
                </>
            )}

            {customer && account && transactions && (
                <CustomerStatsView initialCustomer={customer} initialTransactions={transactions} />
            )}
        </PageComponent>
    )
}
