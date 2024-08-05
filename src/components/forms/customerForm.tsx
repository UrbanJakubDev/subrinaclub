'use client'
import { ICustomer } from '@/interfaces/interfaces'
import { customerValidationSchema } from '@/schemas/customerSchema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import InputField from '../ui/inputs/basicInput'
import InputDateFiled from '../ui/inputs/dateInput'
import InputSwitcher from '../ui/inputs/inputSwitcher'
import TextAreaField from '../ui/inputs/textareaInput'
import Loader from '../ui/loader'
import { Button, Card } from '@material-tailwind/react'
import SimpleSelectInput from '../ui/inputs/simpleSelectInput'

type Props = {
    customer: ICustomer
    dials: any
}

type CustomerFormValues = {
    active: boolean
    registrationNumber: number
    ico: string
    registratedSinceD: string
    fullName: string
    birthDateD?: string | null
    email: string
    phone?: string
    salonName?: string
    address?: string
    town?: string
    psc?: string
    note?: string
    dealerId?: number
    salesManagerId?: number
    salesManagerSinceQ?: number
    salesManagerSinceYear?: number
}

export default function CustomerForm({ customer, dials }: Props) {
    const [loading, setLoading] = React.useState(false)
    const [customerData, setCustomerData] = React.useState<ICustomer>(customer)
    const [canSaveCustomer, setCanSaveCustomer] = React.useState(true)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        control,
    } = useForm<CustomerFormValues>({ resolver: yupResolver(customerValidationSchema) })

    const getCustomerById = async (id: number) => {
        try {
            setLoading(true)
            const response = await fetch(`/api/customers?id=${id}`)
            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message)
            }

            setCustomerData(result)
            setLoading(false)
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const handleUpdate = async (data: ICustomer) => {
        try {
            setLoading(true)
            const response = await fetch(`/api/customers?id=${customer.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message)
            }

            setCustomerData(result)
            setLoading(false)
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const handleCreate = async (data: ICustomer) => {
        try {
            setLoading(true)
            const response = await fetch(`/api/customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message)
            }

            setCustomerData(result)
            setLoading(false)

            // Redirect back
            router.push(`/users/`)
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const onSubmit = async (data: ICustomer) => {
        console.log(errors)

        if (customer.id === 0) {
            handleCreate(data)
        } else {
            handleUpdate(data)
        }
        setLoading(false)
        toast.success('Zákazník byl uložen')

        await getCustomerById(customer.id)
    }

    // Fetch customer by ico or full name if customer is new after ico or full name is set
    const checkCustomer = async () => {
        const ico = watch(['ico'])

        if (ico) {
            try {
                const response = await fetch(`/api/customers?ico=${ico}`)
                const result = await response.json()

                if (!response.ok) {
                    throw new Error(result.message)
                }

                if (result === null) {
                    setCanSaveCustomer(true)
                    return
                }

                toast.info(`Zákazník: ${result.fullName} je již v databázi `)
                setCanSaveCustomer(false)
            } catch (error) {
                console.error('Error:', error)
            }
        }
    }

    // Check if customer is new or existing on change the ico in the form but only uf the length of ico is 8
    React.useEffect(() => {
        if (customer.id === 0 && watch('ico').length === 8) {
            checkCustomer()
        }
    }, [watch('ico')])

    if (loading) {
        return <Loader />
    }

    // On errors show error message
    if (errors) {
        console.log(errors)
    }

    return (
        <Card className="mx-auto p-4">
            <form>
                <div className="flex flex-col gap-6 my-6">
                    <div className="flex gap-4">
                        <InputSwitcher
                            label="Aktivní"
                            name="active"
                            register={register}
                            // If customer is active set default value to true, otherwise false or if customer is new set default value to true
                            defaultValue={customerData.active}
                            errors={errors}
                        />

                        <InputField
                            label="Registrační číslo"
                            type="number"
                            name="registrationNumber"
                            register={register}
                            defaultValue={customerData.registrationNumber.toString()}
                            errors={errors}
                            disabled
                        />
                        <InputField
                            label="IČO"
                            type="text"
                            name="ico"
                            register={register}
                            defaultValue={customerData.ico}
                            errors={errors}
                        />
                        <InputDateFiled
                            label="Registrace od"
                            type="date"
                            name="registratedSinceD"
                            register={register}
                            defaultValue={customerData.registratedSinceD}
                            helperText="RRRR-MM-DD"
                        />
                    </div>
                    <div className="flex gap-4">
                        <InputField
                            label="Jméno a příjmení"
                            type="text"
                            name="fullName"
                            register={register}
                            defaultValue={customerData.fullName}
                            errors={errors}
                        />
                        <InputDateFiled
                            label="Datum narození"
                            type="date"
                            name="birthDateD"
                            register={register}
                            defaultValue={customerData.birthDateD}
                            errors={errors}
                            helperText="RRRR-MM-DD"
                        />

                        <InputField
                            label="Email"
                            type="email"
                            name="email"
                            register={register}
                            defaultValue={customerData.email}
                            errors={errors}
                        />

                        <InputField
                            label="Telefon"
                            type="tel"
                            name="phone"
                            register={register}
                            defaultValue={customerData.phone}
                            errors={errors}
                        />
                    </div>
                    <div className="flex gap-4">
                        <InputField
                            label="Salón"
                            type="text"
                            name="salonName"
                            register={register}
                            defaultValue={customerData.salonName}
                            errors={errors}
                        />
                    </div>
                    <div className="flex gap-4">
                        <InputField
                            label="Adresa"
                            type="text"
                            name="address"
                            register={register}
                            defaultValue={customerData.address}
                            errors={errors}
                        />
                        <InputField
                            label="Město"
                            type="text"
                            name="town"
                            register={register}
                            defaultValue={customerData.town}
                            errors={errors}
                        />
                        <InputField
                            label="PSČ"
                            type="text"
                            name="psc"
                            register={register}
                            defaultValue={customerData.psc}
                            errors={errors}
                        />
                    </div>
                    <div className="flex gap-4">
                        <TextAreaField
                            label="Poznámka"
                            name="note"
                            register={register}
                            defaultValue={customerData.note}
                        />
                    </div>
                    <hr />
                    <div className="flex gap-4">
                        <Controller
                            name="dealerId"
                            control={control}
                            defaultValue={customerData.dealerId}
                            render={({ field }) => (
                                <div>
                                    <SimpleSelectInput
                                        label="Prodejce"
                                        options={dials.dealers}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                    {errors.dealerId && (
                                        <span className="text-red-500 text-xs">
                                            {errors.dealerId.message}
                                        </span>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                    <hr />
                    <div className="flex gap-4">
                        <Controller
                            name="salesManagerId"
                            control={control}
                            defaultValue={customerData.salesManagerId}
                            render={({ field }) => (
                                <div>
                                    <SimpleSelectInput
                                        label="Obchodní zástupce"
                                        options={dials.salesManagers}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                    {errors.salesManagerId && (
                                        <span className="text-red-500 text-xs">
                                            {errors.salesManagerId.message}
                                        </span>
                                    )}
                                </div>
                            )}
                        />
                        <InputField
                            label="Kvartál"
                            type="number"
                            name="salesManagerSinceQ"
                            register={register}
                            defaultValue={customerData.salesManagerSinceQ}
                            errors={errors}
                        />
                        <InputField
                            label="Rok"
                            type="number"
                            name="salesManagerSinceYear"
                            register={register}
                            defaultValue={customerData.salesManagerSinceYear}
                            errors={errors}
                        />
                    </div>
                </div>

                <div className="w-full flex justify-end gap-3 mt-4">
                    <Button onClick={handleSubmit(onSubmit)} disabled={!canSaveCustomer}>
                        Uložit
                    </Button>
                    <Button color="red" onClick={() => router.push('/users')}>
                        Zrušit
                    </Button>
                </div>
            </form>
        </Card>
    )
}
