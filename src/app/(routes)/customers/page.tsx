'use client';
import { Card, Switch } from "@material-tailwind/react";
import { useState, Suspense, useEffect } from "react";
import CustomerTable from "@/components/features/customer/customerTable";
import Loader from "@/components/ui/loader";
import PageComponent from "@/components/features/detailPage/pageComponent";
import { useCustomers } from "@/lib/queries/customer/queries";
import Skeleton from "@/components/ui/skeleton";
import NoData from "@/components/ui/noData";
import { Customer } from "@/types/customer";

export default function CustomersPage() {
  const [activeUsers, setActiveUsers] = useState(true);
  const { data: response, isLoading, error, refetch } = useCustomers(activeUsers);

  // Handle active users switch
  const handleActiveUsers = () => {
    setActiveUsers(prev => !prev);
  }

  useEffect(() => {
    refetch();
  }, [activeUsers, refetch]);


  return (
    <PageComponent>
      <Card className="w-full mb-4 p-6 flex flex-row justify-between">
        <Switch
          label={`Zobrazit ${activeUsers ? "aktivní" : "neaktivní"} zákazníky`}
          onChange={handleActiveUsers}
          checked={activeUsers}
          crossOrigin={undefined} />
      </Card>

      <Suspense fallback={<div className="w-full flex justify-center p-8"><Loader /></div>}>
        <div className="w-full">
          {isLoading ? (
            <Skeleton className="w-full h-48" type="table" />
          ) : error ? (
            <Card className="w-full p-6 bg-red-50">
              <div className="text-red-700">
                <h3 className="font-bold">Error occurred</h3>
                <p>{error.message}</p>
              </div>
            </Card>
          ) : !response?.data?.length ? (
            <NoData />
          ) : (
            <CustomerTable
              defaultData={response.data as Customer[]}
              detailLinkPath="/customers"
              timeInfo={new Date(response.metadata.loadedAt).toLocaleString()}
              refresh={refetch}
            />
          )}
        </div>
      </Suspense>
    </PageComponent>
  );
}
