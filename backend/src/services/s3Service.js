import { S3Client, PutObjectCommand, HeadBucketCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

export const AWS_REGION = process.env.AWS_REGION || 'ap-south-1';
export const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || 'ecomanage-waste-ankur-2026';

const clientConfig = {
  region: AWS_REGION,
};

// If running locally with IAM credentials in .env, use them.
// If running on EC2 with an attached IAM Role, SDK discovers credentials automatically!
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

export const s3Client = new S3Client(clientConfig);

/**
 * Uploads a base64 encoded image to Amazon S3
 * @param {string} base64String - Data URL e.g. "data:image/jpeg;base64,..."
 * @param {string} filename - Original filename or label
 * @returns {Promise<{url: string, key: string, bucket: string}>}
 */
export const uploadBase64ToS3 = async (base64String, filename = 'complaint.jpg') => {
  try {
    if (!base64String || typeof base64String !== 'string') {
      throw new Error('Invalid base64 string provided');
    }

    let mimeType = 'image/jpeg';
    let rawData = base64String;

    if (base64String.startsWith('data:')) {
      const parts = base64String.split(',');
      const match = parts[0].match(/:(.*?);/);
      if (match) {
        mimeType = match[1];
      }
      rawData = parts[1] || '';
    }

    const buffer = Buffer.from(rawData, 'base64');
    const extension = mimeType.split('/')[1] || 'jpg';
    const key = `complaints/${Date.now()}-${uuidv4().slice(0, 8)}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    });

    await s3Client.send(command);

    const s3Url = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;

    return {
      url: s3Url,
      key,
      bucket: AWS_S3_BUCKET,
      size: buffer.length,
    };
  } catch (error) {
    console.error('S3 Base64 Upload Error:', error);
    throw error;
  }
};

/**
 * Uploads raw buffer to S3
 */
export const uploadBufferToS3 = async (buffer, key, contentType = 'text/plain') => {
  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
};

/**
 * Check connection and status of Amazon S3 Bucket
 */
export const checkS3Connection = async () => {
  try {
    const headCommand = new HeadBucketCommand({ Bucket: AWS_S3_BUCKET });
    await s3Client.send(headCommand);

    const listCommand = new ListObjectsV2Command({
      Bucket: AWS_S3_BUCKET,
      MaxKeys: 10,
    });
    const listRes = await s3Client.send(listCommand);

    return {
      connected: true,
      bucket: AWS_S3_BUCKET,
      region: AWS_REGION,
      objectCount: listRes.KeyCount || 0,
      recentObjects: (listRes.Contents || []).map((obj) => ({
        key: obj.Key,
        size: obj.Size,
        lastModified: obj.LastModified,
        url: `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${obj.Key}`,
      })),
    };
  } catch (error) {
    return {
      connected: false,
      bucket: AWS_S3_BUCKET,
      region: AWS_REGION,
      error: error.message,
    };
  }
};

export default {
  s3Client,
  uploadBase64ToS3,
  uploadBufferToS3,
  checkS3Connection,
  AWS_S3_BUCKET,
  AWS_REGION,
};
