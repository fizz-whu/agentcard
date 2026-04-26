import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { db, TABLE, QueryCommand } from "../../lib/db.js";
import { extractUser } from "../../lib/auth.js";
import { ok, unauthorized } from "../../lib/response.js";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const user = await extractUser(event);
  if (!user) return unauthorized();

  const result = await db.send(new QueryCommand({
    TableName: TABLE,
    KeyConditionExpression: "pk = :pk AND begins_with(sk, :prefix)",
    ExpressionAttributeValues: {
      ":pk": `USER#${user.userId}`,
      ":prefix": "RECEIVED#",
    },
    ScanIndexForward: false,
  }));

  return ok({ received: result.Items ?? [] });
};
