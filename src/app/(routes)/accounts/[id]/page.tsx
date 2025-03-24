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
    const [account, setAccount] = useState<AccountData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        active: true,
        lifetimePoints: 0,
        currentYearPoints: 0,
        totalDepositedPoints: 0,
        totalWithdrawnPonits: 0,
        averagePointsBeforeSalesManager: 0,
        lifetimePointsCorrection: 0,
    });

    // Fetch account data
    const fetchAccount = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/accounts/${accountId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch account");
            }
            const data = await response.json();
            setAccount(data);
            // Initialize form with account data
            setFormData({
                active: data.active,
                lifetimePoints: data.lifetimePoints,
                currentYearPoints: data.currentYearPoints,
                totalDepositedPoints: data.totalDepositedPoints,
                totalWithdrawnPonits: data.totalWithdrawnPonits,
                averagePointsBeforeSalesManager: data.averagePointsBeforeSalesManager || 0,
                lifetimePointsCorrection: data.lifetimePointsCorrection || 0,
            });
        } catch (error) {
            console.error("Error fetching account:", error);
            toast.error("Nepodařilo se načíst data účtu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccount();
    }, [accountId]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'averagePointsBeforeSalesManager' 
                ? parseFloat(value) || 0 
                : parseInt(value) || 0,
        });
    };

    // Handle switch change
    const handleSwitchChange = () => {
        setFormData({
            ...formData,
            active: !formData.active,
        });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch(`/api/accounts/${accountId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    customerId: account?.customerId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update account");
            }

            const data = await response.json();
            
            // Verify that we received valid account data with customer information
            if (!data || !data.customer || !data.customer.fullName) {
                throw new Error("Neplatná odpověď ze serveru");
            }
            
            // Update the account state with the complete data from the API
            setAccount(data);
            toast.success("Účet byl úspěšně aktualizován");
        } catch (error) {
            console.error("Error updating account:", error);
            toast.error("Nepodařilo se aktualizovat účet");
            
            // In case of error, refresh the account data
            fetchAccount();
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Skeleton className="h-screen w-full" />;
    }

    if (!account) {
        return (
            <PageComponent>
                <Typography variant="h4" color="red">
                    Účet nebyl nalezen
                </Typography>
            </PageComponent>
        );
    }

    return (
        <PageComponent>
            <div className="w-full max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div>
                        <Typography variant="h3" className="mb-2">
                            Účet zákazníka: {account.customer.fullName}
                        </Typography>
                        <Typography variant="paragraph" className="text-gray-600">
                            ID účtu: {account.id} | Registrační číslo: {account.customer.registrationNumber}
                        </Typography>
                    </div>
                    <div className="mt-3 md:mt-0 flex gap-3">
                        <Link 
                            href={`/customers/${account.customerId}/stats`}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            <FontAwesomeIcon icon={faChartLine} />
                            <span>Statistiky zákazníka</span>
                        </Link>
                    </div>
                </div>

                <Card className="p-6 mb-6">
                    <form onSubmit={handleSubmit}>
                        <Typography variant="h5" className="mb-4">
                            Úprava účtu
                        </Typography>

                        <div className="mb-4">
                            <Switch
                                label="Aktivní účet"
                                checked={formData.active}
                                onChange={handleSwitchChange}
                                disabled={true}
                                crossOrigin={undefined}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <Typography variant="small" className="mb-2 font-medium">
                                    Body celkem (pouze k náhledu)
                                </Typography>
                                <Input
                                    type="number"
                                    name="lifetimePoints"
                                    value={formData.lifetimePoints}
                                    onChange={handleInputChange}
                                    className="w-full"
                                    containerProps={{ className: "min-w-[100px]" }}
                                    disabled={true}
                                    crossOrigin={undefined}
                                />
                            </div>
                            <div>
                                <Typography variant="small" className="mb-2 font-medium">
                                    Body v aktuálním roce (pouze k náhledu)
                                </Typography>
                                <Input
                                    type="number"
                                    name="currentYearPoints"
                                    value={formData.currentYearPoints}
                                    onChange={handleInputChange}
                                    className="w-full"
                                    containerProps={{ className: "min-w-[100px]" }}
                                    disabled={true}
                                    crossOrigin={undefined}
                                />
                            </div>
                            <div>
                                <Typography variant="small" className="mb-2 font-medium">
                                    Celkem nasbíráno bodů (pouze k náhledu)
                                </Typography>
                                <Input
                                    type="number"
                                    name="totalDepositedPoints"
                                    value={formData.totalDepositedPoints}
                                    onChange={handleInputChange}
                                    className="w-full"
                                    containerProps={{ className: "min-w-[100px]" }}
                                    disabled={true}
                                    crossOrigin={undefined}
                                />
                            </div>
                            <div>
                                <Typography variant="small" className="mb-2 font-medium">
                                    Celkem utraceno bodů (pouze k náhledu)
                                </Typography>
                                <Input
                                    type="number"
                                    name="totalWithdrawnPonits"
                                    value={formData.totalWithdrawnPonits}
                                    onChange={handleInputChange}
                                    className="w-full"
                                    containerProps={{ className: "min-w-[100px]" }}
                                    disabled={true}
                                    crossOrigin={undefined}
                                />
                            </div>
                            <div>
                                <Typography variant="small" className="mb-2 font-medium text-blue-600">
                                    Korekce bodů celkem
                                </Typography>
                                <Input
                                    type="number"
                                    name="lifetimePointsCorrection"
                                    value={formData.lifetimePointsCorrection}
                                    onChange={handleInputChange}
                                    className="w-full"
                                    containerProps={{ className: "min-w-[100px]" }}
                                    crossOrigin={undefined}
                                />
                            </div>
                            <div>
                                <Typography variant="small" className="mb-2 font-medium text-blue-600">
                                    Průměrné body před SM
                                </Typography>
                                <Input
                                    type="number"
                                    name="averagePointsBeforeSalesManager"
                                    value={formData.averagePointsBeforeSalesManager}
                                    onChange={handleInputChange}
                                    className="w-full"
                                    containerProps={{ className: "min-w-[100px]" }}
                                    crossOrigin={undefined}
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                color="blue"
                                type="submit"
                                disabled={saving}
                                className="mt-4"
                            >
                                {saving ? "Ukládám..." : "Uložit změny"}
                            </Button>
                        </div>
                    </form>
                </Card>

                {account.savingPeriods && account.savingPeriods.length > 0 && (
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
                                    {account.savingPeriods.map((period) => (
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
                                                    onClick={() => window.location.href = `/accounts/${account.id}/saving-periods/${period.id}`}
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