import { CronService } from '../src/lib/services/cronService'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function main() {
    try {
        const cronService = new CronService()

        // Start the cron job (runs at 1 AM every day by default)
        cronService.startSyncJob()

        // Keep the process running
        process.on('SIGINT', () => {
            console.log('Stopping cron service...')
            cronService.stopSyncJob()
            process.exit(0)
        })

        console.log('Cron service started. Press Ctrl+C to stop.')
    } catch (error) {
        console.error('Failed to start cron service:', error)
        process.exit(1)
    }
}

main()
