import AccountStats from "@/components/account/accountStats";
import AccountDetail from "@/components/account/detail";
import PageHeader from "@/components/detailPage/pageHeader";
import AccountForm from "@/components/forms/accountForm";
import CustomerForm from "@/components/forms/customerForm";
import SavingPeriodForm from "@/components/forms/savingPeriodForm";
import Loader from "@/components/ui/loader";
import { prisma } from "@/db/pgDBClient";
import { getAccountByUserId } from "@/db/queries/accounts";
import { CustomerService } from "@/db/queries/customers";
import { DealerService } from "@/db/queries/dealers";
import { getSalesManagersForSelect } from "@/db/queries/salesManagers";
import { getSavingPeriodByUserId } from "@/db/queries/savingPeridos";
import { getTransactionsByAccountId } from "@/db/queries/transactions";
import { IAccount, ICustomer } from "@/interfaces/interfaces";
import { Suspense } from "react";

export default async function UserDetail({
  params,
}: {
  params: { id: string };
}) {

  // Define services for fetching data
  const customerService = new CustomerService();
  const dealerService = new DealerService(prisma.dealer);

  // Fetch dealers and sales managers
  const [dealers, salesManagers] = await Promise.all([
    dealerService.getDealersForSelect(),
    getSalesManagersForSelect(),
  ]);

  if (params.id === "0") {
    const maxRegistrationNumber = await customerService.getMaxRegistrationNumber();
    const customer: ICustomer = {
      id: 0,
      fullName: "",
      email: "",
      phone: "",
      address: "",
      town: "",
      psc: "",
      note: "",
      dealerId: 0,
      salesManagerId: 0,
      salesManagerSinceQ: 0,
      salesManagerSinceYear: 0,
      registrationNumber: maxRegistrationNumber + 1,
      active: true,
      publicId: "",
      birthDateD: null,
      ico: "",
      registratedSinceD: null,
      salonName: ""
    };

    return (
      <div className="content-container p-6 my-2">
        <PageHeader
          userName="Nový zákazník"
          userId="0"
          active={true}
        />
        <h2 className="text-lg font-semibold">Vytvoření nového zákazníka</h2>
        <Suspense fallback={<Loader />}>
          <CustomerForm customer={customer} dials={{ dealers, salesManagers }} />
        </Suspense>
      </div>
    );
  }

  const customerId = parseInt(params.id);
  const [customer, account, savingPeriod] = await Promise.all([
    customerService.getCustomerById(customerId),
    getAccountByUserId(customerId),
    getSavingPeriodByUserId(customerId),
  ]);

  const transactions = await getTransactionsByAccountId(account.id);

  if (!customer) {
    return <Loader />;
  }

  return (

    <div className="content-container p-6 my-2 flex flex-col h-11/12 bg-blue-gray-400" >
      <PageHeader
        userName={customer.fullName || "Nový zákazník"}
        userId={customer.id.toString()}
        active={customer.active}
      />
      <div className="flex flex-grow gap-4 p-2">
        <div className="h-full w-full">
          <h2 className="text-lg font-semibold">{`Editace - ${customer.fullName}`}</h2>
          <small className=" text-gray-700">Přehled atributů pro ůčet s ID: {account.id}</small>
          <Suspense fallback={<Loader />}>
            <CustomerForm customer={customer} dials={{ dealers, salesManagers }} />
          </Suspense>
        </div>
        <div className="h-full w-full">

          {customerId && account && transactions && (
            <>
              <h2 className="text-lg font-semibold">Přehled - účtu</h2>
              <small className=" text-gray-700">Přehled atributů pro ůčet s ID: {account.id}</small>
              <AccountDetail account={account} />
              <SavingPeriodForm savingPeriod={savingPeriod} />
            </>
          )}
        </div>
      </div>

    </div>
  );
}
