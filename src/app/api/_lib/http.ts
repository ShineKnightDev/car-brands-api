export type ApiErrorPayload = {
  error: string;
};

const SECURITY_HEADERS: HeadersInit = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

export function jsonOk<T>(data: T, status = 200): Response {
  return Response.json(data, {
    status,
    headers: SECURITY_HEADERS,
  });
}

export function jsonError(message: string, status: number): Response {
  const payload: ApiErrorPayload = { error: message };
  return Response.json(payload, {
    status,
    headers: SECURITY_HEADERS,
  });
}

export function tooManyRequests(retryAfterSeconds: number): Response {
  return Response.json(
    { error: "Too many requests. Try again later." },
    {
      status: 429,
      headers: {
        ...SECURITY_HEADERS,
        "Retry-After": String(retryAfterSeconds),
      },
    },
  );
}