'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { CronService } from '@/lib/services/cronService'
import { Button, Card } from '@material-tailwind/react'
import SwitchField from '../ui/inputs/inputSwitcher'

export function CronMonitor() {
    const [isRunning, setIsRunning] = useState(false)
    const [nextRun, setNextRun] = useState<Date | null>(null)
    const [lastRun, setLastRun] = useState<Date | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const cronService = new CronService()

    useEffect(() => {
        // Check if cron is running
        const checkStatus = async () => {
            try {
                // You might want to add a method to CronService to check status
                const status = await cronService.getStatus()
                setIsRunning(status.isRunning)
                setNextRun(status.nextRun)
                setLastRun(status.lastRun)
            } catch (error) {
                console.error('Failed to get cron status:', error)
            }
        }

        checkStatus()
        // Check status every minute
        const interval = setInterval(checkStatus, 60000)
        return () => clearInterval(interval)
    }, [])

    const handleToggle = async () => {
        setIsLoading(true)
        try {
            if (isRunning) {
                await cronService.stopSyncJob()
            } else {
                await cronService.startSyncJob()
            }
            setIsRunning(!isRunning)
        } catch (error) {
            console.error('Failed to toggle cron:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRunNow = async () => {
        setIsLoading(true)
        try {
            await cronService.runSyncNow()
            setLastRun(new Date())
        } catch (error) {
            console.error('Failed to run sync now:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cron Status</span>
                    <SwitchField
                        label="Cron Status"
                        name="cronStatus"
                        defaultValue={isRunning}
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Next Run:</span>
                        <span className="font-medium">
                            {nextRun ? format(nextRun, 'PPpp') : 'Not scheduled'}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Run:</span>
                        <span className="font-medium">
                            {lastRun ? format(lastRun, 'PPpp') : 'Never'}
                        </span>
                    </div>
                </div>

                <Button onClick={handleRunNow} disabled={isLoading} className="w-full">
                    Run Sync Now
                </Button>
            </div>
        </Card>
    )
}
