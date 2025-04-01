'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

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
import { customerApi } from '@/lib/api/customer/api'

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
    // Set default registration number from props if creating a new customer
    const defaultCustomer = React.useMemo(() => {
        if (initialCustomerData) return initialCustomerData;
        return {
            ...newCustomer,
            registrationNumber: nextRegNumber || 0
        } as Customer;
    }, [initialCustomerData, nextRegNumber]);

    const [customerData, setCustomerData] = React.useState<Customer>(defaultCustomer)
    const queryClient = useQueryClient()

    // Use API functions instead of server actions
    const updateCustomerMutation = useMutation({
        mutationFn: async (data: CreateCustomerDTO) => {
            if (customerData.id) {
                // Use the API update function
                return await customerApi.update(customerData.id, data)
            } else {
                // Use the API create function with required fields
                const customerFields = {
                    ...data,
                    // Make sure we're passing the correct non-null values for required fields
                    publicId: '',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    account: {} as any // Placeholder for account
                };
                return await customerApi.create(customerFields as unknown as Omit<Customer, "id">)
            }
        },
        onSuccess: () => {
            // Invalidate and refetch customers data after mutation
            queryClient.invalidateQueries({ queryKey: ['customers'] })

            // Show success message
            toast.success(customerData.id ? "Zákazník byl úspěšně upraven." : "Zákazník byl úspěšně vytvořen.")

            // If it's a new customer, navigate to /customers
            if (!customerData.id) {
                router.push('/customers')
            } else {
                router.refresh()
            }
        },
        onError: (error: any) => {
            toast.error(`Chyba: ${error.message || 'Něco se pokazilo'}`)
        }
    })

    // Handle form submission
    const handleSubmit = async (data: CreateCustomerDTO): Promise<CreateCustomerDTO> => {
        try {
            const result = await updateCustomerMutation.mutateAsync(data)
            return data // Return the data to satisfy the return type
        } catch (error) {
            throw error
        }
    }

    // If the initialSalesManagerData has changed, update the salesManagerData state and rerender the form
    React.useEffect(() => {
        if (initialCustomerData) {
            setCustomerData(initialCustomerData);
        }
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
            <UniversalForm<CreateCustomerDTO>
                initialData={customerData as unknown as CreateCustomerDTO}
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
                                defaultValue={customerData.registrationNumber?.toString() || nextRegNumber?.toString() || '0'}
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
                                defaultValue={customerData.gdpr || undefined}
                            />
                        </div>
                        <hr />
                        <div className="flex gap-4 w-full ">
                            <SelectField
                                customClass="w-full"
                                label="Velkoobchod"
                                name="dealerId"
                                options={dials.dealers}
                                defaultValue={customerData.dealerId || undefined}
                            />
                        </div>
                        <hr />
                        <div className="flex gap-4">
                            <SelectField
                                label="Obchodní zástupce"
                                name="salesManagerId"
                                options={dials.salesManagers}
                                defaultValue={customerData.salesManagerId || undefined}
                            />
                            <InputField
                                label="Kvartál"
                                type="number"
                                name="salesManagerSinceQ"
                                defaultValue={customerData.salesManagerSinceQ?.toString() || ''}
                            />
                            <InputField
                                label="Rok"
                                type="number"
                                name="salesManagerSinceYear"
                                defaultValue={customerData.salesManagerSinceYear?.toString() || ''}
                            />
                        </div>
                    </div>

                )}
            </UniversalForm>
        </Card>
    )
}
