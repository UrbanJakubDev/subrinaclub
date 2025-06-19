'use client'
import { useEffect, useState } from 'react'
import InputField from '../../ui/inputs/basicInput'
import InputDateFiled from '../../ui/inputs/dateInput'
import { toast } from 'react-toastify'
import { Typography, Select, Option } from '@material-tailwind/react'
import UniversalForm from '../../forms/universalForm'
import SelectField from '../../ui/inputs/selectInput'
import { quarterSelectOptions, yearSelectOptions } from '@/lib/utils/dateFnc'
import { Transaction, TransactionCreateDTO, TransactionUpdateDTO } from '@/types/transaction'
import { transactionValidationSchema } from '@/validations/transactions'
import Skeleton from '@/components/ui/skeleton'
import { TransactionType } from '@prisma/client'
import { useModalStore } from '@/stores/ModalStore'
import { Account } from '@/types/types'
import { Bonus, BonusSelectDTO } from '@/types/bonus'
import SwitchField from '@/components/ui/inputs/inputSwitcher'
import { useCreateTransaction, useUpdateTransaction } from '@/lib/queries/transaction/mutations'
import { useBonusesForSelect } from '@/lib/queries/bonus/queries'

type Props = {
    existingTransaction?: Transaction | null
    account: Account
}

