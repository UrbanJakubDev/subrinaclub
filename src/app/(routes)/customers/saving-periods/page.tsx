"use client";

import CustomerSavingPeriodsTable from "@/components/features/customer/customerSavingPeriodsTable";
import PageComponent from "@/components/features/detailPage/pageComponent";
import { useEffect } from "react";
import { CustomerWithAccountDataAndActiveSavingPeriodDTO } from "@/lib/services/customer/types";
import { useState } from "react";
import Skeleton from "@/components/ui/skeleton";

export default function SavingPeriodOverwievPage() {

    const [customerWithSavingPeriods, setCustomerWithSavingPeriods] = useState<CustomerWithAccountDataAndActiveSavingPeriodDTO[]>([]);

    // Define the fetch function outside useEffect so we can reuse it
    const fetchCustomerWithSavingPeriods = async () => {
        const endpoint = '/api/customers/saving-periods';
        const response = await fetch(endpoint);
        const data = await response.json();
        setCustomerWithSavingPeriods(data);
    }

    useEffect(() => {
        fetchCustomerWithSavingPeriods();
    }, []);

    // Handle refetch function that will be triggered from the table component
    const handleRefetch = () => {
        fetchCustomerWithSavingPeriods();
    };

    // Find in data customers hwich fullName contains Test
    const testCustomers = customerWithSavingPeriods.filter(customer => customer.fullName.includes('Test'));
    
    

    return (
        <PageComponent full>
            {customerWithSavingPeriods.length === 0 ? (
               <Skeleton className="h-96" type="table" />
            ) : (
                <CustomerSavingPeriodsTable 
                    defaultData={customerWithSavingPeriods} 
                    detailLinkPath="/customers" 
                    onRefetchNeeded={handleRefetch}
                />
            )}
            <div>
                <h1>Test customers</h1>
                <pre>{JSON.stringify(testCustomers, null, 2)}</pre>
            </div>
        </PageComponent>
    )
}