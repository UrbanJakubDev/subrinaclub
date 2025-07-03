'use client';
import { Card, Switch } from "@material-tailwind/react";
import { useState, Suspense } from "react";
import CustomerTable from "@/components/features/customer/customerTable";
import Loader from "@/components/ui/loader";
import PageComponent from "@/components/features/detailPage/pageComponent";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

// Define the Customer type
interface Customer {
  id: string;
  active: boolean;
  registrationNumber: string;
  fullName: string;
  salonName: string;
  address?: string;
  town?: string;
  psc?: string;
  phone?: string;
  ico?: string;
  salesManager?: {
    fullName: string;
  };
  dealer?: {
    fullName: string;
  };
  account?: {
    currentYearPoints: number;
    lifetimePoints: number;
    savingPeriodAvailablePoints: number;
  };
}



// Fetch function for TanStack Query
export const fetchCustomers = async (activeUsers: boolean): Promise<Customer[]> => {
  const response = await fetch(`/api/customers?active=${activeUsers}`);
  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }
  const data = await response.json();
  // Sort by fullName ascending
  return data.sort((a: Customer, b: Customer) => a.fullName.localeCompare(b.fullName));
};

// Separate component for the customer table with data fetching
function CustomerTableWithData({ activeUsers }: { activeUsers: boolean }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['customers', activeUsers],
    queryFn: () => fetchCustomers(activeUsers),
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  

  if (error) {
    toast.error("Nepodařilo se načíst seznam zákazníků");
    return <div>Error loading customers</div>;
  }

  if (isLoading) {
    return <Loader />;
  }

  return <CustomerTable defaultData={data || []} detailLinkPath="/customers" activeUsers={activeUsers} />;
}

export default function CustomersPage() {
  const [activeUsers, setActiveUsers] = useState(true);

  // Handle active users switch
  const handleActiveUsers = () => {
    const newActiveUsers = !activeUsers;
    setActiveUsers(newActiveUsers);
  }

  return (
    <PageComponent>
      <Card className="w-full mb-4 p-6 flex flex-row justify-between">
        <Switch
          label={`Zobrazit ${activeUsers ? "neaktivní" : "aktivní"} zákazníky`}
          onChange={handleActiveUsers}
          checked={!activeUsers}
          crossOrigin={undefined} />
      </Card>
      
      <Suspense fallback={<div className="w-full flex justify-center p-8"><Loader /></div>}>
        <CustomerTableWithData activeUsers={activeUsers} />
      </Suspense>
    </PageComponent>
  );
}
