import { makeBrandDependencies } from "@/app/api/_lib/brandDependencies";
import { parseBrandId, parseBrandName } from "@/app/api/_lib/brandValidation";
import { jsonError, jsonOk } from "@/app/api/_lib/http";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<Response> {
  try {
    const { id: rawId } = await context.params;
    const id = parseBrandId(rawId);

    if (!id) {
      return jsonError("Invalid brand id", 400);
    }

    const { findBrandById } = makeBrandDependencies();
    const brand = await findBrandById.execute(id);

    if (!brand) {
      return jsonError("Brand not found", 404);
    }

    return jsonOk(brand);
  } catch {
    return jsonError("Internal server error", 500);
  }
}

export async function PUT(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  try {
    const { id: rawId } = await context.params;
    const id = parseBrandId(rawId);

    if (!id) {
      return jsonError("Invalid brand id", 400);
    }

    const body = (await request.json()) as Record<string, unknown>;
    const name = parseBrandName(body);

    if (!name) {
      return jsonError("Invalid brand name", 400);
    }

    const { updateBrand } = makeBrandDependencies();
    const updatedBrand = await updateBrand.execute(id, name);

    if (!updatedBrand) {
      return jsonError("Brand not found", 404);
    }

    return jsonOk(updatedBrand);
  } catch {
    return jsonError("Internal server error", 500);
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
): Promise<Response> {
  try {
    const { id: rawId } = await context.params;
    const id = parseBrandId(rawId);

    if (!id) {
      return jsonError("Invalid brand id", 400);
    }

    const { deleteBrand } = makeBrandDependencies();
    const deleted = await deleteBrand.execute(id);

    if (!deleted) {
      return jsonError("Brand not found", 404);
    }

    return new Response(null, { status: 204 });
  } catch {
    return jsonError("Internal server error", 500);
  }
}