import type { Brand } from "@/core/entities/Brand";
import type { IBrandRepository } from "@/core/repositories/IBrandRepository";

export class UpdateBrandUseCase {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async execute(id: number, name: string): Promise<Brand | null> {
    return this.brandRepository.update(id, name);
  }
}