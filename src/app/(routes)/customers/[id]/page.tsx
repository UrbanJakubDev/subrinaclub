
import PageHeader from "@/components/features/detailPage/pageHeader";
import { getCustomerById } from "@/lib/db/queries/customers";
import PageComponent from "@/components/features/detailPage/pageComponent";
import { fetchDealersForOptionsFromDB } from "@/lib/db/queries/dealers";
import { fetchSalesManagersOptionsFromDB } from "@/lib/db/queries/salesManagers";
import CustomerForm from "@/components/features/customer/customerForm";
import { customerService } from "@/lib/services/customer";


type CustomerDetailProps = {
  params: { id: string };
};


export default async function UserDetail({ params }: CustomerDetailProps) {
  const isNewCustomer = params.id === "new";
 

  // Load dealers and sales managers for select options
  // TODO: Change to use dealerService and salesManagerService
  const dealers = await fetchDealersForOptionsFromDB();
  const salesManagers = await fetchSalesManagersOptionsFromDB();




  if (isNewCustomer) {
    // Get last customer registration number
    const nextRegistrationNumber = await customerService.getNextRegistrationNumber();

    return (
      <PageComponent>
        <div className="mx-auto w-8/12">
         {nextRegistrationNumber && <CustomerForm dials={{dealers, salesManagers}} nextRegNumber={nextRegistrationNumber} />}
        </div>
      </PageComponent>
    );
  }

  const customerId = parseInt(params.id);
  const customer = await customerService.get(customerId)

  return (

    <PageComponent>

      <PageHeader
        userName={customer.fullName || "Nový zákazník"}
        userId={customer.id.toString()}
        active={customer.active}
        statsUrl={`/customers/${customer.id}/stats`}
      />
      <div className="flex flex-grow gap-4 p-2">
        <div className="h-full w-full">
          <h2 className="text-lg font-semibold">{`Editace - ${customer.fullName}`}</h2>
          <CustomerForm initialCustomerData={customer} dials={{ dealers, salesManagers }} />
        </div>
      </div>

    </PageComponent>
  );
}


