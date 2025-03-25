import cron from 'node-cron'
import { SyncService } from './syncService'

interface CronStatus {
    isRunning: boolean
    nextRun: Date | null
    lastRun: Date | null
}

export class CronService {
    private syncService: SyncService
    private cronJob: cron.ScheduledTask | null = null
    private lastRun: Date | null = null
    private cronExpression: string = '0 1 * * *'

    constructor() {
        this.syncService = new SyncService()
    }

    async startSyncJob(cronExpression: string = '0 1 * * *') {
        // Stop existing job if any
        this.stopSyncJob()

        // Store the cron expression
        this.cronExpression = cronExpression

        // Start new cron job
        this.cronJob = cron.schedule(cronExpression, async () => {
            try {
                console.log('Starting scheduled sync...')
                const result = await this.syncService.syncUsers()
                this.lastRun = new Date()
                console.log('Scheduled sync completed:', result.message)
            } catch (error) {
                console.error('Scheduled sync failed:', error)
            }
        })

        console.log(`Sync job scheduled with cron expression: ${cronExpression}`)
    }

    stopSyncJob() {
        if (this.cronJob) {
            this.cronJob.stop()
            this.cronJob = null
        }
    }

    // Helper method to run sync immediately
    async runSyncNow() {
        try {
            console.log('Starting immediate sync...')
            const result = await this.syncService.syncUsers()
            this.lastRun = new Date()
            console.log('Immediate sync completed:', result.message)
            return result
        } catch (error) {
            console.error('Immediate sync failed:', error)
            throw error
        }
    }

    async getStatus(): Promise<CronStatus> {
        const isRunning = this.cronJob !== null
        let nextRun: Date | null = null

        if (isRunning && this.cronJob) {
            // Get the next scheduled run time
            const schedule = this.cronJob.nextDate()
            if (schedule) {
                nextRun = schedule.toDate()
            }
        }

        return {
            isRunning,
            nextRun,
            lastRun: this.lastRun,
        }
    }

    getCronExpression(): string {
        return this.cronExpression
    }
}
