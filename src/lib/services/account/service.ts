import { AccountRepository } from "@/lib/repositories/AccountRepository";
import { Account } from "@prisma/client";
import { CreateAccountDTO, UpdateAccountDTO } from "./validation";
import { AccountResponseDTO } from "./types";

export class AccountService {
   constructor(private accountRepository: AccountRepository) { }

   async create(data: CreateAccountDTO): Promise<Account> {
      return this.accountRepository.create({
         data: {
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
         }
      });
   }

   async update(id: number, data: UpdateAccountDTO): Promise<Account> {
      await this.get(id);

      return this.accountRepository.update(id, {
         data: {
            ...data,
            updatedAt: new Date()
         }
      });
   }

   async get(id: number): Promise<AccountResponseDTO> {
      return this.accountRepository.findById(id);
   }

   async getAll(): Promise<Account[]> {
      return this.accountRepository.findAll();
   }

   async delete(id: number): Promise<Account> {
      return this.accountRepository.delete(id);
   }
}