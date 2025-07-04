'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

import {
    updateCustomerServerAction,
    addCustomerServerAction,
    refreshCustomersDataServerAction,
} from '@/actions/customer'
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
import { gdprOptions } from './types'

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

export default function CustomerForm({
    initialCustomerData,
    dials,
    nextRegNumber,
}: CustomerFormProps) {
    const router = useRouter()
    const [customerData, setCustomerData] = React.useState<Customer>(
        initialCustomerData || (newCustomer as Customer),
    )

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

    // Replace newCustomer registrationNumber with nextRegNumber
    newCustomer.registrationNumber = nextRegNumber

    // Handle form submission
    const handleSubmit = async (data: CreateCustomerDTO) => {
        if (customerData.id) {
            await updateCustomerServerAction(customerData.id.toString(), data)
        } else {
            await addCustomerServerAction(data)
        }

        refreshCustomersDataServerAction()
        router.push('/customers')
    }

    // If the initialSalesManagerData has changed, update the salesManagerData state and rerender the form
    React.useEffect(() => {
        setCustomerData(initialCustomerData || (newCustomer as Customer))
    }, [initialCustomerData])

    return (
        <Card>
            <UniversalForm<Customer>
                initialData={customerData}
                validationSchema={customerValidationSchema}
                onSubmit={handleSubmit}
                successMessage={
                    customerData.id
                        ? 'Zákazník byl úspěšně upraven.'
                        : 'Zákazník byl úspěšně vytvořen.'
                }>
                {() => (
                    <div className="flex flex-col gap-6 my-6">
                        <div className="flex gap-4">
                            <InputSwitcher
                                label="Aktivní"
                                name="active"
                                defaultValue={customerData.active}
                            />

                            <InputField
                                label="Registrační číslo"
                                type="number"
                                name="registrationNumber"
                                defaultValue={
                                    customerData.registrationNumber
                                        ? customerData.registrationNumber.toString()
                                        : nextRegNumber
                                }
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
                                helperText="DD-MM-RRRR"
                            />
                        </div>
                        <div className="flex gap-4">
                            <InputField
                                label="Příjmení a Jméno"
                                type="text"
                                name="fullName"
                                defaultValue={customerData.fullName}
                            />
                            <InputDateFiled
                                label="Datum narození"
                                name="birthDate"
                                defaultValue={customerData.birthDate}
                                helperText="DD-MM-RRRR"
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
                                customClass="w-1/4"
                                label="GDPR"
                                name="gdpr"
                                options={gdprOptions}
                                defaultValue={customerData.gdpr}
                            />
                        </div>
                        <hr />
                        <div className="flex gap-4 w-full ">
                            <SelectField
                                customClass="w-full"
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
