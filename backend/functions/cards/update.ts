import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { z } from "zod";
import { db, TABLE, GetCommand, UpdateCommand, QueryCommand, TransactWriteCommand } from "../../lib/db.js";
import { extractUser } from "../../lib/auth.js";
import { ok, badRequest, unauthorized, forbidden, notFound } from "../../lib/response.js";

const schema = z.object({
  templateId: z.enum(["classic", "dark", "minimal"]).optional(),
  isDefault: z.boolean().optional(),
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
  }).optional(),
});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const user = await extractUser(event);
  if (!user) return unauthorized();

  const cardId = event.pathParameters?.id;
  if (!cardId) return badRequest("Missing card id");

  const existing = await db.send(new GetCommand({
    TableName: TABLE,
    Key: { pk: `USER#${user.userId}`, sk: `CARD#${cardId}` },
  }));
  if (!existing.Item) return notFound();
  if (existing.Item.userId !== user.userId) return forbidden();

  const parsed = schema.safeParse(JSON.parse(event.body ?? "{}"));
  if (!parsed.success) return badRequest(parsed.error.message);

  const { templateId, isDefault, fields } = parsed.data;
  const now = new Date().toISOString();

  const updates: string[] = ["updatedAt = :now"];
  const values: Record<string, unknown> = { ":now": now };

  if (templateId) { updates.push("templateId = :t"); values[":t"] = templateId; }
  if (fields) { updates.push("fields = :f"); values[":f"] = fields; }

  if (isDefault === true && !existing.Item.isDefault) {
    const others = await db.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :prefix)",
      FilterExpression: "isDefault = :t AND sk <> :self",
      ExpressionAttributeValues: {
        ":pk": `USER#${user.userId}`,
        ":prefix": "CARD#",
        ":t": true,
        ":self": `CARD#${cardId}`,
      },
    }));

    const transactItems: any[] = [{
      Update: {
        TableName: TABLE,
        Key: { pk: `USER#${user.userId}`, sk: `CARD#${cardId}` },
        UpdateExpression: `SET ${[...updates, "isDefault = :d"].join(", ")}`,
        ExpressionAttributeValues: { ...values, ":d": true },
      },
    }];
    for (const old of others.Items ?? []) {
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
    if (isDefault !== undefined) { updates.push("isDefault = :d"); values[":d"] = isDefault; }
    await db.send(new UpdateCommand({
      TableName: TABLE,
      Key: { pk: `USER#${user.userId}`, sk: `CARD#${cardId}` },
      UpdateExpression: `SET ${updates.join(", ")}`,
      ExpressionAttributeValues: values,
    }));
  }

  return ok({ updated: true });
};
