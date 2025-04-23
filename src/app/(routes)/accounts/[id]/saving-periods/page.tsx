'use client'
import SavingPeriodsManager from "@/components/features/savingPeriod/SavingPeriodsManager";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { accountService } from "@/lib/services/account";
import { useAccount } from "@/lib/queries/account/queries";
import Skeleton from "@/components/ui/skeleton";
import { useSavingPeriodByAccount, useSavingPeriodsByAccount } from "@/lib/queries/savingPeriod/queries";
import { SavingPeriod } from "@/types/types";
import { useParams } from "next/navigation";

interface PageProps {
   params: {
      id: string;
   };
}

export default function AccountSavingPeriodsPage({ params }: PageProps) {

   // Get account ID from URL using next/navigation
   const router = useParams();
   const accountId = parseInt(router.id as string);

   const { data: savingPeriods } = useSavingPeriodsByAccount(accountId);
   const { data: account } = useAccount(accountId);

   if (!savingPeriods || !account) {
      return <Skeleton type="table" />
   }

   return (
      <div className="container mx-auto p-6">
         <Link
            href={`/customers/${account.data.customerId}/stats`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
         >
            <ArrowLeft className="w-4 h-4" />
            <span>Zpět na statistiky zákazníka</span>
         </Link>

         <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
               Šetřící období účtu: {account.data.customer.fullName}
            </h1>
            <p className="text-gray-600">
               ID účtu: {account.data.id}
            </p>
         </div>

         {savingPeriods && (
            <SavingPeriodsManager
               savingPeriods={savingPeriods}
            />
         )}

      </div>
   );
} 