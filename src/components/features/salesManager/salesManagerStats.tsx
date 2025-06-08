'use client'

import React from 'react'
import SalesManagerStatsTable from './salesManagerStatsTable'
import { Card, Typography } from '@material-tailwind/react'
import { quarterSelectOptions, yearSelectOptions } from '@/lib/utils/dateFnc'
import SimpleSelectInput from '../../ui/inputs/simpleSelectInput'
import NoData from '@/components/ui/noData'
import Skeleton from '@/components/ui/skeleton'
import ColumnChart from '@/components/ui/charts/columnChart'
import CustomerPointsWidget from './CustomerPointsWidget'
import { QuarterDate } from '@/lib/utils/quarterDateUtils'
import {
    useSalesManagerCustomers,
    useSalesManagerCustomersCountsInfo,
    useSalesManagerTransactions,
} from '@/lib/queries/salesManager/queries'

// Add proper types for our data structures
interface Transaction {
    id: number
    accountId: number
    points: number
    quarter: number
    year: number
}

interface SavingPeriod {
    id: number
    status: string
    startYear: number
    startQuarter: number
    endYear: number
    endQuarter: number
    availablePoints: number
}

interface Account {
    id: number
    active: boolean
    lifetimePoints: number
    lifetimePointsCorrection?: number
    currentYearPoints: number
    totalDepositedPoints: number
    totalWithdrawnPonits: number
    customerId: number
    averagePointsBeforeSalesManager: number
    savingPeriods: SavingPeriod[]
}

interface CustomersCountsInfo {
    allCustomers: number
    activeCustomers: number
    systemActiveCustomers: number
}

interface Dealer {
    id: number
    active: boolean
    fullName: string
    registrationNumber: number
}

interface SalesManager {
    id: number
    fullName: string
}

interface Customer {
    id: number
    publicId: string
    fullName: string
    active: boolean
    createdAt: string
    updatedAt: string
    birthDate: string | null
    registrationNumber: string | number
    ico: string | null
    dic: string | null
    email: string | null
    phone: string | null
    street: string | null
    city: string | null
    zip: string | null
    country: string | null
    note: string | null
    systemActive: boolean
    registratedSince: string | null
    salonName: string | null
    address: string | null
    town: string | null
    psc: string | null
    phoneNumber: string | null
    emailAddress: string | null
    dealerId: number
    salesManagerId: number
    salesManagerSinceQ: number
    salesManagerSinceYear: number
    salesManagerSince: string | null
    dealer: Dealer
    salesManager: SalesManager
    account: Account
}

interface QuarterSums {
    Q1: number
    Q2: number
    Q3: number
    Q4: number
}

interface ProcessedCustomerData extends Customer {
    transactions: Transaction[]
    quarterSums: QuarterSums
    quarterDifferences: Record<`Q${1 | 2 | 3 | 4}`, number>
    selectedQuarterDifference: number
    isCustomerActiveInSelectedQuarter?: boolean
    currentYearPoints?: number
    lifetimePointsCorrected?: number
}

type SalesManagerStatsProps = {
    salesManager: SalesManager
}

