'use client'
import React, { useState } from 'react'
import { AccountInfoCardProps } from '@/lib/services/account/types'
import Skeleton from '@/components/ui/skeleton'
import Button from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ModalComponent from '@/components/ui/modal'
import { useModalStore } from '@/stores/ModalStore'
import { Typography } from '@material-tailwind/react'
import { Card } from '@material-tailwind/react'
import StatusChip from '@/components/ui/StatusChip'
import LoadingSpinner from '@/components/ui/loadingSpinner'
import SavingPeriodActions from './SavingPeriodActions'
import { QuarterDate } from '@/lib/utils/quarterDateUtils'

const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ account, savingPeriod, isLoading }) => {
    const router = useRouter()
    const [isClosing, setIsClosing] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const { actions } = useModalStore()
    const savingPeriodStart = savingPeriod
        ? `${savingPeriod.startYear} / 0${savingPeriod.startQuarter}`
        : ''
    const savingPeriodEnd = savingPeriod
        ? `${savingPeriod.endYear} / 0${savingPeriod.endQuarter}`
        : ''

    // Initialize QuarterDateUtils with the current date
    const qd = new QuarterDate()

    // Get current year and quarter
    const actualYear = qd.getActualYearAndQuarter().actualYear
    const actualQuarter = qd.getActualYearAndQuarter().actualQuarter

    // Initialize selected year and quarter with current values
    const [selectedYear, setSelectedYear] = useState(actualYear)
    const [selectedQuarter, setSelectedQuarter] = useState(actualQuarter)

    if (isLoading) return <Skeleton className="w-1/4" />
    if (!account) return <pre>Account not found</pre>

    const handleCloseSavingPeriod = async (closeNow = false) => {
        if (!savingPeriod) return

        // Show warning dialog if there are available points
        if (savingPeriod.availablePoints > 0) {
            // Open confirmation modal with data about the closing operation
            actions.openModal('closeSavingPeriodConfirmation', {
                availablePoints: savingPeriod.availablePoints,
                closeNow,
                actualYear,
                actualQuarter,
                selectedYear,
                selectedQuarter,
            })
        } else {
            // If no points, proceed directly
            executeCloseSavingPeriod(closeNow)
        }
    }

    // Function to execute the API call to close the saving period
    const executeCloseSavingPeriod = async (closeNow: boolean) => {
        if (!savingPeriod) return

        const newSavingPeriod = {
            startYear: selectedYear,
            startQuarter: selectedQuarter,
        }

        try {
            setIsClosing(true)
            setIsCreating(true)
            const response = await fetch(`/api/saving-periods/${savingPeriod.id}/close`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    closeNow
                        ? {
                              createNewPeriod: true,
                              startYear: newSavingPeriod.startYear,
                              startQuarter: newSavingPeriod.startQuarter,
                          }
                        : {
                              createNewPeriod: true,
                          },
                ),
            })

            if (!response.ok) {
                throw new Error('Failed to close saving period')
            }

            router.refresh()
        } catch (error) {
            console.error('Error closing saving period:', error)
            alert('Nepodařilo se uzavřít šetřící období. Zkuste to prosím znovu.')
        } finally {
            setIsClosing(false)
            setIsCreating(false)
        }
    }

    // Handle year input change with proper type conversion
    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10)
        if (!isNaN(value)) {
            setSelectedYear(value)
        }
    }

    // Handle quarter input change with proper type conversion and validation
    const handleQuarterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value, 10)
        if (!isNaN(value) && value >= 1 && value <= 4) {
            setSelectedQuarter(value)
        }
    }

    // Confirmation Dialog Component
    const CloseSavingPeriodConfirmation = () => {
        const { actions, data } = useModalStore()

        if (!data) return null

        const { availablePoints, closeNow, actualYear, actualQuarter } = data

        const handleConfirm = () => {
            actions.closeModal()
            executeCloseSavingPeriod(closeNow)
        }

        const handleCancel = () => {
            actions.closeModal()
        }

        return (
            <ModalComponent
                modalId="closeSavingPeriodConfirmation"
                title={closeNow ? 'Uzavření šetřícího období nyní' : 'Uzavření šetřícího období'}>
                <div className="space-y-4">
                    {/* Warning about unused points */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-yellow-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <Typography variant="h6" className="text-yellow-700">
                                    Nevybrané body
                                </Typography>
                                <div className="text-yellow-700">
                                    <p className="font-medium">
                                        V šetřícím období máte{' '}
                                        <span className="font-bold">{availablePoints}</span>{' '}
                                        nevybraných bodů.
                                    </p>
                                    <p>Pokud období uzavřete, tyto body již nebude možné vybrat.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Explanation of what will happen */}
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-blue-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <Typography variant="h6" className="text-blue-700">
                                    Co se stane
                                </Typography>
                                <div className="text-blue-700">
                                    {closeNow ? (
                                        <>
                                            <p className="font-medium">
                                                Uzavřete aktuální šetřící období.
                                            </p>
                                            <p className="mb-4">
                                                Bude vytvořeno nové šetřící období začínající od
                                                roku <strong>{selectedYear}</strong> a čtvrtletí{' '}
                                                <strong>{selectedQuarter}</strong>.
                                            </p>

                                            <div className="bg-white p-4 rounded-md border border-blue-200 mb-2">
                                                <Typography
                                                    variant="small"
                                                    className="text-gray-700 font-medium mb-2">
                                                    Vyberte počáteční rok a čtvrtletí pro nové
                                                    šetřící období:
                                                </Typography>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label
                                                            htmlFor="yearInput"
                                                            className="block text-sm font-medium text-gray-700 mb-1">
                                                            Rok
                                                        </label>
                                                        <input
                                                            id="yearInput"
                                                            type="number"
                                                            min={actualYear - 1}
                                                            max={actualYear + 5}
                                                            value={selectedYear}
                                                            onChange={handleYearChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label
                                                            htmlFor="quarterSelect"
                                                            className="block text-sm font-medium text-gray-700 mb-1">
                                                            Čtvrtletí
                                                        </label>
                                                        <select
                                                            id="quarterSelect"
                                                            value={selectedQuarter}
                                                            onChange={handleQuarterChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                                                            <option value={1}>Q1</option>
                                                            <option value={2}>Q2</option>
                                                            <option value={3}>Q3</option>
                                                            <option value={4}>Q4</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <p className="text-xs text-gray-500 mt-2">
                                                    Tyto hodnoty budou použity pro vytvoření nového
                                                    šetřícího období. Výchozí hodnoty jsou nastaveny
                                                    na předchozí čtvrtletí.
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-medium">
                                                Uzavřete aktuální šetřící období a bude automaticky
                                                vytvořeno nové šetřící období.
                                            </p>
                                            <p>
                                                Nové období bude začínat v následujícím čtvrtletí po
                                                konci aktuálního období.
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Typography variant="paragraph" className="font-bold text-gray-900">
                        Opravdu chcete pokračovat?
                    </Typography>

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button onClick={handleCancel} variant="outlined" color="gray">
                            Zrušit
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            variant="filled"
                            color="red"
                            disabled={isClosing}>
                            {isClosing ? (
                                <LoadingSpinner size="sm" text="Uzavírání..." />
                            ) : closeNow ? (
                                'Uzavřít období nyní'
                            ) : (
                                'Uzavřít období'
                            )}
                        </Button>
                    </div>
                </div>
            </ModalComponent>
        )
    }

    return (
        <>
            <CloseSavingPeriodConfirmation />

            <Card className="p-8 flex flex-col rounded-sm">
                <Typography variant="h3" color="black">
                    Stav účtu
                </Typography>
                <span className="text-sm text-gray-500">Účet s ID: {account.id}</span>
                <div className="w-full flex flex-col gap-8 mt-6">
                    <article>
                        <Typography variant="h5" color="black">
                            Body na účtu
                        </Typography>
                        <p>
                            Klubové konto:{' '}
                            {account.lifetimePoints + (account.lifetimePointsCorrection || 0)}
                        </p>
                        <p>
                            Roční konto: {new Date().getFullYear()}:{' '}
                            {account.currentYearPoints || 0}
                        </p>
                    </article>

                    <article>
                        <Typography variant="h5" color="black">
                            <span className="flex items-center gap-2">Aktivní šetřící období</span>
                            <div className="flex items-center gap-2">
                                <StatusChip status={savingPeriod?.status} />{' '}
                                <span className=" text-sm text-gray-500">
                                    ID: {savingPeriod?.id}
                                </span>
                            </div>
                            <p className="text-xl mt-4">
                                Od: {savingPeriodStart} - Do: {savingPeriodEnd}{' '}
                            </p>
                        </Typography>
                        {isLoading ? (
                            <Skeleton className="w-full h-24" />
                        ) : savingPeriod ? (
                            <>
                                <p>
                                    Průběžné konto: {savingPeriod.totalDepositedPoints?.toString()}
                                </p>
                                <p>
                                    Průměrné body před přiřazením obchodního zástupce:{' '}
                                    {account.averagePointsBeforeSalesManager?.toString()}
                                </p>
                                <SavingPeriodActions
                                    isClosing={isClosing}
                                    onClose={handleCloseSavingPeriod}
                                />
                                <Link
                                    href={`/accounts/${account.id}/saving-periods`}
                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                                    (Správa šetřících období)
                                </Link>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-yellow-600">Žádné aktivní šetřící období</p>
                                <Link
                                    href={`/accounts/${account.id}/saving-periods`}
                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                                    (Správa šetřících období)
                                </Link>
                            </div>
                        )}
                    </article>
                </div>
            </Card>
        </>
    )
}

export default AccountInfoCard
