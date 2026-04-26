import { createRemoteJWKSet, jwtVerify } from "jose";
import type { APIGatewayProxyEventV2 } from "aws-lambda";

const REGION = process.env.AWS_REGION!;
const USER_POOL_ID = process.env.USER_POOL_ID!;

const JWKS = createRemoteJWKSet(
  new URL(`https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`)
);

export interface AuthUser {
  userId: string;
  email: string;
}

export async function extractUser(event: APIGatewayProxyEventV2): Promise<AuthUser | null> {
  const authHeader = event.headers?.authorization ?? event.headers?.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`,
    });
    return {
      userId: payload.sub as string,
      email: (payload.email ?? "") as string,
    };
  } catch {
    return null;
  }
}
