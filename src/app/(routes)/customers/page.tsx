'use client';
import { Card, Switch } from "@material-tailwind/react";
import { useState, useEffect, Suspense } from "react";
import CustomerTable from "@/components/features/customer/customerTable";
import Loader from "@/components/ui/loader";
import PageComponent from "@/components/features/detailPage/pageComponent";
import { toast } from "react-toastify";

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

// Separate component for the customer table with data fetching
function CustomerTableWithData({ activeUsers }: { activeUsers: boolean }) {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/customers?active=${activeUsers}`);
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
        const fetchedData = await response.json();
        // Transform the data to match the expected structure
        const formattedData = fetchedData.map((customer: any) => ({
          ...customer,
          id: customer.id.toString(),
          account: {
            ...customer.account,
            // Transform the nested savingPeriod.availablePoints to savingPeriodAvailablePoints
            savingPeriodAvailablePoints: customer.account?.savingPeriod?.availablePoints ?? 0
          }
        }));

        // Sort by fullName ascending
        formattedData.sort((a, b) => a.fullName.localeCompare(b.fullName));

        
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Nepodařilo se načíst seznam zákazníků");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeUsers]);

  if (loading) {
    return <Loader />;
  }

  return <CustomerTable defaultData={data} detailLinkPath="/customers" />;
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
          label={`Zobrazit ${activeUsers ? "aktivní" : "neaktivní"} zákazníky`}
          onChange={handleActiveUsers}
          checked={activeUsers}
          crossOrigin={undefined} />
      </Card>
      
      <Suspense fallback={<div className="w-full flex justify-center p-8"><Loader /></div>}>
        <CustomerTableWithData activeUsers={activeUsers} />
      </Suspense>
    </PageComponent>
  );
}
