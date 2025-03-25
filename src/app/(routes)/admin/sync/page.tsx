import { CronMonitor } from "@/components/admin/CronMonitor";


export default function SyncAdminPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Sync Administration</h1>
            <CronMonitor />
        </div>
    )
}
