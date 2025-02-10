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
    savingPeriodAvailablePoints: number;
  };
}

type Props = {
  defaultData: Customer[];
  detailLinkPath?: string;
};

export default function CustomerTable({ defaultData, detailLinkPath }: Props) {

  const router = useRouter()
  const tableName = "Přehled zákazníků";

  // Handle selected rows
  const handleSelectionChange = (selectedRows: Customer[]) => {
    console.log('Selected rows:', selectedRows);
  };

  const handleDeactivateCustomers = async (selectedRows: Customer[]) => {
    // Filter out already inactive customers
    const activeCustomers = selectedRows.filter(customer => customer.active);

    if (activeCustomers.length === 0) {
      toast.error('Žádný z vybraných zákazníků není aktivní.');
      return;
    }

    const confirmDeactivate = window.confirm(
      `Opravdu chcete deaktivovat ${activeCustomers.length} zákazníků?`
    );
    if (!confirmDeactivate) return;

    // Show loading toast
    const loadingToastId = toast.loading(
      `Deaktivace ${activeCustomers.length} zákazníků...`
    );

    try {
      const results = await Promise.allSettled(
        activeCustomers.map(async (customer) => {
          const response = await fetch(`/api/customers/${customer.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              active: false
            }),
          });

          if (!response.ok) {
            throw new Error(`Nepodařilo se deaktivovat zákazníka ${customer.fullName}`);
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
          render: `Úspěšně deaktivováno ${succeeded} zákazníků`,
          type: 'success',
          isLoading: false,
          autoClose: 5000
        });
      } else {
        toast.update(loadingToastId, {
          render: `Deaktivováno ${succeeded} zákazníků, ${failed} se nezdařilo`,
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
      console.error('Error deactivating customers:', error);
      toast.update(loadingToastId, {
        render: 'Nepodařilo se deaktivovat zákazníky. Zkuste to prosím znovu.',
        type: 'error',
        isLoading: false,
        autoClose: 5000
      });
    }
  };

  // Define bulk actions
  const bulkActions = [
    {
      label: 'Deaktivovat vybrané',
      onClick: handleDeactivateCustomers
    }
  ];

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
        header: "Sales Manager",
        filterFn: "includesString"
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
        accessorKey: "account.lifetimePoints",
        header: "Klubové konto",
        cell: (info) => <ChipComponent value={info.getValue()} />,
        footer: (info) => {
          const total = info.table
            .getFilteredRowModel()
            .rows.reduce(
              (sum, row) => {
                const points = row.original.account?.lifetimePoints ?? 0;
                return sum + points;
              },
              0
            );
          return `${formatThousandDelimiter(total)}`;
        },
      },
      {
        accessorFn: (row) => row.account?.savingPeriodAvailablePoints ?? 0,
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
        filterFn: (row, columnId, filterValue) => {
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
            hasStats
          />
        ),
        enableColumnFilter: false,
        enableSorting: false,
      },
    ],
    []
  );


  const [data, _setData] = React.useState(() => [...defaultData]);

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
