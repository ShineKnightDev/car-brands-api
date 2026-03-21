export type ApiErrorPayload = {
  error: string;
};

export function jsonOk<T>(data: T, status = 200): Response {
  return Response.json(data, { status });
}

export function jsonError(message: string, status: number): Response {
  const payload: ApiErrorPayload = { error: message };
  return Response.json(payload, { status });
}