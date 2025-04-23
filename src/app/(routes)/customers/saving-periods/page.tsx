"use client";

import CustomerSavingPeriodsTable from "@/components/features/customer/customerSavingPeriodsTable";
import PageComponent from "@/components/features/detailPage/pageComponent";
import Skeleton from "@/components/ui/skeleton";
import { useCustomers } from "@/lib/queries/customer/queries";
import { Customer } from "@/types/customer";

export default function SavingPeriodOverwievPage() {

    const { data: customers, isLoading: isLoadingCustomers, refetch: refetchCustomers } = useCustomers(true);

    return (
        <PageComponent full>
            {isLoadingCustomers ? (
               <Skeleton className="h-96" type="table" />
            ) : (
                <CustomerSavingPeriodsTable 
                    defaultData={customers?.data as Customer[]} 
                    detailLinkPath="/customers" 
                    onRefetchNeeded={refetchCustomers}
                    timeInfo={new Date(customers?.metadata.loadedAt ?? new Date()).toLocaleString()}
                />
            )}
        </PageComponent>
    )
}