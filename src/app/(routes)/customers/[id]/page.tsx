
import PageHeader from "@/components/features/detailPage/pageHeader";
import { getCustomerById } from "@/lib/db/queries/customers";
import PageComponent from "@/components/features/detailPage/pageComponent";
import { fetchDealersForOptionsFromDB } from "@/lib/db/queries/dealers";
import { fetchSalesManagersOptionsFromDB } from "@/lib/db/queries/salesManagers";
import CustomerForm from "@/components/features/customer/customerForm";


type CustomerDetailProps = {
  params: { id: string };
};


export default async function UserDetail({ params }: CustomerDetailProps) {
  const isNewCustomer = params.id === "new";

  // Load dealers and sales managers for select options
  const dealers = await fetchDealersForOptionsFromDB();
  const salesManagers = await fetchSalesManagersOptionsFromDB();




  if (isNewCustomer) {
    return (
      <PageComponent>
        <div className="mx-auto w-8/12">
          <CustomerForm dials={{dealers, salesManagers}} />
        </div>
      </PageComponent>
    );
  }

  const customerId = parseInt(params.id);
  const customer = await getCustomerById(customerId);

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
        {/* <DetailDataWrapper initialCustomer={customer} /> */}

      </div>

    </PageComponent>
  );
}


