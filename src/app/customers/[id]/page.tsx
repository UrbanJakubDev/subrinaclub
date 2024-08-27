
import PageHeader from "@/components/detailPage/pageHeader";
import CustomerForm from "@/components/forms/customerForm";
import Loader from "@/components/ui/loader";
import { prisma } from "@/db/pgDBClient";
import { getAccountByUserId } from "@/db/queries/accounts";
import { CustomerService } from "@/db/queries/customers";
import { DealerService } from "@/db/queries/dealers";
import { getSalesManagersForSelect } from "@/db/queries/salesManagers";
import { getSavingPeriodByUserId } from "@/db/queries/savingPeridos";
import { getTransactionsByAccountId, getTransactionsByAccountIdAndDate } from "@/db/queries/transactions";
import { ICustomer } from "@/interfaces/interfaces";
import { Suspense } from "react";
import AccountDetail from "@/components/blocks/customer/account/detail";
import SavingPeriodStats from "@/components/blocks/savingPeriod/savingPeriodStats";
import TransactionForm from "@/components/forms/transactionForm";
import PageComponent from "@/components/detailPage/pageComponent";
import DetailDataWrapper from "@/components/blocks/customer/detailDataWrapper";

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
      registratedSinceD: new Date(),
      salonName: ""
    };

    return (
      <div className="content-container p-6 my-2">
        <h2 className="text-lg font-semibold">Vytvoření nového zákazníka</h2>
        <Suspense fallback={<Loader />}>
          <CustomerForm customer={customer} dials={{ dealers, salesManagers }} />
        </Suspense>
      </div>
    );
  }

  const customerId = parseInt(params.id);
  const [customer, account] = await Promise.all([customerService.getCustomerById(customerId),getAccountByUserId(customerId),
  ]);

  const activeSavingPeriod = account?.savingPeriods.find((sp) => sp.active);

  const transactions = await getTransactionsByAccountId(account.id);
  const transactionsInPeriod = await getTransactionsByAccountIdAndDate(account.id, activeSavingPeriod.savingStartDate, activeSavingPeriod.savingEndDate);

  if (!customer || !account || !transactions || !transactionsInPeriod) {
    return <Loader />;
  }

  return (

    <PageComponent>
      <PageHeader
        userName={customer.fullName || "Nový zákazník"}
        userId={customer.id.toString()}
        active={customer.active}
        accountUrl={`/customers/${customer.id}/account`}
        statsUrl={`/customers/${customer.id}/stats`}
        addBtn
      />
      <div className="flex flex-grow gap-4 p-2">
        <div className="h-full w-full">
          <h2 className="text-lg font-semibold">{`Editace - ${customer.fullName}`}</h2>
          <small className=" text-gray-700">Přehled atributů pro ůčet s ID: {account.id}</small>
          {dealers && salesManagers && customer && (
            <CustomerForm customer={customer} dials={{ dealers, salesManagers }} />
          )}

        </div>
        <DetailDataWrapper initialCustomer={customer} initData={
          {
            initTransactions: transactions,
            initTransactionsInPeriod: transactionsInPeriod,
          }
        } />
      </div>

    </PageComponent>
  );
}
