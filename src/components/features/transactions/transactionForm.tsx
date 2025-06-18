'use client'
import { useEffect, useState } from 'react'
import React from 'react'
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
import { useStatsStore } from '@/stores/CustomerStatsStore'
import { TransactionType } from '@prisma/client'
import { useModalStore } from '@/stores/ModalStore'
import { Account, SavingPeriod } from '@/types/types'
import { Bonus } from '@/types/bonus'
import SwitchField from '@/components/ui/inputs/inputSwitcher'
import { useCreateTransaction, useUpdateTransaction } from '@/lib/queries/transaction/mutations'
import { useBonusesForSelect } from '@/lib/queries/bonus/queries'
import { useAccount } from '@/lib/queries/account/queries'

const newTransaction: TransactionCreateDTO = {
    year: new Date().getFullYear(),
    quarter: 1,
    points: 1,
    acceptedBonusOrder: null,
    sentBonusOrder: null,
    bonusPrice: 0,
    bonusId: 0,
    description: '',
    accountId: 0,
    savingPeriodId: 0,
    type: TransactionType.DEPOSIT,
    quarterDateTime: new Date(),
    account: {} as Account,
    bonus: {} as Bonus,
    savingPeriod: {} as SavingPeriod,
    directSale: false,
}

type Props = {
    transaction: Transaction
    account: Account
}

