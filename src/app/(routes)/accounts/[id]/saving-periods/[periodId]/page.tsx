'use client';

import { useEffect, useState } from "react";
import Skeleton from "@/components/ui/skeleton";
import { Card, Typography } from "@material-tailwind/react";
import PageComponent from "@/components/features/detailPage/pageComponent";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { useSavingPeriod } from "@/lib/queries/savingPeriod/queries";
import NoData from "@/components/ui/noData";
import SavingPeriodFormComponent from "@/components/features/savingPeriod/savingPeriodFormComponent";
import { useAccount } from "@/lib/queries/account/queries";
import { useTransactionsBySavingPeriodId } from "@/lib/queries/transaction/queries";

interface PageProps {
    params: {
        id: string;
        periodId: string;
    };
}

export default function SavingPeriodPage({ params }: PageProps) {
    const savingPeriodId = parseInt(params.periodId);
    
    const { data: savingPeriod, isLoading: isSavingPeriodLoading } = useSavingPeriod(savingPeriodId);
    const { data: transactions, isLoading: isTransactionsLoading } = useTransactionsBySavingPeriodId(savingPeriodId);

    if (isSavingPeriodLoading || isTransactionsLoading) {
        return <Skeleton className="h-screen w-full" />; 
    }


    return (
        <PageComponent>
            <div className="w-full max-w-4xl mx-auto">
                <SavingPeriodFormComponent initialSavingPeriodData={savingPeriod} />

                {transactions && transactions.length > 0 ? (
                    <Card className="mt-8">
                        <table className="w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            Datum
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            Typ
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            Body
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            Poznámka
                                        </Typography>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <Typography variant="small" color="blue-gray">
                                                {new Date(transaction.createdAt).toLocaleDateString('cs-CZ')}
                                            </Typography>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <Typography variant="small" color="blue-gray">
                                                {transaction.type === 'DEPOSIT' ? 'Vklad' : 'Výběr'}
                                            </Typography>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <Typography 
                                                variant="small" 
                                                color={transaction.type === 'DEPOSIT' ? 'green' : 'red'}
                                            >
                                                {transaction.type === 'DEPOSIT' ? '+' : '-'}{transaction.points}
                                            </Typography>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <Typography variant="small" color="blue-gray">
                                                {transaction.note || '-'}
                                            </Typography>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                ) : (
                    <NoData text="Žádné transakce k zobrazení" className="mt-8" />
                )}

            </div>
        </PageComponent>
    );
} 