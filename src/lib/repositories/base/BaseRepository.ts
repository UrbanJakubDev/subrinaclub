// BaseRepository.ts
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@/lib/errors';
import { BaseRepositoryInput } from '@/types/repository';

export abstract class BaseRepository<
  T,
  CreateInput,
  UpdateInput
> {
  constructor(
    protected prisma: PrismaClient,
    protected readonly modelName: string
  ) {}

  async findById(id: number, include?: Record<string, boolean>): Promise<T> {
    const item = await (this.prisma[this.modelName] as any).findUnique({
      where: { id: id},
      include: include // Pass include directly, not wrapped in another object
    });
    if (!item) throw new NotFoundError(`${this.modelName} not found`);
    return item;
  }

  async findAll(options?: { 
    where?: any; 
    include?: Record<string, boolean>
  }): Promise<T[]> {
    return (this.prisma[this.modelName] as any).findMany({
      where: { active: true, ...options?.where },
      include: options?.include // Pass include directly
    });
  }

  async create(input: any): Promise<T> {
    return (this.prisma[this.modelName] as any).create({
      data: input.data,
      include: input.include
    });
  }

  async update(id: number, input: BaseRepositoryInput): Promise<T> {
    return (this.prisma[this.modelName] as any).update({
      where: input.where,
      data: input.data,
      include: input.include
    });
  }

  // Soft delete
  async delete(id: number): Promise<T> {
    return (this.prisma[this.modelName] as any).update({
      where: { id },
      data: { active: false }
    });
  }

  // Hard delete
  async hardDelete(id: number): Promise<T> {
    return (this.prisma[this.modelName] as any).delete({ where: { id } });
  }
}
