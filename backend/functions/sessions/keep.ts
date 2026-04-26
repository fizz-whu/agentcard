import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { z } from "zod";
import { db, TABLE, GetCommand, PutCommand, UpdateCommand, TransactWriteCommand } from "../../lib/db.js";
import { extractUser } from "../../lib/auth.js";
import { ok, badRequest, unauthorized, notFound } from "../../lib/response.js";

const schema = z.object({ keptCardUserIds: z.array(z.string()) });

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const user = await extractUser(event);
  if (!user) return unauthorized();

  const sessionId = event.pathParameters?.id;
  if (!sessionId) return badRequest("Missing session id");

  const parsed = schema.safeParse(JSON.parse(event.body ?? "{}"));
  if (!parsed.success) return badRequest(parsed.error.message);

  const memberResult = await db.send(new GetCommand({
    TableName: TABLE,
    Key: { pk: `SESSION#${sessionId}`, sk: `MEMBER#${user.userId}` },
  }));
  if (!memberResult.Item) return notFound();

  const { keptCardUserIds } = parsed.data;
  const now = new Date().toISOString();

  // Write RECEIVED records for kept cards from this session
  const transactItems: any[] = [
    {
      Update: {
        TableName: TABLE,
        Key: { pk: `SESSION#${sessionId}`, sk: `MEMBER#${user.userId}` },
        UpdateExpression: "SET kept = :t, keptAt = :now",
        ExpressionAttributeValues: { ":t": true, ":now": now },
      },
    },
  ];

  for (const fromUserId of keptCardUserIds) {
    const fromMemberResult = await db.send(new GetCommand({
      TableName: TABLE,
      Key: { pk: `SESSION#${sessionId}`, sk: `MEMBER#${fromUserId}` },
    }));
    if (!fromMemberResult.Item) continue;

    transactItems.push({
      Put: {
        TableName: TABLE,
        Item: {
          pk: `USER#${user.userId}`,
          sk: `RECEIVED#SESSION#${sessionId}#${fromUserId}`,
          type: "received",
          source: "group",
          sessionId,
          fromUserId,
          cardSnapshot: fromMemberResult.Item.cardSnapshot,
          receivedAt: now,
        },
      },
    });
  }

  await db.send(new TransactWriteCommand({ TransactItems: transactItems }));
  return ok({ kept: true });
};
