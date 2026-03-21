import { makeBrandDependencies } from "@/app/api/_lib/brandDependencies";
import { parseBrandName } from "@/app/api/_lib/brandValidation";
import { jsonError, jsonOk } from "@/app/api/_lib/http";

export async function GET(): Promise<Response> {
  try {
    const { findAllBrands } = makeBrandDependencies();
    const brands = await findAllBrands.execute();

    return jsonOk(brands);
  } catch {
    return jsonError("Internal server error", 500);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = parseBrandName(body);

    if (!name) {
      return jsonError("Invalid brand name", 400);
    }

    const { createBrand } = makeBrandDependencies();
    const brand = await createBrand.execute(name);

    return jsonOk(brand, 201);
  } catch {
    return jsonError("Internal server error", 500);
  }
}