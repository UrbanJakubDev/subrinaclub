import { BonusRepository } from "@/lib/repositories/BonusRepository";
import { SelectOption } from "@/types/types";
import { Bonus, Prisma } from "@prisma/client";

export class BonusService {
   constructor(private repository: BonusRepository) {}
   
   async create(data: Prisma.BonusCreateInput): Promise<Bonus> {
      return this.repository.create(data);
   }
   
   async update(id: number, data: Prisma.BonusUpdateInput): Promise<Bonus> {
      return this.repository.update(id, data);
   }
   
   async delete(id: number): Promise<Bonus> {
      return this.repository.delete(id);
   }
   
   async get(id: number): Promise<Bonus> {
      return this.repository.findById(id);
   }
   
   async getAll(): Promise<Bonus[]> {
      return this.repository.findAll();
   }

   async getBonusesForSelect(): Promise<SelectOption[]> {
      const bonuses = await this.repository.findAll();

      return bonuses.map(bonus => ({
         value: bonus.id,
         label: bonus.name,
      }));
   }
}