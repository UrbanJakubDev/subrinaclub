import SavingPeriodsManager from "@/components/features/savingPeriod/SavingPeriodsManager";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { accountService } from "@/lib/services/account";
import Skeleton from "@/components/ui/skeleton";

interface PageProps {
   params: {
      id: string;
   };
}


export default async function AccountSavingPeriodsPage({ params }: PageProps) {
   const accountId = parseInt(params.id);
   const account = await accountService.getAccountWithSavingPeriods(accountId)

   if (!account) {
      return <Skeleton className="h-screen w-full" />
   }

   return (
      <div className="container mx-auto p-6">
         <Link 
            href={`/customers/${account.customerId}/stats`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
         >
            <ArrowLeft className="w-4 h-4" />
            <span>Zpět na statistiky zákazníka</span>
         </Link>

         <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
               Šetřící období účtu: {account.customer.fullName}
            </h1>
            <p className="text-gray-600">
               ID účtu: {account.id}
            </p>
         </div>

         
         
         <SavingPeriodsManager 
            account={account} 
            savingPeriods={account.savingPeriods}
         />
      </div>
   );
} 