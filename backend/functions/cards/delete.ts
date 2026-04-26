import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { db, TABLE, GetCommand, DeleteCommand } from "../../lib/db.js";
import { extractUser } from "../../lib/auth.js";
import { ok, badRequest, unauthorized, forbidden, notFound } from "../../lib/response.js";

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

  await db.send(new DeleteCommand({
    TableName: TABLE,
    Key: { pk: `USER#${user.userId}`, sk: `CARD#${cardId}` },
  }));

  return ok({ deleted: true });
};
