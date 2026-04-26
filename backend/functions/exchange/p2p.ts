import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { db, TABLE, QueryCommand, TransactWriteCommand } from "../../lib/db.js";
import { extractUser } from "../../lib/auth.js";
import { ok, badRequest, unauthorized, notFound, serverError } from "../../lib/response.js";

const schema = z.object({
  fromUserId: z.string(),
  cardId: z.string(),
});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const scanner = await extractUser(event);
  if (!scanner) return unauthorized();

  const parsed = schema.safeParse(JSON.parse(event.body ?? "{}"));
  if (!parsed.success) return badRequest(parsed.error.message);

  const { fromUserId, cardId } = parsed.data;

  if (fromUserId === scanner.userId) return badRequest("Cannot exchange with yourself");

  // Verify the card exists and belongs to fromUserId
  const cardLookup = await db.send(new QueryCommand({
    TableName: TABLE,
    IndexName: "gsi1",
    KeyConditionExpression: "gsi1pk = :pk",
    ExpressionAttributeValues: { ":pk": `CARD#${cardId}` },
  }));
  const fromCard = cardLookup.Items?.[0];
  if (!fromCard || fromCard.userId !== fromUserId) return notFound();

  // Get scanner's default card
  const scannerCards = await db.send(new QueryCommand({
    TableName: TABLE,
    KeyConditionExpression: "pk = :pk AND begins_with(sk, :prefix)",
    FilterExpression: "isDefault = :t",
    ExpressionAttributeValues: {
      ":pk": `USER#${scanner.userId}`,
      ":prefix": "CARD#",
      ":t": true,
    },
  }));
  const scannerDefaultCard = scannerCards.Items?.[0];
  if (!scannerDefaultCard) return badRequest("You have no default card set");

  const exchangeId = uuid();
  const now = new Date().toISOString();

  try {
    await db.send(new TransactWriteCommand({
      TransactItems: [
        // Scanner receives fromUser's card
        {
          Put: {
            TableName: TABLE,
            Item: {
              pk: `USER#${scanner.userId}`,
              sk: `RECEIVED#P2P#${exchangeId}`,
              type: "received",
              source: "p2p",
              exchangeId,
              fromUserId,
              cardSnapshot: fromCard,
              receivedAt: now,
            },
            ConditionExpression: "attribute_not_exists(pk)",
          },
        },
        // fromUser receives scanner's default card
        {
          Put: {
            TableName: TABLE,
            Item: {
              pk: `USER#${fromUserId}`,
              sk: `RECEIVED#P2P#${exchangeId}`,
              type: "received",
              source: "p2p",
              exchangeId,
              fromUserId: scanner.userId,
              cardSnapshot: scannerDefaultCard,
              receivedAt: now,
            },
          },
        },
      ],
    }));
  } catch {
    return serverError("Exchange failed");
  }

  return ok({ exchanged: true, card: fromCard });
};
