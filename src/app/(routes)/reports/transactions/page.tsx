'use client'

import ReportObratTable from '@/components/features/reports/obratTable'
import Skeleton from '@/components/ui/skeleton'
import { SeznamObratuDTO } from '@/lib/services/customer/types'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

export default function TransactionsReportPage() {
    const [updatedTime, setUpdatedTime] = useState<string>('')
    const fetchCustomers = async (): Promise<SeznamObratuDTO[]> => {
        const endpoint = '/api/transactions/report-obratu'
        const response = await fetch(endpoint)
        console.log('Refetching')
        setUpdatedTime(new Date().toISOString())
        return response.json()
    }

    const { data: customers = [], isLoading } = useQuery<SeznamObratuDTO[]>({
        queryKey: ['transactions-report-obratu'],
        queryFn: fetchCustomers,
        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
    })

    return (
        <div className="w-full p-6 my-2">
            {isLoading || customers.length === 0 ? (
                <Skeleton className="h-96" type="table" />
            ) : (
                <ReportObratTable defaultData={customers} detailLinkPath="/customers" updatedTime={updatedTime} />
            )}
        </div>
    )
}
