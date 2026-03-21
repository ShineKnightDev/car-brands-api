import type { Brand } from "@/core/entities/Brand";
import type { IBrandRepository } from "@/core/repositories/IBrandRepository";

export class CreateBrandUseCase {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async execute(name: string): Promise<Brand> {
    return this.brandRepository.create(name);
  }
}