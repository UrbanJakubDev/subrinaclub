import CustomerSavingPeriodsTable from "@/components/features/customer/customerSavingPeriodsTable";
import PageComponent from "@/components/features/detailPage/pageComponent";
import { customerService } from "@/lib/services/customer";

export default async function SavingPeriodOverwievPage() {

    const customerWithSavingPeriods = await customerService.getCustomersWithAccountAndActiveSavingPeriod()

    return (
        <PageComponent>
            <CustomerSavingPeriodsTable defaultData={customerWithSavingPeriods} />
       
        </PageComponent>
    )
}