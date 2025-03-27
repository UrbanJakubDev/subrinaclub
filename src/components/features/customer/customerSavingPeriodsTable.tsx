"use client";;
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import MyTable from "../../tables/ui/baseTable";
import { Chip, Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Select, Option } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import formatThousandDelimiter from "@/lib/utils/formatFncs";
import ActionButtons from "@/components/tables/ui/actionButtons";
import StatusChip from "@/components/tables/ui/statusChip";
import StatusIcon from "@/components/tables/ui/statusIcon";
import { toast } from "react-toastify";
import Link from "next/link";

interface Customer {
    id: string;
    active: boolean;
    registrationNumber: string;
    fullName: string;
    salonName: string;
    ico: string;
    salesManager: {
        fullName: string;
    };
    account?: {
        id: string;
        active: boolean;
        lifetimePoints: number;
        savingPeriod?: {
            id: number;
            status: string;
            availablePoints: number;
            startYear: number;
            startQuarter: number;
            endYear: number;
            endQuarter: number;
            endDateTime: string;
            daysLeft: number;
            endThisQuarter: boolean;
        };
    };
}

type Props = {
    defaultData: Customer[];
    detailLinkPath?: string;
    onRefetchNeeded?: () => void;
};

type StartPeriodFormData = {
    startYear: number;
    startQuarter: number;
};

