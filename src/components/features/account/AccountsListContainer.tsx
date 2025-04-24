'use client'
import Skeleton from "@/components/ui/skeleton";
import AccountsTable from "./AccountTable";
import { useAccounts } from "@/lib/queries/account/queries";
import { Suspense } from "react";

export default function AccountsListContainer() {
    const { data: accounts, isLoading } = useAccounts()

    if (isLoading) return <Skeleton type="table" />

    return (
        <div>
            <Suspense fallback={<Skeleton type="table" />}>
                <AccountsTable accounts={accounts} />
            </Suspense>
        </div>
    )
}