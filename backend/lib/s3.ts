import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({});
const BUCKET = process.env.ASSETS_BUCKET!;

export async function getPresignedUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });
  return getSignedUrl(s3, command, { expiresIn: 300 });
}

export function getPublicUrl(key: string) {
  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}
