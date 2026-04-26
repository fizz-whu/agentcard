import { z } from "zod";

const cardPayloadSchema = z.object({ t: z.literal("c"), uid: z.string(), cid: z.string(), v: z.literal(1) });
const sessionPayloadSchema = z.object({ t: z.literal("s"), sid: z.string(), exp: z.number(), v: z.literal(1) });
const payloadSchema = z.discriminatedUnion("t", [cardPayloadSchema, sessionPayloadSchema]);

export type QRPayload =
  | { t: "c"; uid: string; cid: string; v: 1 }
  | { t: "s"; sid: string; exp: number; v: 1 };

export function encodeCardQR(userId: string, cardId: string): string {
  const payload: QRPayload = { t: "c", uid: userId, cid: cardId, v: 1 };
  return btoa(JSON.stringify(payload));
}

export function encodeSessionQR(sessionId: string, expiresAt: string): string {
  const payload: QRPayload = { t: "s", sid: sessionId, exp: Math.floor(new Date(expiresAt).getTime() / 1000), v: 1 };
  return btoa(JSON.stringify(payload));
}

export function decodeQRPayload(raw: string): QRPayload | null {
  try {
    const json = JSON.parse(atob(raw));
    const result = payloadSchema.safeParse(json);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
