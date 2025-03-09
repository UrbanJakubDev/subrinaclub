import ReportObratTable from "@/components/features/reports/obratTable"
import { customerService } from "@/lib/services/customer"

type Props = {}

const TransactionsReportPage = async (props: Props) => {

   const customers = await customerService.getCustomersForReportSeznamObratu()

  

   return (
      <div className="w-full p-6 my-2">
         <ReportObratTable defaultData={customers} detailLinkPath="/customers" />
      </div>
   )
}

export default TransactionsReportPage