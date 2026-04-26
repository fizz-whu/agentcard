import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { db, TABLE, GetCommand, UpdateCommand } from "../../lib/db.js";
import { extractUser } from "../../lib/auth.js";
import { ok, badRequest, unauthorized, forbidden, notFound } from "../../lib/response.js";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const user = await extractUser(event);
  if (!user) return unauthorized();

  const sessionId = event.pathParameters?.id;
  if (!sessionId) return badRequest("Missing session id");

  const sessionResult = await db.send(new GetCommand({
    TableName: TABLE,
    Key: { pk: `SESSION#${sessionId}`, sk: "META" },
  }));
  if (!sessionResult.Item) return notFound();
  if (sessionResult.Item.hostUserId !== user.userId) return forbidden();
  if (sessionResult.Item.status === "closed") return badRequest("Session already closed");

  await db.send(new UpdateCommand({
    TableName: TABLE,
    Key: { pk: `SESSION#${sessionId}`, sk: "META" },
    UpdateExpression: "SET #s = :closed, closedAt = :now",
    ExpressionAttributeNames: { "#s": "status" },
    ExpressionAttributeValues: { ":closed": "closed", ":now": new Date().toISOString() },
  }));

  return ok({ closed: true });
};
