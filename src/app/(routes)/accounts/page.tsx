import Link from "next/link";
import Card from "@/components/ui/mtui";
import Typography from "@/components/ui/typography";
import { accountService } from "@/lib/services/account";

export default async function AccountsPage() {
   const accounts = await accountService.getAllActiveAccounts();

   return (
      <div className="container mx-auto p-6">
         <Typography variant="h2" color="black" className="mb-6">
            Seznam účtů
         </Typography>

         <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
               <thead>
                  <tr className="bg-gray-100">
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jméno zákazníka
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registrační číslo
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Body celkem
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Body v tomto roce
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Akce
                     </th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-200">
                  {accounts.map((account) => (
                     <tr key={account.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                           <Typography variant="h6" color="black">
                              {account.customer.fullName}
                           </Typography>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                           {account.customer.registrationNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                           {account.lifetimePoints}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                           {account.currentYearPoints}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <Link
                              href={`/accounts/${account.id}/saving-periods`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                           >
                              Šetřící období
                           </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <Link
                              href={`/accounts/${account.id}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                           >
                              Detail účtu
                              </Link>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
} 