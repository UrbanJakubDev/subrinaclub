"use client";

import React from "react";
import SalesManagerStatsTable from "./salesManagerStatsTable";
import { Card, Typography } from "@material-tailwind/react";
import { quarterSelectOptions, yearSelectOptions } from "@/lib/utils/dateFnc";
import SimpleSelectInput from "../../ui/inputs/simpleSelectInput";
import NoData from "@/components/ui/noData";
import Skeleton from "@/components/ui/skeleton";
import ColumnChart from "@/components/ui/charts/columnChart";
import CustomerPointsWidget from "./CustomerPointsWidget";
import { QuarterDate } from "@/lib/utils/quarterDateUtils";

// Add proper types for our data structures
interface Transaction {
  id: number;
  accountId: number;
  points: number;
  quarter: number;
  year: number;
}

interface SavingPeriod {
  id: number;
  status: string;
  startYear: number;
  startQuarter: number;
  endYear: number;
  endQuarter: number;
  availablePoints: number;
}

interface Account {
  id: number;
  active: boolean;
  lifetimePoints: number;
  currentYearPoints: number;
  totalDepositedPoints: number;
  totalWithdrawnPonits: number;
  customerId: number;
  averagePointsBeforeSalesManager: number;
  savingPeriods: SavingPeriod[];
}

interface CustomersCountsInfo {
  allCustomers: number;
  activeCustomers: number;
}

interface Dealer {
  id: number;
  active: boolean;
  fullName: string;
  registrationNumber: number;
}

interface SalesManager {
  id: number;
  fullName: string;
}

interface Customer {
  id: number;
  publicId: string;
  fullName: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  birthDate: string | null;
  registrationNumber: string | number;
  ico: string | null;
  dic: string | null;
  email: string | null;
  phone: string | null;
  street: string | null;
  city: string | null;
  zip: string | null;
  country: string | null;
  note: string | null;
  systemActive: boolean;
  registratedSince: string | null;
  salonName: string | null;
  address: string | null;
  town: string | null;
  psc: string | null;
  phoneNumber: string | null;
  emailAddress: string | null;
  dealerId: number;
  salesManagerId: number;
  salesManagerSinceQ: number;
  salesManagerSinceYear: number;
  salesManagerSince: string | null;
  dealer: Dealer;
  salesManager: SalesManager;
  account: Account;
}

interface QuarterSums {
  Q1: number;
  Q2: number;
  Q3: number;
  Q4: number;
}

interface ProcessedCustomerData extends Customer {
  transactions: Transaction[];
  quarterSums: QuarterSums;
  quarterDifferences: Record<`Q${1 | 2 | 3 | 4}`, number>;
  selectedQuarterDifference: number;
}

type SalesManagerStatsProps = {
  salesManager?: {
    id: number;
    fullName: string;
  };
};

