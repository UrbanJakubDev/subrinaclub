import { Dealer } from "@/types/dealer";
import { DealerRepository } from "@/lib/repositories/DealerRepository";
import { CreateDealerDTO, UpdateDealerDTO } from "./validation";
import { DealerResponseDTO, DealerSelectDTO } from "./types";

export class DealerService {
    constructor(private dealerRepository: DealerRepository) { }

    async create(data: CreateDealerDTO): Promise<DealerResponseDTO> {
        // Business logic here
        const maxRegNumber = await this.dealerRepository.getMaxRegistrationNumber();

        return this.dealerRepository.create({
            data: {
                ...data,
                registrationNumber: maxRegNumber + 1,
                active: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
    }

    async update(id: number, data: UpdateDealerDTO): Promise<Dealer> {
        // Optional: Validate dealer exists
        await this.get(id);

        return this.dealerRepository.update(id, {
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
    }

    async delete(id: number): Promise<Dealer> {
        // Optional: Validate dealer exists
        await this.get(id);

        return this.dealerRepository.delete(id);
    }

    async get(id: number): Promise<Dealer> {
        return this.dealerRepository.findById(id);
    }

    async getAll(): Promise<Dealer[]> {
        return this.dealerRepository.findAll();
    }


    async getDealersForSelect(): Promise<DealerSelectDTO[]> {
        const dealers = await this.dealerRepository.findAll();

        return dealers.map(dealer => ({
            value: dealer.id,
            label: dealer.fullName,
        }));
    }


}