const TransactionForm = ({ existingTransaction, account }: Props) => {
    const { data: bonusesResponse, isLoading: isLoadingBonuses } = useBonusesForSelect()
    const { actions } = useModalStore()
    const [dateRangeError, setDateRangeError] = useState<string | null>(null)
    const createTransaction = useCreateTransaction()
    const updateTransaction = useUpdateTransaction()

    // Create initial transaction data
    const getInitialTransactionData = () => {
        if (existingTransaction?.id) {
            // Editing existing transaction - exclude accountId and savingPeriodId
            return {
                year: existingTransaction.year,
                quarter: existingTransaction.quarter,
                points: existingTransaction.points,
                acceptedBonusOrder: existingTransaction.acceptedBonusOrder,
                sentBonusOrder: existingTransaction.sentBonusOrder,
                bonusPrice: existingTransaction.bonusPrice,
                bonusId: existingTransaction.bonusId || 0,
                description: existingTransaction.description,
                type: existingTransaction.type,
                quarterDateTime: existingTransaction.quarterDateTime,
                directSale: existingTransaction.directSale,
            } as TransactionUpdateDTO
        }

        // Creating new transaction - include accountId and savingPeriodId
        const activeSavingPeriod = account.savingPeriods?.[0]
        return {
            year: new Date().getFullYear(),
            quarter: 1,
            points: 1,
            acceptedBonusOrder: null,
            sentBonusOrder: null,
            bonusPrice: 0,
            bonusId: 0,
            description: '',
            accountId: account.id,
            savingPeriodId: activeSavingPeriod?.id || 0,
            type: TransactionType.DEPOSIT,
            quarterDateTime: new Date(),
            directSale: false,
        } as TransactionCreateDTO
    }

    const initialData = getInitialTransactionData()

    // Validation and form change handling
    const validateDateRange = (year: number, quarter: number) => {
        const activeSavingPeriod = account.savingPeriods?.[0]
        if (!activeSavingPeriod || !year || !quarter) {
            setDateRangeError(null)
            return
        }

        const selectedYQ = year * 10 + quarter
        const startYQ = activeSavingPeriod.startYear * 10 + activeSavingPeriod.startQuarter
        const endYQ = activeSavingPeriod.endYear * 10 + activeSavingPeriod.endQuarter

        if (selectedYQ < startYQ || selectedYQ > endYQ) {
            const errorMsg = `Vybrané období (${year}/${quarter}) je mimo rozsah aktivního šetřícího období (${activeSavingPeriod.startYear}/${activeSavingPeriod.startQuarter} - ${activeSavingPeriod.endYear}/${activeSavingPeriod.endQuarter})`
            setDateRangeError(errorMsg)
        } else {
            setDateRangeError(null)
        }
    }

    const handleFormChange = (formMethods: any) => {
        const bonusId = formMethods.watch('bonusId')
        const points = formMethods.watch('points')
        const year = formMethods.watch('year')
        const quarter = formMethods.watch('quarter')

        // Validate date range
        validateDateRange(year, quarter)

        // Auto-adjust points for bonus transactions
        if (bonusId > 0 && points > 0) {
            formMethods.setValue('points', -Math.abs(points))
        }
    }

    const handleSubmit = async (
        formData: TransactionCreateDTO | TransactionUpdateDTO,
    ): Promise<Transaction> => {
        try {
            const isNewTransaction = !existingTransaction?.id
            const activeSavingPeriod = account.savingPeriods?.[0]

            if (!activeSavingPeriod?.id) {
                throw new Error('Účet nemá žádné aktivní šetřící období')
            }

            // Filter out invalid fields and handle bonusId properly
            const cleanFormData = {
                year: formData.year,
                quarter: formData.quarter,
                points: formData.points,
                acceptedBonusOrder: formData.acceptedBonusOrder,
                sentBonusOrder: formData.sentBonusOrder,
                bonusPrice: formData.bonusPrice,
                bonusId: formData.bonusId || null,
                description: formData.description,
                type: formData.type,
                quarterDateTime: formData.quarterDateTime,
                directSale: formData.directSale,
            }

            let savedTransaction
            if (isNewTransaction) {
                // For new transactions, we need to ensure accountId and savingPeriodId are included
                const createData = {
                    ...cleanFormData,
                    accountId: account.id,
                    savingPeriodId: activeSavingPeriod.id,
                } as TransactionCreateDTO

                savedTransaction = await createTransaction.mutateAsync(createData)
            } else {
                // For updates, we don't include accountId and savingPeriodId
                savedTransaction = await updateTransaction.mutateAsync({
                    id: existingTransaction.id,
                    data: cleanFormData as TransactionUpdateDTO,
                })
            }

            toast.success(`Transakce byla ${isNewTransaction ? 'vytvořena' : 'aktualizována'}`)

            // Close modal for positive transactions
            if (formData.points > 0) {
                actions.closeModal()
            }

            return savedTransaction
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Chyba při ukládání transakce'
            toast.error(errorMessage)
            throw error
        }
    }

    // Loading state
    if (isLoadingBonuses || !bonusesResponse) {
        return <Skeleton />
    }

    if (!account.savingPeriods?.[0]) {
        return (
            <div className="p-4 text-red-500">
                <Typography variant="h6">Chyba</Typography>
                <p>Účet nemá žádné aktivní šetřící období. Nelze vytvořit transakci.</p>
            </div>
        )
    }

    // Handle bonus options with proper type assertion
    const bonusOptions =
        (bonusesResponse as any)?.data?.map((bonus: BonusSelectDTO) => ({
            value: bonus.value,
            label: bonus.label,
        })) || []

    const yearOptions = yearSelectOptions()
    const quarterOptions = quarterSelectOptions()

    return (
        <UniversalForm
            initialData={initialData}
            validationSchema={transactionValidationSchema}
            onSubmit={handleSubmit}
            customError={dateRangeError}>
            {formMethods => {
                useEffect(() => {
                    const subscription = formMethods.watch((value, { name }) => {
                        if (['bonusId', 'points', 'year', 'quarter'].includes(name || '')) {
                            handleFormChange(formMethods)
                        }
                    })

                    // Initial validation
                    handleFormChange(formMethods)

                    return () => subscription.unsubscribe()
                }, [])

                return (
                    <div className="gap-4 mt-8">
                        {/* Year and Quarter Selection */}
                        <div className="flex flex-row gap-4">
                            <div className="w-1/2">
                                <Select
                                    label="Rok"
                                    value={formMethods.watch('year')?.toString() || ''}
                                    onChange={value => {
                                        if (value) {
                                            formMethods.setValue('year', parseInt(value), {
                                                shouldValidate: true,
                                            })
                                            handleFormChange(formMethods)
                                        }
                                    }}>
                                    {yearOptions.map(option => (
                                        <Option key={option.value} value={option.value.toString()}>
                                            {option.label}
                                        </Option>
                                    ))}
                                </Select>
                            </div>

                            <div className="w-1/2">
                                <Select
                                    label="Čtvrtletí"
                                    value={formMethods.watch('quarter')?.toString() || ''}
                                    onChange={value => {
                                        if (value) {
                                            formMethods.setValue('quarter', parseInt(value), {
                                                shouldValidate: true,
                                            })
                                            handleFormChange(formMethods)
                                        }
                                    }}>
                                    {quarterOptions.map(option => (
                                        <Option key={option.value} value={option.value.toString()}>
                                            {option.label}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        {/* Date Range Error */}
                        {dateRangeError && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-500 text-sm">
                                {dateRangeError}
                            </div>
                        )}

                        {/* Transaction Details */}
                        <div className="my-4 flex flex-col gap-4">
                            <InputField label="Body" type="number" name="points" />
                            <InputDateFiled label="Přijetí objednávky" name="acceptedBonusOrder" />
                        </div>

                        {/* Bonus Selection */}
                        <div className="mb-4 flex flex-col gap-4">
                            <Typography>Výběr bonusu</Typography>
                            <InputField label="Popis" type="text" name="description" />
                            <InputDateFiled label="Odeslání Bonusu" name="sentBonusOrder" />
                            <InputField label="Bonus - cena" type="number" name="bonusPrice" />
                            <SelectField label="Bonus" name="bonusId" options={bonusOptions} />
                            <SwitchField label="Přímý prodej" name="directSale" />
                        </div>
                    </div>
                )
            }}
        </UniversalForm>
    )
}

export default TransactionForm
