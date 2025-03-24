import { AccountRepository } from "@/lib/repositories/AccountRepository";
import { Account } from "@/types/types";
import { AccountResponseDTO } from "./types";
import { UpdateAccountDTO } from "./validation";

export class AccountAPI {
    constructor(private accountRepository: AccountRepository) { }

    async getAccount(id: number): Promise<Account> {
        return this.accountRepository.findById(id) as unknown as Account;
    }

    async updateAccount(id: number, data: UpdateAccountDTO): Promise<Account> {
        const updated = await this.accountRepository.update(id, {
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
        return updated as unknown as Account;
    }

    async getAllActiveAccounts(): Promise<Account[]> {
        const accounts = await this.accountRepository.getAllActiveAccounts();

        // Change registrationNumber to string
        const formattedAccounts = accounts.map((account: AccountResponseDTO) => ({
            ...account,
            'customer.registrationNumber': account.customer.registrationNumber.toString()
        }));

        // Cast to Account[] to ensure compatibility with the expected type
        return formattedAccounts as unknown as Account[];
    }
}