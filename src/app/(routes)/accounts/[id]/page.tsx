import { accountService } from "@/lib/services/account";
import Skeleton from "@/components/ui/skeleton";
interface PageProps {
    params: {
        id: string;
    };
}


export default async function AccountPage({ params }: PageProps) {
    const accountId = parseInt(params.id);
    const account = await accountService.getAccountWithSavingPeriods(accountId);

    if (!account) {
        return <Skeleton className="h-screen w-full" />
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-2">Účet zákazníka</h1>
            <p className="text-gray-600">
                ID účtu: {account.id}
                Jméno zákazníka: {account.customer.fullName}
            </p>
            <pre>{JSON.stringify(account, null, 2)}</pre>
        </div>
    )
}