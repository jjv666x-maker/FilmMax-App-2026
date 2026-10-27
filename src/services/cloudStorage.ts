import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

// Verify whether real S3/R2 cloud storage credentials are configured
const accessKey = process.env.AWS_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY;
const s3Region = process.env.AWS_REGION || process.env.S3_REGION || "us-east-1";
const s3Bucket = process.env.AWS_BUCKET_NAME || process.env.S3_BUCKET || "filmmax-media-cdn";
const s3Endpoint = process.env.AWS_ENDPOINT || process.env.S3_ENDPOINT;

export const isCloudStorageConfigured = (): boolean => {
  return !!(accessKey && secretKey && accessKey !== "MOCK_KEY");
};

// Lazy S3Client initialization only when real credentials are provided
let s3ClientInstance: S3Client | null = null;
function getS3Client(): S3Client | null {
  if (!isCloudStorageConfigured()) return null;
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: s3Region,
      endpoint: s3Endpoint || undefined,
      credentials: {
        accessKeyId: accessKey!,
        secretAccessKey: secretKey!,
      },
      forcePathStyle: !!s3Endpoint,
    });
  }
  return s3ClientInstance;
}

/**
 * Handles HLS stream distribution:
 * - If S3/R2 credentials are provided: Uploads to cloud bucket and returns CDN domain.
 * - If credentials are not provided: Safely serves directly from local /public/streams,
 *   guaranteeing 100% working video playback without fake remote URLs or broken connections.
 */
export async function uploadHlsToCloudStorage(
  jobId: string,
  localDir: string
): Promise<{ success: boolean; cdnUrl: string; isRemote: boolean; filesUploaded: number; error?: string }> {
  try {
    if (!fs.existsSync(localDir)) {
      throw new Error(`Local directory ${localDir} does not exist`);
    }

    const files = fs.readdirSync(localDir);
    const localStreamUrl = `/streams/${jobId}/master.m3u8`;

    // 1. Safe Local Mode (Default when no cloud credentials exist)
    if (!isCloudStorageConfigured()) {
      console.info(`[Storage System] Running in local filesystem mode for job ${jobId}. Stream available at ${localStreamUrl}`);
      return {
        success: true,
        cdnUrl: localStreamUrl,
        isRemote: false,
        filesUploaded: files.length,
      };
    }

    // 2. Real Remote S3/R2 Cloud Upload Mode (Only active when real keys exist)
    const client = getS3Client();
    if (!client) {
      return {
        success: true,
        cdnUrl: localStreamUrl,
        isRemote: false,
        filesUploaded: files.length,
      };
    }

    let uploadedCount = 0;
    const cdnDomain = process.env.CDN_DOMAIN || process.env.CLOUDFRONT_DOMAIN || (s3Endpoint ? `${s3Endpoint}/${s3Bucket}` : `https://${s3Bucket}.s3.${s3Region}.amazonaws.com`);

    for (const file of files) {
      const filePath = path.join(localDir, file);
      if (fs.statSync(filePath).isFile()) {
        const fileContent = fs.readFileSync(filePath);
        const s3Key = `streams/${jobId}/${file}`;
        const contentType = file.endsWith('.m3u8')
          ? 'application/vnd.apple.mpegurl'
          : file.endsWith('.ts')
          ? 'video/mp2t'
          : 'application/octet-stream';

        await client.send(
          new PutObjectCommand({
            Bucket: s3Bucket,
            Key: s3Key,
            Body: fileContent,
            ContentType: contentType,
            CacheControl: 'max-age=31536000',
          })
        );
        uploadedCount++;
      }
    }

    const masterCdnUrl = `${cdnDomain}/streams/${jobId}/master.m3u8`;
    console.info(`[Cloud Storage & CDN] Successfully uploaded ${uploadedCount} stream files to remote CDN: ${masterCdnUrl}`);

    return {
      success: true,
      cdnUrl: masterCdnUrl,
      isRemote: true,
      filesUploaded: uploadedCount,
    };
  } catch (error: any) {
    console.error("[Cloud Storage Upload Note]:", error.message);
    return {
      success: false,
      cdnUrl: `/streams/${jobId}/master.m3u8`,
      isRemote: false,
      filesUploaded: 0,
      error: error.message || 'Cloud storage upload failed',
    };
  }
}
