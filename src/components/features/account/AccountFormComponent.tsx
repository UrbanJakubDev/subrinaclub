import Skeleton from "@/components/ui/skeleton";
import AccountForm from "./AccountForm";
import { useUpdateAccount } from "@/lib/queries/account/mutations";
import { Account } from "@/types/types";
import { toast } from "react-toastify";
import { Card } from "@material-tailwind/react";
type Props = {
    initialAccountData: Account;
}

export default function AccountFormComponent({ initialAccountData }: Props) {
    // Account query mutation
    const { mutate: updateAccount, isPending: isUpdating } = useUpdateAccount();

    // Handle submit
    const handleSubmit = async (data: Account) => {
        try {
            // Only send the editable fields to the API
            const editableData = {
                active: data.active,
                lifetimePointsCorrection: data.lifetimePointsCorrection,
                averagePointsBeforeSalesManager: data.averagePointsBeforeSalesManager
            };
            
            updateAccount(
                { id: data.id, data: editableData },
                {
                    onSuccess: () => {
                        toast.success("Účet byl úspěšně aktualizován.");
                    },
                    onError: (error: any) => {
                        toast.error(`Chyba při aktualizaci účtu: ${error?.message || 'Neznámá chyba'}`);
                    }
                }
            );
            return data;
        } catch (error) {
            // Handle any synchronous errors
            throw error;
        }
    }

    return (
        <Card className="p-6 my-4">
            <AccountForm 
                initialAccountData={initialAccountData} 
                onSubmit={handleSubmit}
                isUpdating={isUpdating} 
            />
        </Card>
    );
}