'use client';
import { Card, Switch } from "@material-tailwind/react";
import { useState, Suspense, useEffect } from "react";
import CustomerTable from "@/components/features/customer/customerTable";
import Loader from "@/components/ui/loader";
import PageComponent from "@/components/features/detailPage/pageComponent";
import { useCustomers } from "@/lib/queries/customer/queries";
import { Customer } from "@/types/customer";

interface CustomerResponse {
  data: Customer[];
  metadata: {
    loadedAt: string;
    timezone: string;
  }
}

export default function CustomersPage() {
  const [activeUsers, setActiveUsers] = useState(true);

  // Handle active users switch
  const handleActiveUsers = () => {
    setActiveUsers(prev => !prev);
  }

  const { data: response, isLoading, error, refetch } = useCustomers(activeUsers);

  useEffect(() => {
    refetch(); // Force refetch when activeUsers changes
  }, [activeUsers, refetch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!response) return <div>No customers found</div>;

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
        <CustomerTable
          defaultData={response.data}
          detailLinkPath="/customers"
          timeInfo={new Date(response.metadata.loadedAt).toLocaleString()}
        />
      </Suspense>


      <pre className="mt-4">
        {JSON.stringify(response, null, 2)}
      </pre>
    </PageComponent>
  );
}
