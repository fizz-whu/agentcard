import { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  // TODO: create group session with expiresAt, return sessionId for QR
  const body = JSON.parse(event.body ?? "{}");
  return {
    statusCode: 201,
    body: JSON.stringify({ sessionId: "stub", expiresAt: body.expiresAt }),
  };
};
