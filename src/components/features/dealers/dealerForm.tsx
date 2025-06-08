'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import InputSwitcher from '../../ui/inputs/inputSwitcher'
import InputField from '../../ui/inputs/basicInput'
import TextAreaField from '../../ui/inputs/textareaInput'
import UniversalForm from '../../forms/universalForm'
import { Dealer } from '@/types/dealer'
import { CreateDealerDTO, dealerValidationSchema } from '@/validations/dealer'
import { useCreateDealer } from '@/lib/queries/dealer/mutations'
import { useUpdateDealer } from '@/lib/queries/dealer/mutations'

const newDealer: CreateDealerDTO = {
    ico: '',
    fullName: '',
    phone: null,
    email: null,
    registratedSince: null,
    address: null,
    town: null,
    psc: null,
    note: null,
}

type DealerFormProps = {
    initialDealerData: Dealer | null
}

export default function DealerForm({ initialDealerData }: DealerFormProps) {
    const router = useRouter()
    const [dealerData, setDealerData] = React.useState<Dealer>(
        initialDealerData || (newDealer as Dealer),
    )

    const { mutate: updateDealer, isPending: isUpdating } = useUpdateDealer()
    const { mutate: createDealer, isPending: isCreating } = useCreateDealer()

    // Handle form submission
    const handleSubmit = async (data: Dealer): Promise<Dealer> => {
        if (data.id) {
            updateDealer({ id: data.id, data: data })
        } else {
            createDealer(data)
            router.push('/dictionaries/dealers')
        }
        return data
    }

    // If the initialDealerData has changed, update the dealerData state and rerender the form
    React.useEffect(() => {
        setDealerData(initialDealerData || (newDealer as Dealer))
    }, [initialDealerData])

    return (
        <UniversalForm<Dealer>
            initialData={dealerData}
            validationSchema={dealerValidationSchema}
            onSubmit={handleSubmit}>
            {() => (
                <div className="flex flex-col gap-6 my-6">
                    <div className="flex gap-4">
                        <InputSwitcher
                            label="Aktivní"
                            name="active"
                            // If customer is active set default value to true, otherwise false or if customer is new set default value to true
                            defaultValue={dealerData.active}
                        />
                    </div>
                    <div className="flex gap-4">
                        <InputField
                            label="Jméno a příjmení"
                            type="text"
                            name="fullName"
                            defaultValue={dealerData.fullName}
                        />
                    </div>

                    <div className="flex gap-4">
                        <InputField
                            label="Adresa"
                            type="text"
                            name="address"
                            defaultValue={dealerData.address}
                        />
                        <InputField
                            label="Město"
                            type="text"
                            name="town"
                            defaultValue={dealerData.town}
                        />
                        <InputField
                            label="PSČ"
                            type="text"
                            name="psc"
                            defaultValue={dealerData.psc}
                        />
                    </div>
                    <div className="flex gap-4">
                        <TextAreaField
                            label="Poznámka"
                            name="note"
                            defaultValue={dealerData.note}
                        />
                    </div>
                </div>
            )}
        </UniversalForm>
    )
}
