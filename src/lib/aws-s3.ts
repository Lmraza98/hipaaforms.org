import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const AWS_REGION = process.env.AWS_REGION;
const S3_KMS_KEY_ID = process.env.AWS_S3_KMS_KEY_ID;

if (!S3_BUCKET_NAME || !AWS_REGION || !S3_KMS_KEY_ID) {
  throw new Error(
    "Missing AWS S3 configuration. Ensure AWS_S3_BUCKET_NAME, AWS_REGION, and AWS_S3_KMS_KEY_ID are set in environment variables."
  );
}

// AWS credentials (AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY) are expected to be
// configured in the environment where the application runs (e.g., Vercel environment variables).
// The S3Client will automatically pick them up.

const s3Client = new S3Client({ region: AWS_REGION });

const SIGNED_URL_EXPIRES_IN = 3600; // 1 hour in seconds

/**
 * Generates a pre-signed URL for uploading an object to S3.
 * The object will be encrypted using the configured KMS key.
 *
 * @param key The S3 object key (e.g., 'uploads/user-id/filename.pdf')
 * @param contentType The MIME type of the file to be uploaded (e.g., 'application/pdf')
 * @returns A promise that resolves to the pre-signed URL string.
 */
export async function getSignedUploadUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    ServerSideEncryption: "aws:kms",
    SSEKMSKeyId: S3_KMS_KEY_ID,
  });
  return getSignedUrl(s3Client, command, { expiresIn: SIGNED_URL_EXPIRES_IN });
}

/**
 * Generates a pre-signed URL for viewing/downloading an object from S3.
 *
 * @param key The S3 object key.
 * @returns A promise that resolves to the pre-signed URL string.
 */
export async function getSignedViewUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn: SIGNED_URL_EXPIRES_IN });
}

/**
 * Deletes an object from S3.
 *
 * @param key The S3 object key.
 * @returns A promise that resolves when the object is deleted.
 */
export async function deleteObject(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
  });
  await s3Client.send(command);
} 