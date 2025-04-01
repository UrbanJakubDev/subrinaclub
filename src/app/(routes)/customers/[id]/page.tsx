'use client'
import PageHeader from "@/components/features/detailPage/pageHeader";
import PageComponent from "@/components/features/detailPage/pageComponent";
import CustomerForm from "@/components/features/customer/customerForm";
import { useCustomer, useNextRegistrationNumber } from "@/lib/queries/customer/queries";
import { Suspense } from "react";
import Skeleton from "@/components/ui/skeleton";
import Loader from "@/components/ui/loader";
import { useDealersForSelect } from "@/lib/queries/dealer/queries";
import { useSalesManagersForSelect } from "@/lib/queries/salesManager/queries";
import { toast } from "react-toastify";


type CustomerDetailProps = {
  params: { id: string };
};


export default function UserDetail({ params }: CustomerDetailProps) {
  const isNewCustomer = params.id === "new";
  const customerId = parseInt(params.id);

  const { data: customers, isLoading: customerLoading, error: customerError } = useCustomer(customerId);
  const { data: dealers, isLoading: dealersLoading, error: dealersError } = useDealersForSelect();
  const { data: salesManagers, isLoading: salesManagersLoading, error: salesManagersError } = useSalesManagersForSelect();
  const { data: nextRegistrationNumber } = useNextRegistrationNumber();

  const isLoading = customerLoading || dealersLoading || salesManagersLoading;

  // Show loader while any data is loading
  if (isLoading) return <Loader />;

  // Handle errors
  if (customerError) {
    toast.error(`Error loading customer: ${customerError.message}`);
    return null;
  }
  if (dealersError) {
    toast.error(`Error loading dealers: ${dealersError.message}`);
    return null;
  }
  if (salesManagersError) {
    toast.error(`Error loading sales managers: ${salesManagersError.message}`);
    return null;
  }
  if (!customers?.data && !isNewCustomer) {
    toast.error('No customer found');
    return null;
  }

  if (isNewCustomer) {
    return (
      <PageComponent>
        <div className="mx-auto w-8/12">
          {nextRegistrationNumber && (
            <CustomerForm dials={{ 
              dealers: dealers?.data || [], 
              salesManagers: salesManagers?.data || [] 
            }} nextRegNumber={nextRegistrationNumber} />
          )}
        </div>
      </PageComponent>
    );
  }



  return (

    <PageComponent>
      <PageHeader
        userName={customers?.data.fullName || "Nový zákazník"}
        userId={customers?.data.id.toString() || "0"}
        active={customers?.data.active || false}
        statsUrl={`/customers/${customers?.data.id}/stats`}
      />
      <div className="flex flex-grow gap-4 p-2">
        
        <div className="h-full w-2/3 mx-auto">
          <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <CustomerForm 
              initialCustomerData={customers?.data} 
              dials={{ 
                dealers: dealers?.data || [], 
                salesManagers: salesManagers?.data || [] 
              }} 
            />
          </Suspense>
        </div>
      </div>

    </PageComponent>
  );
}


