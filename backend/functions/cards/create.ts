import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { db, TABLE, PutCommand, QueryCommand, TransactWriteCommand } from "../../lib/db.js";
import { extractUser } from "../../lib/auth.js";
import { ok, badRequest, unauthorized } from "../../lib/response.js";

const schema = z.object({
  templateId: z.enum(["classic", "dark", "minimal"]),
  isDefault: z.boolean().optional().default(false),
  fields: z.object({
    name: z.string().min(1),
    title: z.string().optional(),
    company: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    website: z.string().optional(),
    bio: z.string().optional(),
    avatarUrl: z.string().optional(),
    socialLinks: z.record(z.string()).optional(),
    customFields: z.record(z.string()).optional(),
  }),
});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const user = await extractUser(event);
  if (!user) return unauthorized();

  const parsed = schema.safeParse(JSON.parse(event.body ?? "{}"));
  if (!parsed.success) return badRequest(parsed.error.message);

  const { templateId, isDefault, fields } = parsed.data;
  const cardId = uuid();
  const now = new Date().toISOString();

  const item = {
    pk: `USER#${user.userId}`,
    sk: `CARD#${cardId}`,
    gsi1pk: `CARD#${cardId}`,
    gsi1sk: `CARD#${cardId}`,
    id: cardId,
    userId: user.userId,
    templateId,
    isDefault,
    fields,
    createdAt: now,
    updatedAt: now,
  };

  if (isDefault) {
    const existing = await db.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :prefix)",
      FilterExpression: "isDefault = :t",
      ExpressionAttributeValues: {
        ":pk": `USER#${user.userId}`,
        ":prefix": "CARD#",
        ":t": true,
      },
    }));

    const transactItems: any[] = [{ Put: { TableName: TABLE, Item: item } }];
    for (const old of existing.Items ?? []) {
      transactItems.push({
        Update: {
          TableName: TABLE,
          Key: { pk: old.pk, sk: old.sk },
          UpdateExpression: "SET isDefault = :f",
          ExpressionAttributeValues: { ":f": false },
        },
      });
    }
    await db.send(new TransactWriteCommand({ TransactItems: transactItems }));
  } else {
    await db.send(new PutCommand({ TableName: TABLE, Item: item }));
  }

  return ok({ card: item });
};
