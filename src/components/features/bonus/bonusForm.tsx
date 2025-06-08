'use client'
import InputField from '@/components/ui/inputs/basicInput'
import { useRouter } from 'next/navigation'
import React from 'react'
import UniversalForm from '@/components/forms/universalForm'
import { bonusValidationSchema, CreateBonusDTO } from '@/validations/bonus'
import { Bonus } from '@prisma/client'
import { BonusFormProps } from '@/types/bonus'
import { useCreateBonus } from '@/lib/queries/bonus/mutations'
import { useUpdateBonus } from '@/lib/queries/bonus/mutations'

const newBonusData: CreateBonusDTO = {
    name: '',
    points: 0,
    price: 0,
}

export default function BonusForm({ initialBonusData }: BonusFormProps) {
    const router = useRouter()
    const [bonusData, setBonusData] = React.useState<Bonus>(
        initialBonusData || (newBonusData as Bonus),
    )
    const { mutate: createBonus } = useCreateBonus()
    const { mutate: updateBonus } = useUpdateBonus()

    // Handle form submission
    const handleSubmit = async (data: Bonus): Promise<Bonus> => {
        if (data.id) {
            updateBonus({ id: data.id, data: data as Partial<Bonus> })
        } else {
            createBonus(data)
            router.push('/dictionaries/bonuses')
        }
        return data
    }

    // If the initialBonusData has changed, update the bonusData state and rerender the form
    React.useEffect(() => {
        setBonusData(initialBonusData || (newBonusData as Bonus))
    }, [initialBonusData])

    return (
        <UniversalForm<Bonus>
            initialData={bonusData}
            validationSchema={bonusValidationSchema}
            onSubmit={handleSubmit}>
            {() => (
                <div className="flex flex-col gap-6 my-6 w-full">
                    <p>Formulář pro vytvoření nebo úpravu bonusu</p>
                    <InputField
                        label="Jméno bonusu"
                        type="text"
                        name="name"
                        customClass="min-w-[600px]"
                        defaultValue={bonusData.name}
                    />
                    <div className="flex flex-row gap-6 justify-between min-w-[600px]">
                        <InputField
                            label="Body"
                            type="number"
                            name="points"
                            customClass="w-1/2"
                            defaultValue={bonusData.points}
                        />
                        <InputField
                            label="Hodnota"
                            type="number"
                            name="price"
                            customClass="w-1/2"
                            defaultValue={bonusData.price}
                        />
                    </div>
                    <InputField
                        label="Popis"
                        type="text"
                        name="description"
                        customClass="min-w-[600px]"
                        defaultValue={bonusData.description}
                    />
                </div>
            )}
        </UniversalForm>
    )
}
