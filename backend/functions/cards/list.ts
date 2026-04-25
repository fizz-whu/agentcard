import { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  // TODO: verify Cognito JWT, query DynamoDB for user's cards
  return {
    statusCode: 200,
    body: JSON.stringify({ cards: [] }),
  };
};
