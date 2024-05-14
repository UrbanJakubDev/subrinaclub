import AccountStats from "@/components/detailPage/accountStats";
import PageHeader from "@/components/detailPage/pageHeader";
import CustomerForm from "@/components/forms/customerForm";
import Loader from "@/components/ui/loader";
import { getAccountByUserId } from "@/db/queries/accounts";
import { CustomerService } from "@/db/queries/customers";
import { getDealersForSelect } from "@/db/queries/dealers";
import { getSalesManagersForSelect } from "@/db/queries/salesManagers";
import { getTransactionsByAccountId} from "@/db/queries/transactions";
import { IAccount, ICustomer } from "@/interfaces/interfaces";
import { Suspense } from "react";

export default async function UserDetail({
  params,
}: {
  params: { id: string };
}) {
  const customerService = new CustomerService();

  // Fetch dealers and sales managers
  const [dealers, salesManagers] = await Promise.all([
    getDealersForSelect(),
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
      active: 0,
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
        <Suspense fallback={<Loader />}>
          <CustomerForm customer={customer} dials={{ dealers, salesManagers }} />
        </Suspense>
      </div>
    );
  }

  const customerId = parseInt(params.id);
  const [customer, account] = await Promise.all([
    customerService.getCustomerById(customerId),
    getAccountByUserId(customerId),
  ]);

  const transactions = await getTransactionsByAccountId(account.id);

  if (!customer) {
    return <Loader />;
  }

  return (
    <>
      <div className="content-container p-6 my-2">
        <PageHeader
          userName={customer.fullName || "Nový zákazník"}
          userId={customer.id.toString()}
          active={customer.active}
        />
        <Suspense fallback={<Loader />}>
          <CustomerForm customer={customer} dials={{ dealers, salesManagers }} />
        </Suspense>
      </div>

      {customerId && account && transactions && (
        <div className="content-container p-6 my-2">
          <h2 className="text-lg font-semibold">Statistiky účtu</h2>
          <AccountStats account={account} transactions={transactions} />
        </div>
      )}
    </>
  );
}
