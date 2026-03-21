import type { IBrandRepository } from "@/core/repositories/IBrandRepository";

export class DeleteBrandUseCase {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async execute(id: number): Promise<boolean> {
    return this.brandRepository.delete(id);
  }
}