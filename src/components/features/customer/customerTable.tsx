"use client";;
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import MyTable from "../../tables/ui/baseTable";
import { Chip } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import formatThousandDelimiter from "@/lib/utils/formatFncs";
import ActionButtons from "@/components/tables/ui/actionButtons";
import StatusChip from "@/components/tables/ui/statusChip";
import StatusIcon from "@/components/tables/ui/statusIcon";
import { toast } from "react-toastify";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

interface Customer {
  id: string;
  active: boolean;
  registrationNumber: string;
  fullName: string;
  salonName: string;
  address?: string;
  town?: string;
  psc?: string;
  phone?: string;
  ico?: string;
  salesManager?: {
    fullName: string;
  };
  dealer?: {
    fullName: string;
  };
  account?: {
    currentYearPoints: number;
    lifetimePoints: number;
    lifetimePointsCorrection: number;
    lifetimePointsCorrected: number;
    savingPeriodAvailablePoints: number;
  };
}

type Props = {
  defaultData: Customer[];
  detailLinkPath?: string;
  activeUsers?: boolean;
};

export default function CustomerTable({ defaultData, detailLinkPath, activeUsers }: Props) {

  const router = useRouter()
  const queryClient = useQueryClient();
  const tableName = "Přehled zákazníků";

  // Handle selected rows
  const handleSelectionChange = (selectedRows: Customer[]) => {
  };

  const handleToggleCustomersStatus = async (selectedRows: Customer[], targetStatus: boolean) => {
    // Filter customers that need status change
    const customersToUpdate = selectedRows.filter(customer => customer.active !== targetStatus);

    if (customersToUpdate.length === 0) {
      const statusText = targetStatus ? 'neaktivní' : 'aktivní';
      toast.error(`Žádný z vybraných zákazníků není ${statusText}.`);
      return;
    }

    const actionText = targetStatus ? 'aktivovat' : 'deaktivovat';
    const actionTextPast = targetStatus ? 'aktivováno' : 'deaktivováno';
    const actionTextGerund = targetStatus ? 'Aktivace' : 'Deaktivace';

    const confirmAction = window.confirm(
      `Opravdu chcete ${actionText} ${customersToUpdate.length} zákazníků?`
    );
    if (!confirmAction) return;

    // Show loading toast
    const loadingToastId = toast.loading(
      `${actionTextGerund} ${customersToUpdate.length} zákazníků...`
    );

    try {
      const results = await Promise.allSettled(
        customersToUpdate.map(async (customer) => {
          const response = await fetch(`/api/customers/${customer.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              active: targetStatus
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error response for ${customer.fullName}:`, errorText);
            throw new Error(`Nepodařilo se ${actionText} zákazníka ${customer.fullName}`);
          }

          return await response.json();
        })
      );

      // Count successes and failures
      const succeeded = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      // Update the loading toast with the result
      if (failed === 0) {
        toast.update(loadingToastId, {
          render: `Úspěšně ${actionTextPast} ${succeeded} zákazníků`,
          type: 'success',
          isLoading: false,
          autoClose: 5000
        });
      } else {
        toast.update(loadingToastId, {
          render: `${actionTextPast.charAt(0).toUpperCase() + actionTextPast.slice(1)} ${succeeded} zákazníků, ${failed} se nezdařilo`,
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

      // Invalidate and refetch the customers query
      if (activeUsers !== undefined) {
        await queryClient.invalidateQueries({ queryKey: ['customers', activeUsers] });
        await queryClient.invalidateQueries({ queryKey: ['customers', !activeUsers] });
        // Reload the page
        window.location.reload();
      }
    } catch (error) {
      console.error(`Error ${actionTextGerund.toLowerCase()} customers:`, error);
      toast.update(loadingToastId, {
        render: `Nepodařilo se ${actionText} zákazníky. Zkuste to prosím znovu.`,
        type: 'error',
        isLoading: false,
        autoClose: 5000
      });
    }

  };

  const handleDeactivateCustomers = async (selectedRows: Customer[]) => {
    await handleToggleCustomersStatus(selectedRows, false);
  };

  const handleActivateCustomers = async (selectedRows: Customer[]) => {
    await handleToggleCustomersStatus(selectedRows, true);
  };

  // Define bulk actions based on activeUsers
  const bulkActions = React.useMemo(() => {
    if (activeUsers === true) {
      return [
        {
          label: 'Deaktivovat vybrané',
          onClick: handleDeactivateCustomers
        }
      ];
    } else if (activeUsers === false) {
      return [
        {
          label: 'Aktivovat vybrané',
          onClick: handleActivateCustomers
        }
      ];
    } else {
      // If activeUsers is undefined, show both actions
      return [
        {
          label: 'Deaktivovat vybrané',
          onClick: handleDeactivateCustomers
        },
        {
          label: 'Aktivovat vybrané',
          onClick: handleActivateCustomers
        }
      ];
    }
  }, [activeUsers]);

  // Render Chip
  const ChipComponent = React.useMemo(() => {
    return ({ value }: { value: any }) => {
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
  }, []);



  // Change the data registrationNumber to a string
  defaultData.forEach((row) => {
    row.registrationNumber = row.registrationNumber.toString();
  });

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
        accessorFn: (row) => row.salesManager?.fullName ?? '',
        header: "Obchodní zástupce",
        filterFn: "includesString",
      },
      {
        accessorKey: "dealer.fullName",
        header: "Velkoobchod",
        filterFn: "includesString"
      },
      {
        accessorKey: "account.currentYearPoints",
        header: "Roční konto",
        cell: (info) => info.getValue(),
        footer: (info) => {
          const total = info.table
            .getFilteredRowModel()
            .rows.reduce(
              (sum, row) => {
                const points = row.original.account?.currentYearPoints ?? 0;
                return sum + points;
              },
              0
            );
          return `${formatThousandDelimiter(total)}`;
        },
      },
      {
        accessorKey: "account.lifetimePointsCorrected",
        header: "Klubové konto",
        cell: (info) => <ChipComponent value={info.getValue()} />,
        footer: (info) => {
          const total = info.table
            .getFilteredRowModel()
            .rows.reduce(
              (sum, row) => {
                const points = row.original.account?.lifetimePointsCorrected ?? 0;
                return sum + points;
              },
              0
            );
          return `${formatThousandDelimiter(total)}`;
        },
      },
      {
        accessorKey: "account.lifetimePointsCorrection",
        header: "Korekce",
      },
      {
        accessorKey: "account.savingPeriodAvailablePoints",
        header: "Průběžné konto",
        footer: (info) => {
          const total = info.table
            .getFilteredRowModel()
            .rows.reduce(
              (sum, row) => {
                const points = row.original.account?.savingPeriodAvailablePoints ?? 0;
                return sum + points;
              },
              0
            );
          return `${formatThousandDelimiter(total)}`;
        },
      },
      {
        accessorKey: "hasCurrentYearPoints",
        header: "Aktivní",
        accessorFn: (row: Customer) => {
          const lifetimePoints = row.account?.currentYearPoints ?? 0;
          return lifetimePoints > 0;
        },
        cell: ({ getValue }) => <StatusChip status={getValue() as boolean} />,
        filterFn: (row: { getValue: (columnId: string) => any }, columnId: string, filterValue: string) => {
          const cellValue = row.getValue(columnId);
          const boolFilterValue = filterValue === "true";
          return filterValue === "" || cellValue === boolFilterValue;
        },
      },
      {
        accessorKey: "action",
        header: "",
        cell: ({ row }) => (
          <ActionButtons
            id={row.original.id}
            detailLinkPath={detailLinkPath}
          />
        ),
        enableColumnFilter: false,
        enableSorting: false,
      },
    ],
    []
  );


  const [data, setData] = React.useState(() => [...defaultData]);

  // Update data when defaultData changes
  React.useEffect(() => {
    setData([...defaultData]);
  }, [defaultData]);

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
          bulkActions: bulkActions
        }}
      />
    </>
  );
}
