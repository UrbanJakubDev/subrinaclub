import { customerService } from "./customer"
import { transactionService } from "./transaction"

interface SyncData {
    [key: string]: {
        transakce: string
        detail: string
        bodu: number
        rbodu: number
    }
}

export class SyncService {
    private readonly REMOTE_SERVER_URL = 'https://www.subrinaprofessional.cz/subrinaclub/sync.php'

    async syncUsers() {
        try {
            // Get all active customers with their accounts
            const customers = await customerService.getCustomersWithAccountAndActiveSavingPeriod()

            const syncData: SyncData = {}

            for (const customer of customers) {
                if (!customer.registrationNumber) continue

                // Get transactions for customer account
                const transactions = await transactionService.getByAccountId(customer.account?.id)

                // Format transaction data
                const transactionString =
                    transactions
                        .map(
                            t =>
                                `${t.quarter}*${t.year}*${t.points}*${t.bonusPrice}*${t.sentBonusOrder?.toISOString()}*${t.bonus || ''}`,
                        )
                        .join(';') || ''

                // Format user details
                const userDetails = [
                    customer.registrationNumber,
                    customer.fullName,
                    customer.account?.passwordHash || '',
                    customer.salonName?.replace(/&/g, 'a') || '',
                    customer.address || '',
                    customer.town || '',
                    customer.psc || '',
                    customer.phone || '',
                    new Date().toISOString(),
                    new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString(),
                    customer.dealer?.fullName || '',
                    customer.registratedSince?.toISOString() || '',
                    customer.email || '',
                    customer.ico || '',
                ].join(';')

                // Prepare sync data
                syncData[customer.registrationNumber] = {
                    transakce: transactionString,
                    detail: userDetails,
                    bodu: customer.account?.currentYearPoints || 0,
                    rbodu: customer.account?.lifetimePoints || 0,
                }
            }

            // Send data to remote server
            await this.sendToRemoteServer(syncData)

            return { success: true, message: 'Sync completed successfully' }
        } catch (error) {
            console.error('Sync failed:', error)
            throw error
        }
    }

    private async sendToRemoteServer(data: SyncData) {
        const jsonData = JSON.stringify(data)
        const encodedData = Buffer.from(jsonData).toString('base64')

        const response = await fetch(this.REMOTE_SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `data=${encodeURIComponent(encodedData)}`,
        })

        if (!response.ok) {
            throw new Error(`Remote server responded with status: ${response.status}`)
        }

        return response.text()
    }
}
