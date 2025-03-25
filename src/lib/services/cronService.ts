import cron from 'node-cron'
import { SyncService } from './syncService'

export class CronService {
    private syncService: SyncService
    private cronJob: cron.ScheduledTask | null = null

    constructor() {
        this.syncService = new SyncService()
    }

    startSyncJob(cronExpression: string = '0 1 * * *') {
        // Stop existing job if any
        this.stopSyncJob()

        // Start new cron job
        this.cronJob = cron.schedule(cronExpression, async () => {
            try {
                console.log('Starting scheduled sync...')
                const result = await this.syncService.syncUsers()
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
            console.log('Immediate sync completed:', result.message)
            return result
        } catch (error) {
            console.error('Immediate sync failed:', error)
            throw error
        }
    }
}
