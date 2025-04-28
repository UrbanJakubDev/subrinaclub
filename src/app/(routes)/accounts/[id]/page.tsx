'use client';
import { useEffect, useState } from "react";
import { accountService } from "@/lib/services/account";
import Skeleton from "@/components/ui/skeleton";
import { Card, Typography, Input, Switch, Button } from "@material-tailwind/react";
import { toast } from "react-toastify";
import PageComponent from "@/components/features/detailPage/pageComponent";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faEdit } from "@fortawesome/free-solid-svg-icons";
import AccountFormComponent from "@/components/features/account/AccountFormComponent";
import { useAccount } from "@/lib/queries/account/queries";
import NoData from "@/components/ui/noData";

interface PageProps {
    params: {
        id: string;
    };
}

interface AccountData {
    id: number;
    active: boolean;
    lifetimePoints: number;
    currentYearPoints: number;
    totalDepositedPoints: number;
    totalWithdrawnPonits: number;
    averagePointsBeforeSalesManager: number;
    lifetimePointsCorrection: number;
    customerId: number;
    customer: {
        fullName: string;
        registrationNumber: string;
    };
    savingPeriods?: any[];
}

export default function AccountPage({ params }: PageProps) {
    const accountId = parseInt(params.id);
    const { data: account, isLoading: isAccountLoading } = useAccount(accountId);
    const accountData = account?.data;



    if (isAccountLoading) {
        return <Skeleton className="h-screen w-full" />;
    }

    if (!account) {
        return <NoData />
    }

    return (
        <PageComponent>
            <div className="w-full max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div>
                        <Typography variant="h3" className="mb-2">
                            Účet zákazníka: {accountData?.customer?.fullName}
                        </Typography>
                        <Typography variant="paragraph" className="text-gray-600">
                            ID účtu: {accountData?.id} | Registrační číslo: {accountData?.customer?.registrationNumber}
                        </Typography>
                    </div>
                    <div className="mt-3 md:mt-0 flex gap-3">
                        <Link 
                            href={`/customers/${accountData?.customer?.id}/stats`}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            <FontAwesomeIcon icon={faChartLine} />
                            <span>Statistiky zákazníka</span>
                        </Link>
                    </div>
                </div>

                {accountData && (
                    <AccountFormComponent initialAccountData={accountData} />
                )}

                {accountData?.savingPeriods && accountData?.savingPeriods.length > 0 && (
                    <Card className="p-6">
                        <Typography variant="h5" className="mb-4">
                            Šetřící období
                        </Typography>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 text-left">ID</th>
                                        <th className="px-4 py-2 text-left">Status</th>
                                        <th className="px-4 py-2 text-left">Od</th>
                                        <th className="px-4 py-2 text-left">Do</th>
                                        <th className="px-4 py-2 text-left">Dostupné body</th>
                                        <th className="px-4 py-2 text-left">Nasbíráno</th>
                                        <th className="px-4 py-2 text-left">Utraceno</th>
                                        <th className="px-4 py-2 text-left">Akce</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accountData?.savingPeriods?.map((period) => (
                                        <tr key={period.id} className="border-t">
                                            <td className="px-4 py-2">{period.id}</td>
                                            <td className="px-4 py-2">{period.status}</td>
                                            <td className="px-4 py-2">{new Date(period.startDateTime).toLocaleDateString('cs-CZ')}</td>
                                            <td className="px-4 py-2">{new Date(period.endDateTime).toLocaleDateString('cs-CZ')}</td>
                                            <td className="px-4 py-2">{period.availablePoints}</td>
                                            <td className="px-4 py-2">{period.totalDepositedPoints}</td>
                                            <td className="px-4 py-2">{period.totalWithdrawnPoints}</td>
                                            <td className="px-4 py-2">
                                                <Button
                                                    color="blue"
                                                    size="sm"
                                                    variant="text"
                                                    onClick={() => window.location.href = `/accounts/${accountData?.id}/saving-periods/${period.id}`}
                                                >
                                                    Detail
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
            </div>
        </PageComponent>
    );
}