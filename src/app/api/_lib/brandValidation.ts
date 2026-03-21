type BrandInputPayload = {
  name?: unknown;
  nombre?: unknown;
};

export function parseBrandId(value: string): number | null {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export function parseBrandName(payload: BrandInputPayload): string | null {
  const candidate =
    typeof payload.name === "string"
      ? payload.name
      : typeof payload.nombre === "string"
      ? payload.nombre
      : null;

  if (!candidate) {
    return null;
  }

  const trimmedName = candidate.trim();

  if (trimmedName.length < 2 || trimmedName.length > 100) {
    return null;
  }

  return trimmedName;
}