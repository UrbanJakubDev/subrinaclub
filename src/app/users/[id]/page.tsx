
import PageHeader from "@/components/detailPage/pageHeader";
import CustomerForm from "@/components/forms/customerForm";
import Loader from "@/components/ui/loader";
import { prisma } from "@/db/pgDBClient";
import { getAccountByUserId } from "@/db/queries/accounts";
import { CustomerService } from "@/db/queries/customers";
import { DealerService } from "@/db/queries/dealers";
import { getSalesManagersForSelect } from "@/db/queries/salesManagers";
import { getSavingPeriodByUserId } from "@/db/queries/savingPeridos";
import { getTransactionsByAccountId } from "@/db/queries/transactions";
import { ICustomer } from "@/interfaces/interfaces";
import { Suspense } from "react";
import AccountDetail from "@/components/blocks/account/detail";
import SavingPeriodStats from "@/components/blocks/savingPeriod/savingPeriodStats";
import TransactionComponent from "@/components/blocks/transaction";
import ModalComponent from "@/components/ui/modal";
import TransactionForm from "@/components/forms/transactionForm";
import PageComponent from "@/components/detailPage/pageComponent";

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

    <PageComponent>
      <PageHeader
        userName={customer.fullName || "Nový zákazník"}
        userId={customer.id.toString()}
        active={customer.active}
        accountUrl={`/accounts/${account.id}`}
        statsUrl={`/users/${customer.id}/stats`}
      />
      <div className="flex flex-grow gap-4 p-2">
        <div className="h-full w-full">
          <h2 className="text-lg font-semibold">{`Editace - ${customer.fullName}`}</h2>
          <small className=" text-gray-700">Přehled atributů pro ůčet s ID: {account.id}</small>
          <Suspense fallback={<Loader />}>
            <CustomerForm customer={customer} dials={{ dealers, salesManagers }} />
          </Suspense>
        </div>
        {customerId && account && transactions && (
          <div className="h-full w-full flex flex-col gap-6">
            <AccountDetail account={account} />
            <SavingPeriodStats savingPeriod={savingPeriod} />
            <TransactionForm accountId={account.id} customer={customer} savingPeriod={savingPeriod} />
          </div>
        )}
      </div>

    </PageComponent>
  );
}