export default function SalesManagerStats({ salesManager }: SalesManagerStatsProps) {
    // Actual year and quarter
    const qd = new QuarterDate(new Date())
    const actualYear = qd.getActualYearAndQuarter().actualYear
    const actualQuarter = qd.getActualYearAndQuarter().actualQuarter

    const salesManagerId = salesManager.id
    const [selectedYear, setSelectedYear] = React.useState(actualYear)
    const [selectedQuarter, setSelectedQuarter] = React.useState(actualQuarter)
    const [isClient, setIsClient] = React.useState(false)

    // Memoize static options
    const yearDial = React.useMemo(() => yearSelectOptions(), [])
    const quarterDial = React.useMemo(() => quarterSelectOptions(), [])

    // Use TanStack Query hooks with proper destructuring
    const {
        data: transactionsResponse,
        isLoading: isTransactionsLoading,
        refetch: refetchTransactions,
    } = useSalesManagerTransactions(salesManagerId, selectedYear)
    const transactions = transactionsResponse?.data || []

    const {
        data: customersResponse,
        isLoading: isCustomersLoading,
        refetch: refetchCustomers,
    } = useSalesManagerCustomers(salesManagerId, selectedYear)
    const customers = customersResponse?.data || []

    const {
        data: countInfoResponse,
        isLoading: isCountInfoLoading,
        refetch: refetchCountInfo,
    } = useSalesManagerCustomersCountsInfo(salesManagerId, selectedYear)
    const countInfo = countInfoResponse?.data || {
        allCustomers: 0,
        activeCustomers: 0,
        systemActiveCustomers: 0,
    }

    // Processing functions
    const sumQuarterPoints = React.useCallback(
        (transactions: Transaction[], quarter: number): number => {
            if (!Array.isArray(transactions)) return 0

            return transactions
                .filter(transaction => transaction.quarter === quarter)
                .reduce((sum, transaction) => sum + (transaction.points || 0), 0)
        },
        [],
    )

    // Process and join data
    const processedData = React.useMemo(() => {
        if (!Array.isArray(customers) || !Array.isArray(transactions)) {
            return []
        }

        return customers.map(customer => {
            const customerTransactions = Array.isArray(transactions)
                ? transactions.filter(transaction => transaction.accountId === customer.account?.id)
                : []

            // Sum positive points for the current year
            const currentYearPoints = Array.isArray(customerTransactions)
                ? customerTransactions.reduce(
                      (sum, transaction) => sum + (transaction.points > 0 ? transaction.points : 0),
                      0,
                  )
                : 0

            const quarterSums = {
                Q1: sumQuarterPoints(customerTransactions, 1),
                Q2: sumQuarterPoints(customerTransactions, 2),
                Q3: sumQuarterPoints(customerTransactions, 3),
                Q4: sumQuarterPoints(customerTransactions, 4),
            }
            const quarterDifferences: Record<`Q${1 | 2 | 3 | 4}`, number> = {
                Q1: quarterSums.Q1 - Number(customer.account?.averagePointsBeforeSalesManager || 0),
                Q2: quarterSums.Q2 - Number(customer.account?.averagePointsBeforeSalesManager || 0),
                Q3: quarterSums.Q3 - Number(customer.account?.averagePointsBeforeSalesManager || 0),
                Q4: quarterSums.Q4 - Number(customer.account?.averagePointsBeforeSalesManager || 0),
            }

            // Is customer active in selected quarter
            const isCustomerActiveInSelectedQuarter =
                Array.isArray(customerTransactions) &&
                customerTransactions.some(
                    transaction =>
                        transaction.year === selectedYear &&
                        transaction.quarter === selectedQuarter,
                )

            // Add this calculation
            const lifetimePointsCorrected = (customer.account?.lifetimePoints || 0) + 
                                           (customer.account?.lifetimePointsCorrection || 0)

            return {
                ...customer,
                transactions: customerTransactions,
                quarterSums,
                quarterDifferences,
                selectedQuarterDifference: quarterDifferences[`Q${selectedQuarter}` as keyof typeof quarterDifferences],
                currentYearPoints,
                isCustomerActiveInSelectedQuarter,
                lifetimePointsCorrected: lifetimePointsCorrected,
            }
        })
    }, [customers, transactions, selectedQuarter, selectedYear, sumQuarterPoints])

    // Calculate total points
    const totalPoints = React.useMemo(() => {
        if (!Array.isArray(customers)) return 0

        return customers.reduce((sum, customer) => 
            sum + (customer.account?.lifetimePoints || 0) + (customer.account?.lifetimePointsCorrection || 0), 
        0)
    }, [customers])

    // Calculate quarter sums
    const quarterPoints = React.useMemo(() => {
        if (!Array.isArray(transactions)) return [0, 0, 0, 0]

        return [1, 2, 3, 4].map(quarter =>
            transactions
                .filter(t => t.quarter === quarter)
                .reduce((sum, t) => sum + (t.points > 0 ? t.points : 0), 0),
        )
    }, [transactions])

    // Total yearly points
    const yearPoints = React.useMemo(() => {
        if (!Array.isArray(quarterPoints)) return 0

        return quarterPoints.reduce((sum, points) => sum + points, 0)
    }, [quarterPoints])

    // Selected quarter difference calculations
    const selectedQuarterDifferencePositive = React.useMemo(() => {
        if (!Array.isArray(processedData)) return 0

        return processedData.reduce(
            (sum, customer) =>
                sum +
                (customer.selectedQuarterDifference > 0 ? customer.selectedQuarterDifference : 0),
            0,
        )
    }, [processedData])

    const selectedQuarterDifferenceSum = React.useMemo(() => {
        if (!Array.isArray(processedData)) return 0

        return processedData.reduce((sum, customer) => sum + customer.selectedQuarterDifference, 0)
    }, [processedData])

    // Sum averagePointsBeforeSalesManager
    const averagePointsBeforeSalesManagerSum = React.useMemo(() => {
        if (!Array.isArray(processedData)) return 0
        return processedData.reduce(
            (sum, customer) => sum + Number(customer.account?.averagePointsBeforeSalesManager || 0),
            0
        )
    }, [processedData])

    // Chart data
    const chartSeries = React.useMemo(
        () => [
            {
                name: 'Quarters',
                data: quarterPoints,
            },
        ],
        [quarterPoints],
    )

    const chartCategories = ['Q1', 'Q2', 'Q3', 'Q4']

    // Handle inputs with refetching
    const handleYearChange = (value: number) => {
        setSelectedYear(value)
        // The queries will automatically refetch when selectedYear changes
        // But we can also manually trigger refetches to ensure data consistency
        setTimeout(() => {
            refetchTransactions()
            refetchCustomers()
            refetchCountInfo()
        }, 0)
    }

    const handleQuarterChange = (value: number) => {
        setSelectedQuarter(value)
        // For quarter change, only refetch count info since it might depend on quarter
        setTimeout(() => {
            refetchCountInfo()
        }, 0)
    }

    // Set client-side rendering
    React.useEffect(() => {
        setIsClient(true)
    }, [])

    // Loading state
    const isLoading = isTransactionsLoading || isCustomersLoading || isCountInfoLoading
    const hasData = Array.isArray(processedData) && processedData.length > 0

    if (!isClient) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Skeleton type="table" />
            </div>
        )
    }

    return (
        <>
            <div className="flex w-full gap-4 mb-4">
                <div className="w-1/3">
                    <Card className="shadow-md border p-4 border-gray-200 !rounded-lg grow">
                        <Typography className="text-2xl font-bold text-gray-900">
                            {salesManager?.fullName}
                        </Typography>
                        <Typography className="mb-2 font-light">
                            Statistika bodů pro obchodníka
                        </Typography>
                        <div className="flex gap-2">
                            <SimpleSelectInput
                                label="Rok"
                                options={yearDial as any}
                                onChange={handleYearChange}
                                value={selectedYear}
                            />
                            <SimpleSelectInput
                                label="Kvartál"
                                options={quarterDial as any}
                                onChange={handleQuarterChange}
                                value={selectedQuarter}
                            />
                        </div>
                    </Card>

                    <Card className="shadow-md border p-4 border-gray-200 !rounded-lg grow mt-4">
                      {/* TODO: Add salesManager statt chart component which pass only data and seried and categories will calculate in component */}
                        <ColumnChart
                            series={chartSeries}
                            categories={chartCategories}
                            title="Počet bodů za čtvrtletí"
                            description="Počet bodů za členy, podle čtvrtletí pro obchodníka"
                        />
                    </Card>
                </div>

                <div className="flex flex-col justify-center w-2/3 h-full gap-4 mx-auto">
                    <CustomerPointsWidget
                        selectedQuarter={selectedQuarter}
                        quarterPoints={quarterPoints}
                        customersCountsInfo={countInfo as any}
                        clubPoints={totalPoints}
                        yearPoints={yearPoints}
                        selectedQuarterDifferencePositive={selectedQuarterDifferencePositive}
                        selectedQuarterDifferenceSum={selectedQuarterDifferenceSum}
                        averagePointsBeforeSalesManagerSum={averagePointsBeforeSalesManagerSum}
                    />
                </div>
            </div>

            {isLoading ? (
                <Skeleton type="table" />
            ) : hasData ? (
                <SalesManagerStatsTable
                    title="Statistika bodů pro obchodního zástupce"
                    detailLinkPath="customers/"
                    defaultData={processedData as any}
                    selectedQuarter={selectedQuarter}
                    selectedYear={selectedYear}
                />
            ) : (
                <NoData />
            )}

            <pre>{JSON.stringify(customers, null, 2)}</pre>
            <pre>{JSON.stringify(processedData, null, 2)}</pre>
        </>
    )
}
