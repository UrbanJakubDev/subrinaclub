"use client"
import UniversalForm from "@/components/forms/universalForm";
import { savingPeriodValidationSchema } from "@/validations/savingPeriod";
import { SavingPeriod } from "@/types/types";
import { Input, Select, Option, Typography } from "@material-tailwind/react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

type Props = {
   initialSavingPeriodData: SavingPeriod
   onSubmit: SubmitHandler<SavingPeriod>
   isUpdating: boolean
}

export default function SavingPeriodForm({ initialSavingPeriodData, onSubmit, isUpdating }: Props) {
    // Convert SubmitHandler<SavingPeriod> to (data: SavingPeriod) => Promise<SavingPeriod>
    const handleFormSubmit = async (data: SavingPeriod): Promise<SavingPeriod> => {
        onSubmit(data);
        return data;
    }

    return (
        <UniversalForm
            initialData={initialSavingPeriodData}
            validationSchema={savingPeriodValidationSchema}
            onSubmit={handleFormSubmit}
            onCancel={() => {
                router.back();
            }}
        >
            {(methods: UseFormReturn<SavingPeriod>) => {
                const { register, watch, setValue } = methods;
                const formValues = watch();
                
                const quarters = [1, 2, 3, 4];

   return (
                    <>
                        <Typography variant="h5" className="mb-4">
                            Úprava šetřícího období
                        </Typography>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <Typography variant="small" className="mb-2 font-medium">
                                    Počáteční rok
                                </Typography>
                                <Input
                                    type="number"
                                    className="w-full"
                                    containerProps={{ className: "min-w-[100px]" }}
                                    crossOrigin={undefined}
                                    {...register('startYear')}
                                />
                            </div>
                            <div>
                                <Typography variant="small" className="mb-2 font-medium">
                                    Počáteční čtvrtletí
                                </Typography>
                                <Select
                                    value={formValues.startQuarter?.toString()}
                                    onChange={(value) => setValue('startQuarter', Number(value))}
                                    className="w-full"
                                >
                                    {quarters.map((quarter) => (
                                        <Option key={quarter} value={quarter.toString()}>
                                            Q{quarter}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <Typography variant="small" className="mb-2 font-medium">
                                    Koncový rok
                                </Typography>
                                <Input
                                    type="number"
                                    className="w-full"
                                    containerProps={{ className: "min-w-[100px]" }}
                                    crossOrigin={undefined}
                                    {...register('endYear')}
                                />
                            </div>
                            <div>
                                <Typography variant="small" className="mb-2 font-medium">
                                    Koncové čtvrtletí
                                </Typography>
                                <Select
                                    value={formValues.endQuarter?.toString()}
                                    onChange={(value) => setValue('endQuarter', Number(value))}
                                    className="w-full"
                                >
                                    {quarters.map((quarter) => (
                                        <Option key={quarter} value={quarter.toString()}>
                                            Q{quarter}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <Typography variant="small" className="mb-2 font-medium">
                                    Status
                                </Typography>
                                <Select
                                    value={formValues.status}
                                    onChange={(value) => setValue('status', value as SavingPeriod['status'])}
                                    className="w-full"
                                >
                                    <Option value="ACTIVE">Aktivní</Option>
                                    <Option value="INACTIVE">Neaktivní</Option>
                                    <Option value="CLOSED">Uzavřené</Option>
                                </Select>
                            </div>
                            {formValues.status === 'CLOSED' && (
                                <div>
                                    <Typography variant="small" className="mb-2 font-medium">
                                        Důvod uzavření
                                    </Typography>
                                    <Input
                                        type="text"
                                        className="w-full"
                                        containerProps={{ className: "min-w-[100px]" }}
                                        crossOrigin={undefined}
                                        {...register('closeReason')}
                                    />
                                </div>
                            )}
                            <div>
                                <Typography variant="small" className="mb-2 font-medium">
                                    Dostupné body (pouze k náhledu)
                                </Typography>
                                <Input
                                    type="number"
                                    disabled={true}
                                    value={formValues.availablePoints}
                                    className="w-full"
                                    containerProps={{ className: "min-w-[100px]" }}
                                    crossOrigin={undefined}
                                    {...register('availablePoints')}
                                />
                            </div>
                            <div>
                                <Typography variant="small" className="mb-2 font-medium">
                                    Nasbírané body (pouze k náhledu)
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
                                    Utracené body (pouze k náhledu)
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
      </div>
                    </>
                );
            }}
        </UniversalForm>
    );
}