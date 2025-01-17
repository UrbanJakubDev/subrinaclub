import ReportObratTable from "@/components/features/reports/obratTable"
import SimpleTable from "@/components/tables/simpleTable"
import { customerService } from "@/lib/services/customer"

type Props = {}

const TransactionsReportPage = async (props: Props) => {

   const customer = customerService
   const customers = await customer.getCustomersForReportSeznamObratu()

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