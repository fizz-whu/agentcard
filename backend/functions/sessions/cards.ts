import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { db, TABLE, GetCommand, QueryCommand } from "../../lib/db.js";
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
  if (!sessionResult.Item) return notFound();

  const membersResult = await db.send(new QueryCommand({
    TableName: TABLE,
    KeyConditionExpression: "pk = :pk AND begins_with(sk, :prefix)",
    ExpressionAttributeValues: {
      ":pk": `SESSION#${sessionId}`,
      ":prefix": "MEMBER#",
    },
  }));

  const members = membersResult.Items ?? [];
  const myMembership = members.find((m) => m.userId === user.userId);
  const isHost = sessionResult.Item.hostUserId === user.userId;

  if (!myMembership && !isHost) return unauthorized();

  return ok({
    session: sessionResult.Item,
    members: members.map((m) => ({
      userId: m.userId,
      card: m.cardSnapshot,
      joinedAt: m.joinedAt,
      kept: m.kept,
    })),
  });
};
