import UniversalForm from "@/components/forms/universalForm";
import { accountValidationSchema } from "@/validations/account";
import { Account } from "@/types/types";
import { Button, Card } from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import { Switch } from "@material-tailwind/react";
import { Typography } from "@material-tailwind/react";
import { useState } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

type Props = {
    initialAccountData: Account
    onSubmit: SubmitHandler<Account>
    isUpdating: boolean
}

export default function AccountForm({ initialAccountData, onSubmit, isUpdating }: Props) {
    const [formData, setFormData] = useState(initialAccountData);

    // Convert SubmitHandler<Account> to (data: Account) => Promise<Account>
    const handleFormSubmit = async (data: Account): Promise<Account> => {
        onSubmit(data);
        return data;
    }

    return (
        <UniversalForm
            initialData={initialAccountData}
            validationSchema={accountValidationSchema}
            onSubmit={handleFormSubmit}
        >
            {(methods: UseFormReturn<Account>) => {
                const { register, watch, setValue } = methods;
                const formValues = watch();
                
                const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    setValue('active', e.target.checked);
                };
                
                return (
                    <>
                        <Typography variant="h5" className="mb-4">
                            Úprava účtu
                        </Typography>

                        <div className="mb-4">
                            <Switch
                                label="Aktivní účet"
                                checked={formValues.active}
                                onChange={handleSwitchChange}
                                disabled={false}
                                crossOrigin={undefined}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <Typography variant="small" className="mb-2 font-medium">
                                    Body celkem (pouze k náhledu)
                                </Typography>
                                <Input
                                    type="number"
                                    disabled={true}
                                    value={formValues.lifetimePoints}
                                    className="w-full"
                                    containerProps={{ className: "min-w-[100px]" }}
                                    crossOrigin={undefined}
                                    {...register('lifetimePoints')}
                                />
                            </div>
                            <div>
                                <Typography variant="small" className="mb-2 font-medium">
                                    Body v aktuálním roce (pouze k náhledu)
                                </Typography>
                                <Input
                                    type="number"
                                    disabled={true}
                                    value={formValues.currentYearPoints}
                                    className="w-full"
                                    containerProps={{ className: "min-w-[100px]" }}
                                    crossOrigin={undefined}
                                    {...register('currentYearPoints')}
                                />
                            </div>
                            <div>
                                <Typography variant="small" className="mb-2 font-medium">
                                    Celkem nasbíráno bodů (pouze k náhledu)
                                </Typography>
                                <Input
                                    type="number"
                                    disabled={true}
                                    value={formValues.totalDepositedPoints}
                                    className="w-full"
                                    containerProps={{ className: "min-w-[100px]" }}
                                    crossOrigin={undefined}
                                    {...register('totalDepositedPoints')}
                                />
                            </div>
                            <div>
                                <Typography variant="small" className="mb-2 font-medium">
                                    Celkem utraceno bodů (pouze k náhledu)
                                </Typography>
                                <Input
                                    type="number"
                                    disabled={true}
                                    value={formValues.totalWithdrawnPoints}
                                    className="w-full"
                                    containerProps={{ className: "min-w-[100px]" }}
                                    crossOrigin={undefined}
                                    {...register('totalWithdrawnPoints')}
                                />
                            </div>
                            <div>
                                <Typography variant="small" className="mb-2 font-medium text-blue-600">
                                    Korekce bodů celkem
                                </Typography>
                                <Input
                                    type="number"
                                    className="w-full"
                                    containerProps={{ className: "min-w-[100px]" }}
                                    crossOrigin={undefined}
                                    disabled={false}
                                    {...register('lifetimePointsCorrection')}
                                />
                            </div>
                            <div>
                                <Typography variant="small" className="mb-2 font-medium text-blue-600">
                                    Průměrné body před SM
                                </Typography>
                                <Input
                                    type="number"
                                    className="w-full"
                                    containerProps={{ className: "min-w-[100px]" }}
                                    crossOrigin={undefined}
                                    step="0.01"
                                    disabled={false}
                                    {...register('averagePointsBeforeSalesManager')}
                                />
                            </div>
                        </div>
                    </>
                );
            }}
        </UniversalForm>
    )
}