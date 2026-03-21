import { describe, expect, it } from "vitest";

import { CreateBrandUseCase } from "./CreateBrandUseCase";
import { DeleteBrandUseCase } from "./DeleteBrandUseCase";
import { FindAllBrandsUseCase } from "./FindAllBrandsUseCase";
import { FindBrandByIdUseCase } from "./FindBrandByIdUseCase";
import { UpdateBrandUseCase } from "./UpdateBrandUseCase";
import type { Brand } from "../../../core/entities/Brand";
import type { IBrandRepository } from "../../../core/repositories/IBrandRepository";

class InMemoryBrandRepository implements IBrandRepository {
  constructor(private readonly brands: Brand[]) {}

  async findAll(): Promise<Brand[]> {
    return this.brands;
  }

  async findById(id: number): Promise<Brand | null> {
    return this.brands.find((brand) => brand.id === id) ?? null;
  }

  async create(name: string): Promise<Brand> {
    const nextId =
      this.brands.length === 0
        ? 1
        : Math.max(...this.brands.map((brand) => brand.id)) + 1;

    const brand = {
      id: nextId,
      nombre: name,
    };

    this.brands.push(brand);

    return brand;
  }

  async update(id: number, name: string): Promise<Brand | null> {
    const currentBrand = this.brands.find((brand) => brand.id === id);

    if (!currentBrand) {
      return null;
    }

    currentBrand.nombre = name;
    return currentBrand;
  }

  async delete(id: number): Promise<boolean> {
    const index = this.brands.findIndex((brand) => brand.id === id);

    if (index === -1) {
      return false;
    }

    this.brands.splice(index, 1);
    return true;
  }
}

describe("Brand use cases", () => {
  it("lists brands", async () => {
    const repository = new InMemoryBrandRepository([
      { id: 1, nombre: "Toyota" },
      { id: 2, nombre: "Ford" },
    ]);
    const useCase = new FindAllBrandsUseCase(repository);

    const brands = await useCase.execute();

    expect(brands).toHaveLength(2);
    expect(brands[0]?.nombre).toBe("Toyota");
  });

  it("gets a brand by id", async () => {
    const repository = new InMemoryBrandRepository([
      { id: 1, nombre: "Toyota" },
    ]);
    const useCase = new FindBrandByIdUseCase(repository);

    const brand = await useCase.execute(1);

    expect(brand?.nombre).toBe("Toyota");
  });

  it("creates a new brand", async () => {
    const repository = new InMemoryBrandRepository([]);
    const useCase = new CreateBrandUseCase(repository);

    const created = await useCase.execute("Honda");

    expect(created.id).toBe(1);
    expect(created.nombre).toBe("Honda");
  });

  it("updates an existing brand", async () => {
    const repository = new InMemoryBrandRepository([
      { id: 1, nombre: "Toyoda" },
    ]);
    const useCase = new UpdateBrandUseCase(repository);

    const updated = await useCase.execute(1, "Toyota");

    expect(updated?.nombre).toBe("Toyota");
  });

  it("deletes an existing brand", async () => {
    const repository = new InMemoryBrandRepository([
      { id: 1, nombre: "Toyota" },
    ]);
    const useCase = new DeleteBrandUseCase(repository);

    const deleted = await useCase.execute(1);

    expect(deleted).toBe(true);
    expect(await repository.findAll()).toHaveLength(0);
  });
});