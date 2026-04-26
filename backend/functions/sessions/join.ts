import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { db, TABLE, GetCommand, PutCommand, QueryCommand } from "../../lib/db.js";
import { extractUser } from "../../lib/auth.js";
import { ok, badRequest, unauthorized, notFound } from "../../lib/response.js";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const user = await extractUser(event);
  if (!user) return unauthorized();

  const sessionId = event.pathParameters?.id;
  if (!sessionId) return badRequest("Missing session id");

  const sessionResult = await db.send(new GetCommand({
    TableName: TABLE,
    Key: { pk: `SESSION#${sessionId}`, sk: "META" },
  }));
  const session = sessionResult.Item;
  if (!session) return notFound();
  if (session.status === "closed") return badRequest("Session is closed");
  if (new Date(session.expiresAt) < new Date()) return badRequest("Session has expired");

  // Get user's default card
  const cardsResult = await db.send(new QueryCommand({
    TableName: TABLE,
    KeyConditionExpression: "pk = :pk AND begins_with(sk, :prefix)",
    FilterExpression: "isDefault = :t",
    ExpressionAttributeValues: {
      ":pk": `USER#${user.userId}`,
      ":prefix": "CARD#",
      ":t": true,
    },
  }));
  const defaultCard = cardsResult.Items?.[0];
  if (!defaultCard) return badRequest("You have no default card set");

  const now = new Date().toISOString();

  await db.send(new PutCommand({
    TableName: TABLE,
    Item: {
      pk: `SESSION#${sessionId}`,
      sk: `MEMBER#${user.userId}`,
      gsi1pk: `USER#${user.userId}`,
      gsi1sk: `SESSION#${sessionId}`,
      sessionId,
      userId: user.userId,
      cardId: defaultCard.id,
      cardSnapshot: defaultCard,
      joinedAt: now,
      kept: false,
    },
  }));

  return ok({ joined: true, session: { id: sessionId, expiresAt: session.expiresAt, title: session.title } });
};
