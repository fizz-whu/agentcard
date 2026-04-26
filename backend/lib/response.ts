const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const ok = (body: unknown) => json(200, body);
export const created = (body: unknown) => json(201, body);
export const badRequest = (message: string) => json(400, { error: message });
export const unauthorized = () => json(401, { error: "Unauthorized" });
export const forbidden = () => json(403, { error: "Forbidden" });
export const notFound = () => json(404, { error: "Not found" });
export const serverError = (message = "Internal server error") => json(500, { error: message });
