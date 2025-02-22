import { SalesManager } from "@/types/salesmanager";
import { SalesManagerResponseDTO, SalesManagerSelectDTO } from "./types";
import { CreateSalesManagerDTO, UpdateSalesManagerDTO } from "./validation";
import { SalesManagerRepository } from "@/lib/repositories/SalesManagerRepository";

export class SalesManagerService {
   constructor(private SalesManagerRepository: SalesManagerRepository) { }

   async create(data: CreateSalesManagerDTO): Promise<SalesManagerResponseDTO> {
      // Business logic here
      const maxRegNumber = await this.SalesManagerRepository.getMaxRegistrationNumber();

      return this.SalesManagerRepository.create({
         data: {
            ...data,
            registrationNumber: maxRegNumber + 1,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date()
         }
      });
   }

   async update(id: number, data: UpdateSalesManagerDTO): Promise<SalesManager> {
      // Optional: Validate SalesManager exists
      await this.get(id);

      return this.SalesManagerRepository.update(id, {
         data: {
            ...data,
            updatedAt: new Date()
         }
      });
   }

   async delete(id: number): Promise<SalesManager> {
      // Optional: Validate SalesManager exists
      await this.get(id);

      return this.SalesManagerRepository.delete(id);
   }

   async get(id: number): Promise<SalesManager> {
      return this.SalesManagerRepository.findById(id);
   }

   async getAll(): Promise<SalesManagerResponseDTO[]> {
      const salesManagers = await this.SalesManagerRepository.findAll();

      return salesManagers.sort((a, b) => a.fullName.localeCompare(b.fullName));
      
   }

   async getSalesManagersForSelect(): Promise<SalesManagerSelectDTO[]> {
      const salesManagers = await this.SalesManagerRepository.findAll();

      return salesManagers.map(salesManager => ({
         value: salesManager.id,
         label: salesManager.fullName,
      }));
   }

   // Get life time points of customers assigned to sales manager
   async getLifeTimePointsOfCustomers(salesManagerId: number): Promise<number> {
      return this.SalesManagerRepository.getLifeTimePointsOfCustomers(salesManagerId);
   }

   // Get customers with accounts data belonging to the sales manager
   async getCustomersWithAccounts(salesManagerId: number) {
      return this.SalesManagerRepository.getCustomersWithAccounts(salesManagerId);
   }

   // Get customers counts info for a sales manager
   async getCustomersCountsInfo(salesManagerId: number, year: number) {
      return this.SalesManagerRepository.getCustomersCountsInfo(salesManagerId, year);
   }
}
