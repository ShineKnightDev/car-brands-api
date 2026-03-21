import type { Brand as PrismaBrand } from "@prisma/client";

import type { Brand } from "@/core/entities/Brand";
import type { IBrandRepository } from "@/core/repositories/IBrandRepository";
import { prisma } from "@/infrastructure/db/client";

export class PrismaBrandRepository implements IBrandRepository {
  private toDomain(brand: PrismaBrand): Brand {
    return {
      id: brand.id,
      nombre: brand.name,
    };
  }

  async findAll(): Promise<Brand[]> {
    const brands = await prisma.brand.findMany({
      orderBy: { id: "asc" },
    });

    return brands.map((brand) => this.toDomain(brand));
  }

  async findById(id: number): Promise<Brand | null> {
    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    return brand ? this.toDomain(brand) : null;
  }

  async create(name: string): Promise<Brand> {
    const brand = await prisma.brand.create({
      data: { name },
    });

    return this.toDomain(brand);
  }

  async update(id: number, name: string): Promise<Brand | null> {
    const existingBrand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      return null;
    }

    const updatedBrand = await prisma.brand.update({
      where: { id },
      data: { name },
    });

    return this.toDomain(updatedBrand);
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await prisma.brand.deleteMany({
      where: { id },
    });

    return deleted.count > 0;
  }
}