export default function SalesManagerStats({
  salesManager,
}: SalesManagerStatsProps) {

  // Actual year and quarter
  const qd = new QuarterDate(new Date());
  const actualYear = qd.getActualYearAndQuarter().actualYear;
  const actualQuarter = qd.getActualYearAndQuarter().actualQuarter;

  const salesManagerId = salesManager?.id;
  const [loading, setLoading] = React.useState<boolean>(true);
  const [apiData, setApiData] = React.useState<ProcessedCustomerData[]>([]);
  const [selectedYear, setSelectedYear] = React.useState(actualYear);
  const [selectedQuarter, setSelectedQuarter] = React.useState(actualQuarter);
  const [isClient, setIsClient] = React.useState(false);
  const [isDataReady, setIsDataReady] = React.useState(false);
  // Memoize static options
  const yearDial = React.useMemo(() => yearSelectOptions(), []);
  const quarterDial = React.useMemo(() => quarterSelectOptions(), []);

  const [chartSeries, setChartSeries] = React.useState<any[]>([
    {
      name: "Quarters",
      data: [50, 40, 300, 320],
    }
  ]);
  const [chartCategories] = React.useState<string[]>(["Q1", "Q2", "Q3", "Q4"]);

  // Transaction part
  const [transactionData, setTransactionData] = React.useState<Transaction[]>([]);

  // Customers part
  const [customersData, setCustomersData] = React.useState<Customer[]>([]);
  const [customersCountsInfo, setCustomersCountsInfo] = React.useState<CustomersCountsInfo>({
    allCustomers: 0,
    activeCustomers: 0
  });

  // Memoize API fetch functions
  const fetchTransactions = React.useCallback(async (year: number) => {
    if (!salesManagerId || !year) return null;

    const response = await fetch(
      `/api/sales-manager/transactions?salesManagerId=${salesManagerId}&year=${year}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.json();
  }, [salesManagerId]);

  const fetchCustomers = React.useCallback(async () => {
    if (!salesManagerId) return null;

    const response = await fetch(
      `/api/sales-manager/customers?salesManagerId=${salesManagerId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.json();
  }, [salesManagerId]);

  const fetchCustomersCountsInfo = React.useCallback(async () => {
    if (!salesManagerId) return null;

    const response = await fetch(
      `/api/sales-manager/customers/info?salesManagerId=${salesManagerId}&year=${selectedYear}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.json();
  }, [salesManagerId, selectedYear]);

  // Memoize data processing functions
  const sumQuarterPoints = React.useCallback((transactions: Transaction[], quarter: number): number => {
    return transactions
      .filter(transaction => transaction.quarter === quarter)
      .reduce((sum, transaction) => sum + (transaction.points || 0), 0);
  }, []);

  const quarterSum = React.useCallback((quarter: number) => {
    return transactionData.reduce((sum, transaction) => {
      if (transaction.quarter === quarter) {
        return sum + (transaction.points > 0 ? transaction.points : 0);
      }
      return sum;
    }, 0);
  }, [transactionData]);


  // Join data from customers and transactions
  const joinData = React.useCallback((customers: Customer[], transactions: Transaction[]): ProcessedCustomerData[] => {
    if (!Array.isArray(customers) || !Array.isArray(transactions)) {
      return [];
    }

    return customers.map((customer) => {
      const customerTransactions = transactions.filter(
        (transaction) => transaction.accountId === customer.account?.id
      );

      // Sum positiove points from the transactions fot the cutomer for the selected year and return this as currentYearPoints
      const currentYearPoints = customerTransactions.reduce((sum, transaction) => sum + (transaction.points > 0 ? transaction.points : 0), 0);

      const quarterSums = {
        Q1: sumQuarterPoints(customerTransactions, 1),
        Q2: sumQuarterPoints(customerTransactions, 2),
        Q3: sumQuarterPoints(customerTransactions, 3),
        Q4: sumQuarterPoints(customerTransactions, 4),
      };

      const quarterDifferences: Record<`Q${1 | 2 | 3 | 4}`, number> = {
        Q1: quarterSums.Q1 - (customer.account?.averagePointsBeforeSalesManager || 0),
        Q2: quarterSums.Q2 - (customer.account?.averagePointsBeforeSalesManager || 0),
        Q3: quarterSums.Q3 - (customer.account?.averagePointsBeforeSalesManager || 0),
        Q4: quarterSums.Q4 - (customer.account?.averagePointsBeforeSalesManager || 0),
      };

      // Check if the customer is active in the selected quarter based on if he has points in the selected year and quarter
      const isCustomerActiveInSelectedQuarter = customerTransactions.some(transaction => transaction.year === selectedYear && transaction.quarter === selectedQuarter);


      return {
        ...customer,
        transactions: customerTransactions,
        quarterSums,
        quarterDifferences,
        selectedQuarterDifference: quarterDifferences[`Q${selectedQuarter}` as keyof typeof quarterDifferences],
        currentYearPoints,
        isCustomerActiveInSelectedQuarter,
      };
    });
  }, [selectedQuarter, sumQuarterPoints, salesManagerId, selectedYear]);


  // Get count of active cutomers in selected year from ApiData and update customersCountsInfo
  const getActiveCustomersCount = React.useCallback((apiData: any[]) => {
    return apiData.filter(customer => customer.isCustomerActiveInSelectedQuarter).length;
  }, [apiData]);

  // Handle year change

  const handleYearChange = (value: number) => {
    setSelectedYear(value);
  };

  const handleQuarterChange = (value: number) => {
    setSelectedQuarter(value);
  };

  // Get API data
  const getApiData = React.useCallback(async () => {
    if (!salesManagerId || !selectedYear) return;

    setIsDataReady(false);
    setLoading(true);
    setTransactionData([]);
    setCustomersData([]);
    setCustomersCountsInfo({
      allCustomers: 0,
      activeCustomers: 0
    });

    try {
      const [transactionsData, customersData, customersInfo] = await Promise.all([
        fetchTransactions(selectedYear),
        fetchCustomers(),
        fetchCustomersCountsInfo()
      ]);

      if (transactionsData && customersData) {
        setTransactionData(transactionsData);
        setCustomersData(customersData);
        setCustomersCountsInfo(customersInfo || {
          allCustomers: 0,
          activeCustomers: 0
        });
        const joinedData = joinData(customersData, transactionsData);
        setApiData(joinedData);
        setIsDataReady(true);

        const activeCustomersCount = getActiveCustomersCount(joinedData);
        setCustomersCountsInfo(prevCounts => ({
          ...prevCounts,
          activeCustomers: activeCustomersCount
        }));

        // Update chart series after data is loaded
        const newQuarterSums = [1, 2, 3, 4].map(quarter =>
          transactionsData.reduce((sum: number, transaction: Transaction) => {
            if (transaction.quarter === quarter) {
              return sum + (transaction.points > 0 ? transaction.points : 0);
            }
            return sum;
          }, 0)
        );

        setChartSeries([{
          name: "Quarters",
          data: newQuarterSums,
        }]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsDataReady(false);
    } finally {
      setLoading(false);
    }
  }, [selectedYear, fetchTransactions, fetchCustomers, fetchCustomersCountsInfo, joinData, salesManagerId]);

  // Calculate total points
  const totalPoints = React.useMemo(() =>
    customersData.reduce((sum, customer) =>
      sum + (customer.account?.lifetimePoints || 0), 0
    ), [customersData]);


  // Calculate quarter points
  const quarterPoints = React.useMemo(() => {
    return [1, 2, 3, 4].map(quarter =>
      quarterSum(quarter)
    );
  }, [quarterSum]);

  // Sum positive points in selectedQuarterDifference column in apiData
  const selectedQuarterDifferencePositive = React.useMemo(() => {
    return apiData.reduce((sum, customer) =>
      sum + (customer.selectedQuarterDifference > 0 ? customer.selectedQuarterDifference : 0), 0
    );
  }, [apiData]);

  // Sum points in selectedQuarterDifference column in apiData
  const selectedQuarterDifferenceSum = React.useMemo(() => {
    return apiData.reduce((sum, customer) =>
      sum + (customer.selectedQuarterDifference), 0
    );
  }, [apiData]);

  // Sum averagePointsBeforeSalesManager in apiData
  const averagePointsBeforeSalesManagerSum = React.useMemo(() => {
    return apiData.reduce((sum, customer) =>
      sum + (customer.account?.averagePointsBeforeSalesManager || 0), 0
    );
  }, [apiData]);

  // Effects
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (!isClient || !salesManagerId || !selectedYear || !selectedQuarter) return;
    getApiData();
  }, [isClient, salesManagerId, selectedYear, selectedQuarter, getApiData]);

  if (!isClient) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Skeleton type="table" />
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full gap-4 mb-4">
        <div className="w-1/3">
          <Card className="shadow-md border p-4 border-gray-200 !rounded-lg grow">
            <Typography className="text-2xl font-bold text-gray-900">{salesManager?.fullName}</Typography>
            <Typography className="mb-2 font-light">Statistika bodů pro obchodníka</Typography>
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
            <ColumnChart
              series={chartSeries}
              categories={chartCategories}
              title="Počet bodů za čtvrtletí"
              description="Počet bodů za členy, podle čtvrtletí pro obchodníka"
            />
          </Card>


        </div>

        <div className="flex flex-col justify-center w-2/3 h-full gap-4 mx-auto">
          {/* <div className="flex justify-between gap-2">
            <SimpleStat title="Celkem za členy v Q1" value={quarterSum(1)} />
            <SimpleStat title="Celkem za členy v Q2" value={quarterSum(2)} />
            <SimpleStat title="Celkem za členy v Q3" value={quarterSum(3)} />
            <SimpleStat title="Celkem za členy v Q4" value={quarterSum(4)} />
            <SimpleStat
              title="Celkem za rok"
              value={quarterSum(1) + quarterSum(2) + quarterSum(3) + quarterSum(4)}
            />
          </div>

          <div className="flex flex-col w-full gap-2 mx-auto my-4">
            <SimpleStat title="Klubové konto" value={totalPoints} />
            <CustomersActiveWidget
              title="Aktivní zákazníci"
              allCustomers={customersCountsInfo.allCustomers}
              systemActiveCustomers={customersCountsInfo.systemActiveCustomers}
              activeCustomers={customersCountsInfo.activeCustomers}
            />
          </div> */}
          <CustomerPointsWidget
            selectedQuarter={selectedQuarter}
            quarterPoints={quarterPoints}
            customersCountsInfo={customersCountsInfo}
            clubPoints={totalPoints}
            yearPoints={quarterSum(1) + quarterSum(2) + quarterSum(3) + quarterSum(4)}
            selectedQuarterDifferencePositive={selectedQuarterDifferencePositive}
            selectedQuarterDifferenceSum={selectedQuarterDifferenceSum}
            averagePointsBeforeSalesManagerSum={averagePointsBeforeSalesManagerSum}
          />

        </div>
      </div>

      {loading ? (
        <Skeleton type="table" />
      ) : isDataReady && apiData.length > 0 ? (
        <SalesManagerStatsTable
          title="Statistika bodů pro obchodního zástupce"
          detailLinkPath="customers/"
          defaultData={apiData}
          selectedQuarter={selectedQuarter}
          selectedYear={selectedYear}
        />
      ) : (
        <NoData />
      )}
    </>
  );
}



