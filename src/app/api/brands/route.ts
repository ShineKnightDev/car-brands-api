import { makeBrandDependencies } from "@/app/api/_lib/brandDependencies";
import { parseBrandName } from "@/app/api/_lib/brandValidation";
import { jsonError, jsonOk, tooManyRequests } from "@/app/api/_lib/http";
import { enforceRateLimit } from "@/app/api/_lib/rateLimit";

export async function GET(): Promise<Response> {
  try {
    const { findAllBrands } = makeBrandDependencies();
    const brands = await findAllBrands.execute();

    return jsonOk(brands);
  } catch (error) {
    console.error("[GET /api/brands]", error);
    const message =
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error instanceof Error
          ? error.message
          : "Internal server error";

    return jsonError(message, 500);
  }
}

export async function POST(request: Request): Promise<Response> {
  const rateLimitResult = enforceRateLimit(request, "brands:create", {
    windowMs: 60_000,
    maxRequests: 20,
  });

  if (!rateLimitResult.ok) {
    return tooManyRequests(rateLimitResult.retryAfterSeconds);
  }

  try {
    let body: Record<string, unknown>;

    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return jsonError("Invalid JSON body", 400);
    }

    const name = parseBrandName(body);

    if (!name) {
      return jsonError("Invalid brand name", 400);
    }

    const { createBrand } = makeBrandDependencies();
    const brand = await createBrand.execute(name);

    return jsonOk(brand, 201);
  } catch (error) {
    console.error("[POST /api/brands]", error);
    const message =
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error instanceof Error
          ? error.message
          : "Internal server error";

    return jsonError(message, 500);
  }
}