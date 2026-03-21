import { CreateBrandUseCase } from "@/application/use-cases/brands/CreateBrandUseCase";
import { DeleteBrandUseCase } from "@/application/use-cases/brands/DeleteBrandUseCase";
import { FindAllBrandsUseCase } from "@/application/use-cases/brands/FindAllBrandsUseCase";
import { FindBrandByIdUseCase } from "@/application/use-cases/brands/FindBrandByIdUseCase";
import { UpdateBrandUseCase } from "@/application/use-cases/brands/UpdateBrandUseCase";
import { PrismaBrandRepository } from "@/infrastructure/repositories/PrismaBrandRepository";

export function makeBrandDependencies() {
  const repository = new PrismaBrandRepository();

  return {
    findAllBrands: new FindAllBrandsUseCase(repository),
    findBrandById: new FindBrandByIdUseCase(repository),
    createBrand: new CreateBrandUseCase(repository),
    updateBrand: new UpdateBrandUseCase(repository),
    deleteBrand: new DeleteBrandUseCase(repository),
  };
}