const TransactionForm = ({ transaction, account }: Props) => {
    const { data: bonusesResponse, isLoading: isLoadingBonuses } = useBonusesForSelect()
    const [transactionData, setTransactionData] = useState<TransactionCreateDTO>(newTransaction)
    const yearDial = yearSelectOptions()
    const quarterDial = quarterSelectOptions()
    const { actions } = useModalStore()
    const [dateRangeError, setDateRangeError] = useState<string | null>(null)
    const createTransaction = useCreateTransaction()
    const updateTransaction = useUpdateTransaction()

    if (!account) {
        return <Skeleton />
    }

    if (!account) {
        return (
            <div className="p-4 text-red-500">
                <Typography variant="h6">Chyba</Typography>
                <p>Účet nemá žádné aktivní šetřící období. Nelze vytvořit transakci.</p>
            </div>
        )
    }

    useEffect(() => {
        if (transaction) {
            setTransactionData(transaction)
        }
    }, [transaction])

    const handleFormChange = (formMethods: any) => {
        const bonusId = formMethods.watch('bonusId')
        const points = formMethods.watch('points')
        const year = formMethods.watch('year')
        const quarter = formMethods.watch('quarter')

        // Only validate if we have all the necessary data
        if (account.savingPeriods?.[0] && year && quarter) {
            // Simple year-quarter comparison instead of date objects
            const selectedYQ = year * 10 + quarter
            const startYQ =
                account.savingPeriods?.[0]?.startYear * 10 +
                account.savingPeriods?.[0]?.startQuarter
            const endYQ =
                account.savingPeriods?.[0]?.endYear * 10 + account.savingPeriods?.[0]?.endQuarter

            if (selectedYQ < startYQ || selectedYQ > endYQ) {
                const errorMsg = `Vybrané období (${year}/${quarter}) je mimo rozsah aktivního šetřícího období (${account.savingPeriods?.[0]?.startYear}/${account.savingPeriods?.[0]?.startQuarter} - ${account.savingPeriods?.[0]?.endYear}/${account.savingPeriods?.[0]?.endQuarter})`
                setDateRangeError(errorMsg)
            } else {
                setDateRangeError(null)
            }
        } else {
            // Clear error if we don't have enough data to validate
            setDateRangeError(null)
        }

        if (bonusId > 0 && points > 0) {
            formMethods.setValue('points', -Math.abs(points))
        }
    }

    const handleSubmit = async (data: Transaction): Promise<Transaction> => {
        try {
            const isNewTransaction = !data.id

            if (!account) {
                throw new Error('Účet není k dispozici')
            }

            if (!account.savingPeriods || account.savingPeriods.length === 0) {
                throw new Error('Účet nemá žádné aktivní šetřící období')
            }

            const activeSavingPeriod = account.savingPeriods[0]
            if (!activeSavingPeriod.id) {
                throw new Error('ID šetřícího období není k dispozici')
            }

            const newTransactionData: TransactionCreateDTO = {
                accountId: account.id,
                savingPeriodId: activeSavingPeriod.id,
                bonusId: data.bonusId || null,
                bonusPrice: data.bonusPrice || 0,
                acceptedBonusOrder: data.acceptedBonusOrder || null,
                sentBonusOrder: data.sentBonusOrder || null,
                description: data.description || '',
                year: data.year,
                quarter: data.quarter,
                quarterDateTime: data.quarterDateTime,
                points: data.points,
                type: data.type,
                directSale: data.directSale,
            }

            const updateTransactionData: TransactionUpdateDTO = {
                bonusId: data.bonusId || null,
                bonusPrice: data.bonusPrice || 0,
                acceptedBonusOrder: data.acceptedBonusOrder || null,
                sentBonusOrder: data.sentBonusOrder || null,
                description: data.description || '',
                year: data.year,
                quarter: data.quarter,
                quarterDateTime: data.quarterDateTime,
                points: data.points,
                type: data.type,
                directSale: data.directSale,
            }

            let savedTransaction
            if (isNewTransaction) {
                savedTransaction = await createTransaction.mutateAsync(newTransactionData)
            } else {
                savedTransaction = await updateTransaction.mutateAsync({
                    id: data.id,
                    data: updateTransactionData
                })
            }

            toast.success('Transakce byla uložena')

            if (data.points > 0) {
                actions.closeModal()
            }

            if (data.points < 0) {
                setTransactionData(newTransaction)
            }

            return savedTransaction
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Chyba při ukládání transakce'
            toast.error(errorMessage)
            console.error('Transaction Form Error:', error)
            throw error
        }
    }

    if (isLoadingBonuses || !bonusesResponse?.data) {
        return <Skeleton />
    }

    const bonusOptions = bonusesResponse.data.map(bonus => ({
        value: bonus.id,
        label: bonus.name,
    }))

    return (
        <UniversalForm<TransactionCreateDTO>
            initialData={transactionData}
            validationSchema={transactionValidationSchema}
            onSubmit={handleSubmit}
            customError={dateRangeError}>
            {formMethods => {
                // Initialize form values
                useEffect(() => {
                    if (transactionData) {
                        formMethods.setValue('year', transactionData.year)
                        formMethods.setValue('quarter', transactionData.quarter)
                    }

                    const subscription = formMethods.watch((value, { name }) => {
                        if (
                            name === 'bonusId' ||
                            name === 'points' ||
                            name === 'year' ||
                            name === 'quarter'
                        ) {
                            handleFormChange(formMethods)
                        }
                    })

                    // Initial validation check
                    handleFormChange(formMethods)

                    return () => subscription.unsubscribe()
                }, [formMethods, transactionData])

                return (
                    <div className="gap-4 mt-8">
                        <div className="flex flex-row gap-4">
                            {/* Material Tailwind styled select for year */}
                            <div className="w-1/2">
                                <Select
                                    label="Rok"
                                    value={formMethods.watch('year')?.toString() || ''}
                                    onChange={value => {
                                        if (value) {
                                            const yearValue = parseInt(value)
                                            formMethods.setValue('year', yearValue, {
                                                shouldValidate: true,
                                            })
                                            handleFormChange(formMethods)
                                        }
                                    }}>
                                    {yearDial.map(option => (
                                        <Option key={option.value} value={option.value.toString()}>
                                            {option.label}
                                        </Option>
                                    ))}
                                </Select>
                            </div>

                            {/* Material Tailwind styled select for quarter */}
                            <div className="w-1/2">
                                <Select
                                    label="Čtvrtletí"
                                    value={formMethods.watch('quarter')?.toString() || ''}
                                    onChange={value => {
                                        if (value) {
                                            const quarterValue = parseInt(value)
                                            formMethods.setValue('quarter', quarterValue, {
                                                shouldValidate: true,
                                            })
                                            handleFormChange(formMethods)
                                        }
                                    }}>
                                    {quarterDial.map(option => (
                                        <Option key={option.value} value={option.value.toString()}>
                                            {option.label}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        {dateRangeError && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-500 text-sm">
                                {dateRangeError}
                            </div>
                        )}

                        <div className="my-4 flex flex-col gap-4">
                            <InputField
                                label="Body"
                                type="number"
                                name="points"
                                defaultValue={transactionData?.points}
                            />
                            <InputDateFiled label="Přijetí objednávky" name="acceptedBonusOrder" />
                        </div>

                        <div className="mb-4 flex flex-col gap-4">
                            <Typography>Vyběr bodů</Typography>
                            <InputField label="Popis" type="text" name="description" />

                            <InputDateFiled label="Odeslání Bonusu" name="sentBonusOrder" />
                            <InputField
                                label="Bonus - cena"
                                type="number"
                                name="bonusPrice"
                                defaultValue={0}
                            />
                            <SelectField
                                label="Bonus"
                                name="bonusId"
                                options={bonusOptions}
                                defaultValue={transactionData?.bonusId || 0}
                            />
                            <div className="flex items-center gap-2">
                                <SwitchField
                                    label="Přímý prodej"
                                    name="directSale"
                                    defaultValue={transactionData?.directSale}
                                />
                            </div>
                        </div>
                    </div>
                )
            }}
        </UniversalForm>
    )
}

export default TransactionForm
