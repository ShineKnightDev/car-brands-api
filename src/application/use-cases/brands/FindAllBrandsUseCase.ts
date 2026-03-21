import type { Brand } from "@/core/entities/Brand";
import type { IBrandRepository } from "@/core/repositories/IBrandRepository";

export class FindAllBrandsUseCase {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async execute(): Promise<Brand[]> {
    return this.brandRepository.findAll();
  }
}