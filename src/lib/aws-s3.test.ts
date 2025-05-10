import { S3Client, DeleteObjectCommand, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import "aws-sdk-client-mock-jest"; // For expect(...).toHaveReceivedCommandWith(...)
import { getSignedUploadUrl, getSignedViewUrl, deleteObject } from "./aws-s3";
import * as s3RequestPresigner from "@aws-sdk/s3-request-presigner";

// Mock environment variables
const MOCK_BUCKET_NAME = "forms";
const MOCK_REGION = "us-east-1";
const MOCK_KMS_KEY_ID = "dummy-kms-key-id";

process.env.AWS_S3_BUCKET_NAME = MOCK_BUCKET_NAME;
process.env.AWS_REGION = MOCK_REGION;
process.env.AWS_S3_KMS_KEY_ID = MOCK_KMS_KEY_ID;
// AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are not directly used by the module
// but by the S3Client internally. We don't need to mock them for these tests
// as getSignedUrl is mocked and we don't make actual AWS calls.

// Mock getSignedUrl from @aws-sdk/s3-request-presigner
const mockSignedUrlConst = "https://s3.amazonaws.com/signed-url";
jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn(() => Promise.resolve(mockSignedUrlConst)),
}));

describe("AWS S3 Helper", () => {
  const s3Mock = mockClient(S3Client);
  // Type assertion for the mocked module
  const mockedS3RequestPresigner = s3RequestPresigner as jest.Mocked<typeof s3RequestPresigner>;

  beforeEach(() => {
    s3Mock.reset();
    // Reset the getSignedUrl mock before each test
    mockedS3RequestPresigner.getSignedUrl.mockClear();
    mockedS3RequestPresigner.getSignedUrl.mockResolvedValue(mockSignedUrlConst);
  });

  describe("getSignedUploadUrl", () => {
    it("should return a signed URL for upload with correct parameters", async () => {
      const key = "uploads/test.txt";
      const contentType = "text/plain";
      const signedUrl = await getSignedUploadUrl(key, contentType);

      expect(signedUrl).toBe(mockSignedUrlConst);
      expect(mockedS3RequestPresigner.getSignedUrl).toHaveBeenCalledWith(
        expect.any(S3Client), // The S3 client instance
        expect.any(PutObjectCommand), // Expect a PutObjectCommand
        { expiresIn: 3600 } // Options
      );
      // Additionally, verify the properties of the command passed to getSignedUrl
      const calledCommand = mockedS3RequestPresigner.getSignedUrl.mock.calls[0][1];
      expect(calledCommand.input).toEqual(expect.objectContaining({
        Bucket: MOCK_BUCKET_NAME,
        Key: key,
        ContentType: contentType,
        ServerSideEncryption: "aws:kms",
        SSEKMSKeyId: MOCK_KMS_KEY_ID,
      }));
    });
  });

  describe("getSignedViewUrl", () => {
    it("should return a signed URL for view with correct parameters", async () => {
      const key = "documents/view.pdf";
      const signedUrl = await getSignedViewUrl(key);

      expect(signedUrl).toBe(mockSignedUrlConst);
      expect(mockedS3RequestPresigner.getSignedUrl).toHaveBeenCalledWith(
        expect.any(S3Client),
        expect.any(GetObjectCommand), // Expect a GetObjectCommand
        { expiresIn: 3600 }
      );
      // Additionally, verify the properties of the command passed to getSignedUrl
      const calledCommand = mockedS3RequestPresigner.getSignedUrl.mock.calls[0][1];
      expect(calledCommand.input).toEqual(expect.objectContaining({
        Bucket: MOCK_BUCKET_NAME,
        Key: key,
      }));
    });
  });

  describe("deleteObject", () => {
    it("should call DeleteObjectCommand with correct parameters", async () => {
      s3Mock.on(DeleteObjectCommand).resolves({}); // Mock successful deletion
      const key = "archive/old-file.zip";

      await deleteObject(key);

      expect(s3Mock).toHaveReceivedCommandWith(DeleteObjectCommand, {
        Bucket: MOCK_BUCKET_NAME,
        Key: key,
      });
    });

    it("should throw an error if S3 delete operation fails", async () => {
      const key = "archive/another-file.zip";
      const errorMessage = "S3 Delete Failed";
      s3Mock.on(DeleteObjectCommand).rejects(new Error(errorMessage));

      await expect(deleteObject(key)).rejects.toThrow(errorMessage);
      expect(s3Mock).toHaveReceivedCommandWith(DeleteObjectCommand, {
        Bucket: MOCK_BUCKET_NAME,
        Key: key,
      });
    });
  });
}); 