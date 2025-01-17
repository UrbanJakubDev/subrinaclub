'use client'

import PageComponent from '@/components/features/detailPage/pageComponent'
import ReportBonusTable from '@/components/features/reports/bonusTable'
import FullReportBonusTable from '@/components/features/reports/bonusTableFull'
import DonutChart from '@/components/ui/charts/donutChart'
import SelectField from '@/components/ui/inputs/selectInput'
import Skeleton from '@/components/ui/skeleton'
import { quarterSelectOptions } from '@/lib/utils/dateFnc'
import { yearSelectOptions } from '@/lib/utils/dateFnc'
import { Button, Card } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

type Props = {}

type FormValues = {
  year: number;
  quarter: number;
}

interface BonusData {
  bonusId: number;
  bonusName: string;
  totalPoints: number;
  price: number;
  count: number;
  pointsThisSeason?: number;
  priceThisSeason?: number;
  countThisSeason?: number;
}

interface TransactionData {
  id: number;
  bonusId: number;
  bonusName: string;
  points: number;
  bonusPrice: number;
  year: number;
  quarter: number;
}

const BonusReportPage = (props: Props) => {
  const [pBonusTransactions, setPBonusTransactions] = useState<TransactionData[]>([])
  const [pBonusFull, setPBonusFull] = useState<BonusData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showChart, setShowChart] = useState(false)
  const methods = useForm<FormValues>({
    defaultValues: {
      year: new Date().getFullYear(),
      quarter: Math.floor(new Date().getMonth() / 3) + 1
    }
  })

  // Fetch premium bonus report
  const fetchPremiumBonusReport = async (year: number, quarter: number) => {
    const response = await fetch(`/api/transactions/premium-bonus?year=${year}&quarter=${quarter}`)
    const data = await response.json()
    setPBonusTransactions(data)
    return data
  }

  const fetchPremiumBonusFullReport = async () => {
    const response = await fetch(`/api/transactions/premium-bonus/full`)
    const data = await response.json()
    return data
  }

  const updateBonusData = (fullData: BonusData[], transactionData: TransactionData[]) => {
    const seasonalTotals = transactionData.reduce((acc: { [key: number]: { points: number; price: number; count: number } }, transaction: TransactionData) => {
      if (!acc[transaction.bonusId]) {
        acc[transaction.bonusId] = { points: 0, price: 0, count: 0 };
      }
      acc[transaction.bonusId].points += Math.abs(transaction.points);
      acc[transaction.bonusId].price += transaction.bonusPrice;
      acc[transaction.bonusId].count += 1;
      return acc;
    }, {});

    const updatedBonusData = fullData.map(bonus => ({
      ...bonus,
      pointsThisSeason: seasonalTotals[bonus.bonusId]?.points || 0,
      priceThisSeason: seasonalTotals[bonus.bonusId]?.price || 0,
      countThisSeason: seasonalTotals[bonus.bonusId]?.count || 0
    }));

    setPBonusFull(updatedBonusData);
    setIsLoading(false);
    // Delay chart rendering
    setTimeout(() => {
      setShowChart(true);
    }, 500);
  }

  // Revalidate page when form values change
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setShowChart(false);
    const [transactionData, fullData] = await Promise.all([
      fetchPremiumBonusReport(data.year, data.quarter),
      fetchPremiumBonusFullReport()
    ]);
    updateBonusData(fullData, transactionData);
  }

  // Initial fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setShowChart(false);
      const { year, quarter } = methods.getValues()
      const [transactionData, fullData] = await Promise.all([
        fetchPremiumBonusReport(year, quarter),
        fetchPremiumBonusFullReport()
      ]);
      updateBonusData(fullData, transactionData);
    }
    
    fetchInitialData();
  }, [])

  const renderForm = () => {
    return (
      <div className="w-full">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="flex gap-2">
              <SelectField
                label="Rok"
                name="year"
                options={yearSelectOptions()}
              />
              <SelectField
                label="Kvartál"
                name="quarter"
                options={quarterSelectOptions()}
              />
              <Button type="submit">Potvrdit</Button>
            </div>
          </form>
        </FormProvider>
      </div>
    )
  }

  // FullBonus report chart using components/donutChart
  const renderFullBonusChart = () => {
    if (!pBonusFull?.length) return null

    const chartData = {
      options: {
        chart: {
          width: '100%',
          height: '100%',
          type: 'donut'
        },
        labels: pBonusFull.map(item => item.bonusName),
        legend: {
          position: 'right',
          formatter: function (val: number, opts: any) {
            return opts.w.globals.labels[opts.seriesIndex] + ":  " + val
          }
        },
        dataLabels: {
          enabled: true,
        }
      },
      series: pBonusFull.map(item => item.totalPoints)
    }

    return (
        <DonutChart
          data={chartData}
        />
    )
  }

  return (
    <PageComponent>
      <div className="flex justify-center mb-4">
        {renderForm()}
      </div>

      <Card className="rounded-sm p-4 shadow-sm mb-4">
        {pBonusTransactions && (
          <ReportBonusTable defaultData={pBonusTransactions} />
        )}
      </Card>

      <Card className="rounded-sm p-4 shadow-sm">
        {pBonusFull && (
          <div className="gap-4">
            <div className="w-full">
              <FullReportBonusTable defaultData={pBonusFull} />
            </div>
            <div className="w-full min-h-[400px]">
              {isLoading ? (
                <Skeleton className="h-[400px] w-full rounded-lg" />
              ) : (
                typeof window !== 'undefined' && showChart && renderFullBonusChart()
              )}
            </div>
          </div>
        )}
      </Card>
    </PageComponent>
  )
}

export default BonusReportPage