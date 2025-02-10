'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

import { updateCustomerServerAction, addCustomerServerAction, refreshCustomersDataServerAction } from '@/actions/customer'
import { Customer } from '@/types/customer'
import { CreateCustomerDTO, customerValidationSchema } from '@/lib/services/customer/validation'
import { CustomerFormProps } from '@/lib/services/customer/types'
import UniversalForm from '@/components/forms/universalForm'
import InputSwitcher from '@/components/ui/inputs/inputSwitcher'
import InputField from '@/components/ui/inputs/basicInput'
import TextAreaField from '@/components/ui/inputs/textareaInput'
import SelectField from '@/components/ui/inputs/selectInput'
import InputDateFiled from '@/components/ui/inputs/dateInput'
import { Card } from '@material-tailwind/react'

const newCustomer: CreateCustomerDTO = {
    active: true,
    ico: '',
    registrationNumber: 0,
    registratedSince: new Date(),
    fullName: '',
    birthDate: null,
    email: '',
    phone: '',
    salonName: '',
    address: '',
    town: '',
    psc: '',
    note: '',
    dealerId: null,
    salesManagerId: null,
    salesManagerSinceQ: null,
    salesManagerSinceYear: null,
    gdpr: null,
}

export default function CustomerForm({ initialCustomerData, dials, nextRegNumber }: CustomerFormProps) {
    const router = useRouter()
    const [customerData, setCustomerData] = React.useState<Customer>(initialCustomerData || newCustomer as Customer)


    // Fetch customer by ico or full name if customer is new after ico or full name is set
    // const checkCustomer = async () => {
    //     const ico = 6

    //     if (ico) {
    //         try {
    //             const response = await fetch(`/api/customers?ico=${ico}`)
    //             const result = await response.json()

    //             if (!response.ok) {
    //                 throw new Error(result.message)
    //             }

    //             if (result === null) {
    //                 setCanSaveCustomer(true)
    //                 return
    //             }

    //             toast.info(`Zákazník: ${result.fullName} je již v databázi `)
    //             setCanSaveCustomer(false)
    //         } catch (error) {
    //             console.error('Error:', error)
    //         }
    //     }
    // }

    // Handle form submission
    const handleSubmit = async (data: CreateCustomerDTO) => {
        if (customerData.id) {
            await updateCustomerServerAction(customerData.id.toString(), data)
        } else {
            await addCustomerServerAction(data)
        }

        refreshCustomersDataServerAction()
        router.refresh()
    }

    // If the initialSalesManagerData has changed, update the salesManagerData state and rerender the form
    React.useEffect(() => {
        setCustomerData(initialCustomerData || newCustomer as Customer);
    }, [initialCustomerData]);


    const gdprOptions = [
        { label: 'Není', value: 0 },
        { label: 'Registrační formulář OZ', value: 1 },
        { label: 'Webový formulář', value: 2 },
        { label: 'dotazník (ze školení)', value: 3 },
        { label: 'velkoobchod', value: 4 },
        { label: 'tištěný formulář', value: 5 },
    ]



    return (
        <Card>
        <UniversalForm<Customer>
            initialData={customerData}
            validationSchema={customerValidationSchema}
            onSubmit={handleSubmit}
            successMessage={customerData.id ? "Zákazník byl úspěšně upraven." : "Zákazník byl úspěšně vytvořen."}
        >
            {() => (
                <div className="flex flex-col gap-6 my-6">
                    <div className="flex gap-4">
                        <InputSwitcher
                            label="Aktivní"
                            name="active"
                            // If customer is active set default value to true, otherwise false or if customer is new set default value to true
                            defaultValue={customerData.active}
                        />

                        <InputField
                            label="Registrační číslo"
                            type="number"
                            name="registrationNumber"
                            defaultValue={customerData.registrationNumber ? customerData.registrationNumber.toString() : nextRegNumber}
                            disabled
                        />
                        <InputField
                            label="IČO"
                            type="text"
                            name="ico"
                            defaultValue={customerData.ico}
                        />
                        <InputDateFiled
                            label="Registrace od"
                            name="registratedSince"
                            defaultValue={customerData.registratedSince}
                            helperText="RRRR-MM-DD"
                        />
                    </div>
                    <div className="flex gap-4">
                        <InputField
                            label="Jméno a příjmení"
                            type="text"
                            name="fullName"
                            defaultValue={customerData.fullName}
                        />
                        <InputDateFiled
                            label="Datum narození"
                            name="birthDate"
                            defaultValue={customerData.birthDate}
                            helperText="RRRR-MM-DD"
                        />

                        <InputField
                            label="Email"
                            type="email"
                            name="email"
                            defaultValue={customerData.email}
                        />

                        <InputField
                            label="Telefon"
                            type="tel"
                            name="phone"
                            defaultValue={customerData.phone}
                        />
                    </div>
                    <div className="flex gap-4">
                        <InputField
                            label="Salón"
                            type="text"
                            name="salonName"
                            defaultValue={customerData.salonName}
                        />
                    </div>
                    <div className="flex gap-4">
                        <InputField
                            label="Adresa"
                            type="text"
                            name="address"
                            defaultValue={customerData.address}
                        />
                        <InputField
                            label="Město"
                            type="text"
                            name="town"
                            defaultValue={customerData.town}
                        />
                        <InputField
                            label="PSČ"
                            type="text"
                            name="psc"
                            defaultValue={customerData.psc}
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <TextAreaField
                            label="Poznámka"
                            name="note"
                            defaultValue={customerData.note}
                        />
                        <SelectField
                            label="GDPR"
                            name="gdpr"
                            options={gdprOptions}
                            defaultValue={customerData.gdpr}
                        />
                    </div>
                    <hr />
                    <div className="flex gap-4 w-full">
                        <SelectField 
                            className="w-full"
                            label="Velkoobchod"
                            name="dealerId"
                            options={dials.dealers}
                            defaultValue={customerData.dealerId}
                        />
                    </div>
                    <hr />
                    <div className="flex gap-4">
                        <SelectField
                            label="Obchodní zástupce"
                            name="salesManagerId"
                            options={dials.salesManagers}
                            defaultValue={customerData.salesManagerId}
                        />
                        <InputField
                            label="Kvartál"
                            type="number"
                            name="salesManagerSinceQ"
                            defaultValue={customerData.salesManagerSinceQ}
                        />
                        <InputField
                            label="Rok"
                            type="number"
                            name="salesManagerSinceYear"
                            defaultValue={customerData.salesManagerSinceYear}
                        />
                    </div>
                </div>

            )}
        </UniversalForm>
        </Card>
    )
}
