import ReportObratTable from "@/components/tables/reports/obratTable"
import SimpleTable from "@/components/tables/simpleTable"
import { CustomerService } from "@/db/queries/customers"

type Props = {}

const TransactionsReportPage = async (props: Props) => {

   const customer = new CustomerService()
   const customers = await customer.geetCustomersForReportSeznamObratu()

   // Convert type BigInt to number
   customers.forEach((customer) => {
      customer.registrationNumber = Number(customer.registrationNumber)
   })

   return (
      <div className="content-container p-6 my-2">
         <h2>Seznam obratu</h2>
         {/* <pre>
            {JSON.stringify(customers, null, 2)}
         </pre> */}
         <ReportObratTable defaultData={customers} />
      </div>
   )
}

export default TransactionsReportPage