import { SavingPeriod } from "@/types/types";
import { toast } from "react-toastify";
import { Card } from "@material-tailwind/react";
import SavingPeriodForm from "./savingPeriodForm";
import { useUpdateSavingPeriod, useDeleteSavingPeriod, useCloseSavingPeriod } from "@/lib/queries/savingPeriod/mutations";
import { useState } from "react";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {
    initialSavingPeriodData: SavingPeriod;
}

export default function SavingPeriodFormComponent({ initialSavingPeriodData }: Props) {
    const router = useRouter();
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [isConfirmingClose, setIsConfirmingClose] = useState(false);
    
    // Mutations
    const { mutate: updateSavingPeriod, isPending: isUpdating } = useUpdateSavingPeriod();
    const { mutate: deleteSavingPeriod, isPending: isDeleting } = useDeleteSavingPeriod();
    const { mutate: closeSavingPeriod, isPending: isClosing } = useCloseSavingPeriod();

    // Handle submit
    const handleSubmit = async (data: SavingPeriod) => {
        try {
            // Pouze editovatelná pole
            const editableData = {
                startYear: data.startYear,
                startQuarter: data.startQuarter,
                endYear: data.endYear,
                endQuarter: data.endQuarter,
                status: data.status,
                closeReason: data.status === 'CLOSED' ? data.closeReason : null
            };
            
            // Vypočítat datum začátku a konce z roku a čtvrtletí
            const startDateTime = new Date(data.startYear, (data.startQuarter - 1) * 3, 1);
            const endDateTime = new Date(data.endYear, (data.endQuarter - 1) * 3 + 2, 31);
            
            const updatedData = {
                ...editableData,
                startDateTime,
                endDateTime
            };
            
            updateSavingPeriod(
                { id: data.id, data: updatedData },
                {
                    onSuccess: () => {
                        toast.success("Šetřící období bylo úspěšně aktualizováno.");
                    },
                    onError: (error: any) => {
                        toast.error(`Chyba při aktualizaci šetřícího období: ${error?.message || 'Neznámá chyba'}`);
                    }
                }
            );
            return data;
        } catch (error) {
            throw error;
        }
    }
    
    // Handle delete
    const handleDelete = () => {
        if (isConfirmingDelete) {
            deleteSavingPeriod(
                initialSavingPeriodData.id,
                {
                    onSuccess: () => {
                        toast.success("Šetřící období bylo úspěšně smazáno.");
                        router.push(`/accounts/${initialSavingPeriodData.accountId}`);
                    },
                    onError: (error: any) => {
                        toast.error(`Chyba při mazání šetřícího období: ${error?.message || 'Neznámá chyba'}`);
                    }
                }
            );
            setIsConfirmingDelete(false);
        } else {
            setIsConfirmingDelete(true);
        }
    }
    
    // Handle close
    const handleClose = () => {
        if (isConfirmingClose) {
            closeSavingPeriod(
                { 
                    id: initialSavingPeriodData.id, 
                    data: { 
                        createNewPeriod: true,
                        startYear: new Date().getFullYear(),
                        startQuarter: Math.floor(new Date().getMonth() / 3) + 1
                    } 
                },
                {
                    onSuccess: () => {
                        toast.success("Šetřící období bylo úspěšně uzavřeno a nové období bylo vytvořeno.");
                        router.refresh();
                    },
                    onError: (error: any) => {
                        toast.error(`Chyba při uzavírání šetřícího období: ${error?.message || 'Neznámá chyba'}`);
                    }
                }
            );
            setIsConfirmingClose(false);
        } else {
            setIsConfirmingClose(true);
        }
    }

    return (
        <Card className="p-6 my-4">
            <SavingPeriodForm 
                initialSavingPeriodData={initialSavingPeriodData} 
                onSubmit={handleSubmit}
                isUpdating={isUpdating} 
            />
            
            <div className="flex mt-6 gap-4 justify-end">
                {initialSavingPeriodData.status !== 'CLOSED' && (
                    <Button 
                        variant="outlined" 
                        onClick={handleClose}
                        disabled={isClosing || isUpdating || isDeleting}
                        className={isConfirmingClose ? "text-yellow-600 border-yellow-600 hover:text-yellow-800 hover:border-yellow-800" : ""}
                    >
                        {isConfirmingClose ? "Potvrdit uzavření a vytvoření nového období" : "Uzavřít období"}
                    </Button>
                )}
                
                <Button 
                    variant="outlined" 
                    onClick={handleDelete}
                    disabled={isDeleting || isUpdating || isClosing}
                    className={isConfirmingDelete ? "text-red-600 border-red-600 hover:text-red-800 hover:border-red-800" : ""}
                >
                    {isConfirmingDelete ? "Potvrdit smazání" : "Smazat období"}
                </Button>
            </div>
        </Card>
    );
}
