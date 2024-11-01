import { CustomerRepository } from "@/lib/repositories/CustomerRepository";
import { CreateCustomerDTO, UpdateCustomerDTO } from "./validation";
import { Customer } from "@/types/customer";
import { CustomerResponseDTO, CustomerSelectDTO, CustomerWithAccountDataAndActiveSavingPeriodDTO } from "./types";

export class CustomerService {
   constructor(private customerRepository: CustomerRepository) { }

   async create(data: CreateCustomerDTO): Promise<Customer> {
      const maxRegNumber = await this.customerRepository.getMaxRegistrationNumber();

      const { relations, cleanData } = this.processInputData(data);

      return this.customerRepository.create({
         data: {
            ...cleanData,
            registrationNumber: maxRegNumber + 1,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            publicId: 'C' + (maxRegNumber + 1).toString().padStart(4, '0'),
            ...relations
         },
         include: {
            dealer: true,
            salesManager: true
         }
      });
   }

   async update(id: number, data: UpdateCustomerDTO): Promise<Customer> {
      await this.get(id);

      const { relations, cleanData } = this.processInputData(data);

      return this.customerRepository.update({
         where: { id },
         data: {
            ...cleanData,
            ...relations,
            updatedAt: new Date()
         },
         include: {
            dealer: true,
            salesManager: true
         }
      });
   }

   private processInputData(data: CreateCustomerDTO | UpdateCustomerDTO) {
      const {
         dealerId,
         salesManagerId,
         id: _id,
         publicId: _publicId,
         createdAt: _createdAt,
         updatedAt: _updatedAt,
         account: _account,
         ...cleanData
      } = data as any;

      const relations = {
         ...(dealerId !== undefined && {
            dealer: dealerId === null
               ? { disconnect: true }
               : { connect: { id: dealerId } }
         }),
         ...(salesManagerId !== undefined && {
            salesManager: salesManagerId === null
               ? { disconnect: true }
               : { connect: { id: salesManagerId } }
         })
      };

      return { relations, cleanData };
   }

   async delete(id: number): Promise<Customer> {
      // Optional: Validate customer exists
      await this.get(id);
      return this.customerRepository.delete(id);
   }

   async get(id: number): Promise<CustomerResponseDTO> {
      const customer = await this.customerRepository.findById(id, {
         dealer: true,
         salesManager: true,
         account: true
      });

      if (!customer) {
         throw new Error(`Customer with id ${id} not found`);
      }

      return customer;
   }

   async getAll(): Promise<CustomerResponseDTO[]> {
      return this.customerRepository.findAll({
         include: {
            dealer: true,
            salesManager: true
         }
      });
   }

   async getCustomersForSelect(): Promise<CustomerSelectDTO[]> {
      const customers = await this.customerRepository.findAll();

      return customers.map(customer => ({
         value: customer.id,
         label: customer.fullName,
      }));
   }

   async findCustomerByIco(ico: string): Promise<Customer> {
      return this.customerRepository.findByIco(ico);
   }

   async getAccountDataWithActiveSavingPeriod(id: Number): Promise<CustomerWithAccountDataAndActiveSavingPeriodDTO[]> {

      const result = await this.customerRepository.getAccountDataWithActiveSavingPeriod(id);

      // Flatten the account.savingPeriods array to a single saving period
      if (result?.account?.savingPeriods?.length) {
         result.account.savingPeriod = result.account.savingPeriods[0];
         delete result.account.savingPeriods;
      }


      return result;
   }

  
}