export default function CustomerSavingPeriodsTable({ defaultData, detailLinkPath, onRefetchNeeded }: Props) {
    const router = useRouter();
    const tableName = "Přehled šetřících období";
    const [selectedRows, setSelectedRows] = useState<Customer[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState<StartPeriodFormData>(() => {
        const now = new Date();
        return {
            startYear: now.getFullYear(),
            startQuarter: Math.floor(now.getMonth() / 3) + 1
        };
    });

    // Handle refetch and reset selection
    const handleRefetchAndResetSelection = React.useCallback(() => {
        // Reset selected rows
        setSelectedRows([]);
        
        // Call the parent's refetch function if provided
        if (onRefetchNeeded) {
            onRefetchNeeded();
        }
    }, [onRefetchNeeded]);

    // Memoize the transformed data
    const data = React.useMemo(() => {
        return defaultData.map(row => ({
            ...row,
            registrationNumber: row.registrationNumber.toString()
        }));
    }, [defaultData]);

    // Handle selected rows
    const handleSelectionChange = React.useCallback((rows: Customer[]) => {
        setSelectedRows(rows);
    }, []);

    const handleCloseSavingPeriods = React.useCallback(async (rows: Customer[]) => {
        // Filter out customers without active saving periods
        const customersWithActivePeriods = rows.filter(
            customer => customer.account?.savingPeriod?.status === 'ACTIVE'
        );

        if (customersWithActivePeriods.length === 0) {
            toast.error('Žádný z vybraných zákazníků nemá aktivní šetřící období.');
            return;
        }

        // Warning if any customers have available points
        const customersWithPoints = customersWithActivePeriods.filter(
            customer => (customer.account?.savingPeriod?.availablePoints ?? 0) > 0
        );

        if (customersWithPoints.length > 0) {
            const confirmClose = window.confirm(
                `UPOZORNĚNÍ: ${customersWithPoints.length} zákazník(ů) má nevybrané body. ` +
                'Pokud období uzavřete, tyto body již nebude možné vybrat. ' +
                'Opravdu chcete uzavřít tato šetřící období?'
            );
            if (!confirmClose) return;
        }

        // Show loading toast
        const loadingToastId = toast.loading(
            `Uzavírání ${customersWithActivePeriods.length} šetřících období...`
        );

        // Close saving periods for all selected customers
        try {
            const results = await Promise.allSettled(
                customersWithActivePeriods.map(async (customer) => {
                    if (!customer.account?.savingPeriod?.id) return;
                    
                    const response = await fetch(
                        `/api/saving-periods/${customer.account.savingPeriod.id}/close`,
                        { 
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                createNewPeriod: true
                            })
                        }
                    );

                    if (!response.ok) {
                        throw new Error(`Nepodařilo se uzavřít šetřící období pro zákazníka ${customer.fullName}`);
                    }

                    return customer;
                })
            );

            // Count successes and failures
            const succeeded = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;

            // Update the loading toast with the result
            if (failed === 0) {
                toast.update(loadingToastId, {
                    render: `Úspěšně uzavřeno ${succeeded} šetřících období`,
                    type: 'success',
                    isLoading: false,
                    autoClose: 5000
                });
            } else {
                toast.update(loadingToastId, {
                    render: `Uzavřeno ${succeeded} období, ${failed} se nezdařilo`,
                    type: 'warning',
                    isLoading: false,
                    autoClose: 5000
                });

                // Show detailed errors
                results
                    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
                    .forEach(result => {
                        toast.error(result.reason.message);
                    });
            }

            // Refresh the page to show updated data
            router.refresh();
        } catch (error) {
            console.error('Error closing saving periods:', error);
            toast.update(loadingToastId, {
                render: 'Nepodařilo se uzavřít šetřící období. Zkuste to prosím znovu.',
                type: 'error',
                isLoading: false,
                autoClose: 5000
            });
        } finally {
            handleRefetchAndResetSelection();
        }
    }, [router, handleRefetchAndResetSelection]);

    const handleCreateFreshSavingPeriods = React.useCallback(async () => {
        setIsFormOpen(true);
    }, []);

    const handleFormSubmit = React.useCallback(async () => {
        setIsFormOpen(false);
        
        // Show loading toast
        const loadingToastId = toast.loading(
            `Vytváření nových šetřících období pro ${selectedRows.length} zákazníků...`
        );

        try {
            const results = await Promise.allSettled(
                selectedRows.map(async (customer) => {
                    // First close any active period if it exists
                    if (customer.account?.savingPeriod?.status === 'ACTIVE') {
                        const closeResponse = await fetch(
                            `/api/saving-periods/${customer.account.savingPeriod.id}/close`,
                            { 
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    startYear: formData.startYear,
                                    startQuarter: formData.startQuarter,
                                    createNewPeriod: true
                                })
                            }
                        );
                        
                        if (!closeResponse.ok) {
                            throw new Error(`Nepodařilo se uzavřít stávající šetřící období pro zákazníka ${customer.fullName}`);
                        }
                    } else {
                        // If no active period exists, create a new one directly
                        const createResponse = await fetch(
                            `/api/customers/${customer.id}/saving-periods/create`,
                            { 
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    startYear: formData.startYear,
                                    startQuarter: formData.startQuarter
                                })
                            }
                        );

                        if (!createResponse.ok) {
                            throw new Error(`Nepodařilo se vytvořit nové šetřící období pro zákazníka ${customer.fullName}`);
                        }
                    }

                    return customer;
                })
            );

            // Count successes and failures
            const succeeded = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;

            // Update the loading toast with the result
            if (failed === 0) {
                toast.update(loadingToastId, {
                    render: `Úspěšně vytvořeno ${succeeded} nových šetřících období`,
                    type: 'success',
                    isLoading: false,
                    autoClose: 5000
                });
            } else {
                toast.update(loadingToastId, {
                    render: `Vytvořeno ${succeeded} období, ${failed} se nezdařilo`,
                    type: 'warning',
                    isLoading: false,
                    autoClose: 5000
                });

                // Show detailed errors
                results
                    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
                    .forEach(result => {
                        toast.error(result.reason.message);
                    });
            }

            // Refresh the page to show updated data
            router.refresh();
        } catch (error) {
            console.error('Error creating fresh saving periods:', error);
            toast.update(loadingToastId, {
                render: 'Nepodařilo se vytvořit nová šetřící období. Zkuste to prosím znovu.',
                type: 'error',
                isLoading: false,
                autoClose: 5000
            });
        } finally {
            handleRefetchAndResetSelection();
        }
    }, [formData.startQuarter, formData.startYear, router, selectedRows, handleRefetchAndResetSelection]);

    // Memoize bulk actions
    const bulkActions = React.useMemo(() => [
        {
            label: 'Ukončit šetřící období',
            onClick: handleCloseSavingPeriods
        },
        {
            label: 'Nastavit nové šetřící období',
            onClick: handleCreateFreshSavingPeriods
        }
    ], [handleCloseSavingPeriods, handleCreateFreshSavingPeriods]);

    // Render Chip
    const ChipComponent = ({ value }: { value: any }) => {
        if (value > 2500) {
            return (
                <div className="flex items-center">
                    <Chip value={value} className="text-center bg-royal-gold text-gray-900" />
                </div>
            );
        } else if (value > 1200) {
            return (
                <div className="flex items-center">
                    <Chip value={value} className="text-center bg-chrome-silver text-gray-900" />
                </div>
            );
        } else {
            return value;
        }
    };

    // Column definitions
    const columns = React.useMemo<ColumnDef<Customer>[]>(
        () => [
            {
                accessorKey: "active",
                header: "Status",
                filterFn: "auto",
                accessorFn: (row: Customer) => {
                    return row.active;
                },
                cell: ({ getValue }) => <StatusIcon active={getValue() as boolean} />,
            },
            {
                accessorKey: "registrationNumber",
                header: "R.Č.",
                filterFn: "auto",
            },
            {
                accessorKey: "fullName",
                header: "Jméno",
                filterFn: "auto",
                cell: ({ row }) => (
                    <Link href={`/customers/${row.original.id}/stats`} className="text-blue-600 hover:text-blue-800 hover:underline">
                        {row.original.fullName}
                    </Link>
                ),
            },
            {
                accessorKey: "salonName",
                header: "Salón",
            },
            {
                accessorKey: "address",
                header: "Adresa",
            },
            {
                accessorKey: "town",
                header: "Město",
            },
            {
                accessorKey: "psc",
                header: "PSČ",
            },
            {
                accessorKey: "phone",
                header: "Telefon",
            },
            {
                accessorKey: "ico",
                header: "IČ",
            },
            {
                accessorKey: "salesManager.fullName",
                header: "OZ",
                filterFn: "includesString",
                accessorFn: (row: Customer) => {
                    return row.salesManager?.fullName ?? '';
                }
            },
            {
                accessorKey: "dealer.fullName",
                header: "Velkoobchod",
                filterFn: "includesString",
            },
            // {
            //     accessorKey: "account.lifetimePoints",
            //     header: "Klubové konto",
            //     cell: (info) => <ChipComponent value={info.getValue()} />,
            //     footer: (info) => {
            //         const total = info.table
            //             .getFilteredRowModel()
            //             .rows.reduce(
            //                 (sum, row) => {
            //                     // Safely access the nested value
            //                     const points = row.original.account?.lifetimePoints ?? 0;
            //                     return sum + points;
            //                 },
            //                 0
            //             );
            //         return `${formatThousandDelimiter(total)}`;
            //     },
            // },
            {
                accessorKey: "account.savingPeriod.availablePoints",
                header: "Body v šetřícím období",
                cell: (info) => <ChipComponent value={info.getValue()} />,
                footer: (info) => {
                    const total = info.table
                        .getFilteredRowModel()
                        .rows.reduce(
                            (sum, row) => {
                                // Safely access the nested value
                                const points = row.original.account?.lifetimePoints ?? 0;
                                return sum + points;
                            },
                            0
                        );
                    return `${formatThousandDelimiter(total)}`;
                },
            },
            // {
            //     accessorKey: "account.id",
            //     header: "ID Účtu",
            //     accessorFn: (row) => { return row.account?.id.toString() }
            // },
            // {
            //     accessorKey: "account.active",
            //     header: "Status účtu",
            //     accessorFn: (row) => {
            //         return row.account?.active ?? false;
            //     },
            //     cell: ({ getValue }) => <StatusChip status={getValue()} />,
            //     filterFn: (row, columnId, filterValue) => {
            //         const cellValue = row.getValue(columnId);
            //         const boolFilterValue = filterValue === "true";
            //         return filterValue === "" || cellValue === boolFilterValue;
            //     },
            // },
            {
                accessorKey: "account.savingPeriod.status",
                header: "Šetřící období",
                accessorFn: (row: Customer) => {
                    return row.account?.savingPeriod?.status === 'ACTIVE';
                },
                cell: ({ getValue }) => <StatusIcon active={getValue() as boolean} />,
                filterFn: (row, columnId, filterValue) => {
                    const cellValue = row.getValue(columnId);
                    const boolFilterValue = filterValue === "true";
                    return filterValue === "" || cellValue === boolFilterValue;
                },
            },
            {
                accessorKey: "account.savingPeriod.startYear",
                header: "od Rok",
                accessorFn: (row) => {
                    return row.account?.savingPeriod?.startYear?.toString() ?? '';
                },
                filterFn: "auto"
            },
            {
                accessorKey: "account.savingPeriod.startQuarter",
                header: "od Q",
                accessorFn: (row) => {
                    return row.account?.savingPeriod?.startQuarter?.toString() ?? '';
                },
                filterFn: "auto"
            },
            {
                accessorKey: "account.savingPeriod.endYear",
                header: "do Rok",
                accessorFn: (row) => {
                    return row.account?.savingPeriod?.endYear?.toString() ?? '';
                },
                filterFn: "auto"
            },
            {
                accessorKey: "account.savingPeriod.endQuarter",
                header: "do Q",
                accessorFn: (row) => {
                    return row.account?.savingPeriod?.endQuarter?.toString() ?? '';
                },
                filterFn: "auto"
            },
            {
                accessorKey: "account.savingPeriod.endDateTime",
                header: "Datum konce šetřícího období",
                cell: ({ getValue }) => {
                    const endDate = getValue() as string;
                    if (!endDate) return "";
                    const date = new Date(endDate)
                    return `${date.toLocaleDateString('cs-CZ', { timeZone: 'UTC' })}`;
                }
            },
            {
                accessorKey: "account.savingPeriod.daysLeft",
                header: "Zbývá dní",

            },
            {
                accessorKey: "account.savingPeriod.endThisQuarter",
                header: "Končí tento Q",
                accessorFn: (row) => {
                    return row.account?.savingPeriod?.endThisQuarter ?? false;
                },
                cell: ({ getValue }) => getValue() ? <FontAwesomeIcon icon={faExclamation} style={{ color: "#e61414", scale: 1.4 }} /> : "-",
                filterFn: (row, columnId, filterValue) => {
                    const cellValue = row.getValue(columnId);
                    const boolFilterValue = filterValue === "true";
                    return filterValue === "" || cellValue === boolFilterValue;
                },
            },
            // {
            //     accessorKey: "action",
            //     header: "",
            //     cell: ({ row }) => (
            //         <ActionButtons
            //             id={row.original.id}
            //             detailLinkPath={detailLinkPath}
            //         />
            //     ),
            //     enableColumnFilter: false,
            //     enableSorting: false,
            // },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <>
            <MyTable<Customer>
                {...{
                    data,
                    columns,
                    tableName,
                    addBtn: true,
                    onAddClick: () => {
                        router.push(`${detailLinkPath}/new`);
                    },
                    enableRowSelection: true,
                    onSelectionChange: handleSelectionChange,
                    bulkActions
                }}
            />

            <Dialog open={isFormOpen} handler={() => setIsFormOpen(false)}>
                <DialogHeader>Nastavit nové šetřící období</DialogHeader>
                <DialogBody>
                    <div className="flex flex-col gap-4">
                        <Input
                            type="number"
                            label="Rok"
                            value={formData.startYear}
                            onChange={(e) => setFormData(prev => ({ ...prev, startYear: parseInt(e.target.value) }))}
                            crossOrigin={undefined}
                        />
                        <Select
                            label="Kvartál"
                            value={formData.startQuarter.toString()}
                            onChange={(value) => setFormData(prev => ({ ...prev, startQuarter: parseInt(value || "1") }))}
                        >
                            <Option value="1">Q1</Option>
                            <Option value="2">Q2</Option>
                            <Option value="3">Q3</Option>
                            <Option value="4">Q4</Option>
                        </Select>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={() => setIsFormOpen(false)} className="mr-1">
                        Zrušit
                    </Button>
                    <Button variant="gradient" color="green" onClick={handleFormSubmit}>
                        Potvrdit
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
