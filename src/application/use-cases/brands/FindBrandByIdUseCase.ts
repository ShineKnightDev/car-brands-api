import type { Brand } from "@/core/entities/Brand";
import type { IBrandRepository } from "@/core/repositories/IBrandRepository";

export class FindBrandByIdUseCase {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async execute(id: number): Promise<Brand | null> {
    return this.brandRepository.findById(id);
  }
}