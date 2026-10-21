import express from 'express';
import { checkS3Connection, uploadBase64ToS3, uploadBufferToS3, AWS_S3_BUCKET, AWS_REGION } from '../services/s3Service.js';

const router = express.Router();

/**
 * Health & connection status of AWS Services (S3, EC2 environment)
 * Route: GET /api/aws/s3-status
 */
router.get('/s3-status', async (req, res) => {
  try {
    const s3Status = await checkS3Connection();

    res.status(200).json({
      success: true,
      service: 'Amazon Web Services (AWS)',
      cloudProvider: 'Amazon Web Services',
      architecture: {
        compute: 'Amazon EC2 (Ubuntu Linux)',
        objectStorage: 'Amazon S3 (Simple Storage Service)',
        database: 'MongoDB Atlas Cloud (M0/M10)',
        dns: 'DuckDNS / Route 53',
      },
      s3: s3Status,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify AWS S3 status',
      error: error.message,
    });
  }
});

/**
 * Test upload a file directly to Amazon S3
 * Route: POST /api/aws/upload-test
 */
router.post('/upload-test', async (req, res) => {
  try {
    const { content, filename } = req.body || {};
    const textContent = content || `EcoManage test audit file generated at ${new Date().toISOString()}`;
    const key = `test-uploads/${filename || `test-${Date.now()}.txt`}`;

    const url = await uploadBufferToS3(Buffer.from(textContent, 'utf-8'), key, 'text/plain');

    res.status(200).json({
      success: true,
      message: 'File successfully uploaded to Amazon S3!',
      bucket: AWS_S3_BUCKET,
      region: AWS_REGION,
      s3Key: key,
      fileUrl: url,
      uploadedAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload file to Amazon S3',
      error: error.message,
    });
  }
});

export default router;
