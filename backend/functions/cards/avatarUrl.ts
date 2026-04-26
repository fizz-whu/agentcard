import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { v4 as uuid } from "uuid";
import { extractUser } from "../../lib/auth.js";
import { getPresignedUploadUrl, getPublicUrl } from "../../lib/s3.js";
import { ok, badRequest, unauthorized } from "../../lib/response.js";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const user = await extractUser(event);
  if (!user) return unauthorized();

  const ext = event.queryStringParameters?.ext ?? "jpg";
  if (!["jpg", "jpeg", "png", "webp"].includes(ext)) return badRequest("Invalid file extension");

  const key = `avatars/${user.userId}/${uuid()}.${ext}`;
  const contentType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

  const uploadUrl = await getPresignedUploadUrl(key, contentType);
  const publicUrl = getPublicUrl(key);

  return ok({ uploadUrl, publicUrl, key });
};
