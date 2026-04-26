import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { db, TABLE, PutCommand } from "../../lib/db.js";
import { extractUser } from "../../lib/auth.js";
import { created, badRequest, unauthorized } from "../../lib/response.js";

const schema = z.object({
  title: z.string().optional(),
  durationMinutes: z.number().int().min(1).max(1440),
});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const user = await extractUser(event);
  if (!user) return unauthorized();

  const parsed = schema.safeParse(JSON.parse(event.body ?? "{}"));
  if (!parsed.success) return badRequest(parsed.error.message);

  const { title, durationMinutes } = parsed.data;
  const sessionId = uuid();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000).toISOString();

  await db.send(new PutCommand({
    TableName: TABLE,
    Item: {
      pk: `SESSION#${sessionId}`,
      sk: "META",
      gsi1pk: `USER#${user.userId}`,
      gsi1sk: `SESSION#${sessionId}`,
      id: sessionId,
      hostUserId: user.userId,
      title,
      status: "active",
      startsAt: now.toISOString(),
      expiresAt,
      createdAt: now.toISOString(),
    },
  }));

  return created({ session: { id: sessionId, expiresAt, title } });
};
