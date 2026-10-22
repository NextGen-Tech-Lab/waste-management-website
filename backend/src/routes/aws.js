import express from 'express';
import { checkS3Connection, uploadBase64ToS3, uploadBufferToS3, AWS_S3_BUCKET, AWS_REGION } from '../services/s3Service.js';
import { checkLambdaStatus, invokeWasteAnalyzerLambda, AWS_LAMBDA_FUNCTION } from '../services/lambdaService.js';

const router = express.Router();

/**
 * Health & connection status of AWS Services (S3, EC2, Lambda)
 * Route: GET /api/aws/s3-status and GET /api/aws/cloud-status
 */
const getCloudStatus = async (req, res) => {
  try {
    const [s3Status, lambdaStatus] = await Promise.all([
      checkS3Connection(),
      checkLambdaStatus(),
    ]);

    res.status(200).json({
      success: true,
      service: 'Amazon Web Services (AWS)',
      cloudProvider: 'Amazon Web Services',
      architecture: {
        compute: 'Amazon EC2 (Ubuntu Linux)',
        serverless: `AWS Lambda (${AWS_LAMBDA_FUNCTION})`,
        objectStorage: `Amazon S3 (${AWS_S3_BUCKET})`,
        iamSecurity: 'AWS IAM Instance Profile (EC2-S3-FullAccess-Role)',
        database: 'MongoDB Atlas Cloud (M0/M10)',
        dns: 'DuckDNS / Route 53',
      },
      s3: s3Status,
      lambda: lambdaStatus,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify AWS Cloud status',
      error: error.message,
    });
  }
};

router.get('/s3-status', getCloudStatus);
router.get('/cloud-status', getCloudStatus);

/**
 * Dedicated status of AWS Lambda Serverless Service
 * Route: GET /api/aws/lambda-status
 */
router.get('/lambda-status', async (req, res) => {
  try {
    const status = await checkLambdaStatus();
    res.status(200).json({
      success: true,
      lambda: status,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check Lambda status',
      error: error.message,
    });
  }
});

/**
 * Invoke AWS Lambda Function to analyze waste complaint priority
 * Route: POST /api/aws/lambda/analyze
 */
router.post('/lambda/analyze', async (req, res) => {
  try {
    const payload = req.body && Object.keys(req.body).length > 0 
      ? req.body 
      : {
          subject: 'Overflowing commercial bin with hazardous waste near market',
          description: 'Garbage spilling over pedestrian sidewalk, strong chemical odor detected.',
          category: 'overflowing',
          severity: 'critical',
          location: { coordinates: [72.8777, 19.0760] },
        };

    const result = await invokeWasteAnalyzerLambda(payload);

    res.status(200).json({
      success: true,
      invokedBy: 'Amazon EC2 Backend',
      lambdaFunction: AWS_LAMBDA_FUNCTION,
      region: AWS_REGION,
      result,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to invoke AWS Lambda function',
      error: error.message,
      troubleshooting: 'Ensure the function is created in AWS Lambda (ap-south-1) and IAM role has lambda:InvokeFunction or AWSLambda_FullAccess.',
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
