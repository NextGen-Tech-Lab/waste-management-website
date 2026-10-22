import { LambdaClient, InvokeCommand, GetFunctionCommand } from '@aws-sdk/client-lambda';

export const AWS_REGION = process.env.AWS_REGION || 'ap-south-1';
export const AWS_LAMBDA_FUNCTION = process.env.AWS_LAMBDA_FUNCTION || 'ecomanage-waste-analyzer';

const clientConfig = {
  region: AWS_REGION,
};

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

export const lambdaClient = new LambdaClient(clientConfig);

/**
 * Checks if the AWS Lambda function exists and returns its metadata
 */
export const checkLambdaStatus = async () => {
  try {
    const command = new GetFunctionCommand({ FunctionName: AWS_LAMBDA_FUNCTION });
    const response = await lambdaClient.send(command);

    return {
      connected: true,
      functionName: response.Configuration?.FunctionName || AWS_LAMBDA_FUNCTION,
      state: response.Configuration?.State || 'Active',
      runtime: response.Configuration?.Runtime || 'nodejs20.x',
      memorySize: response.Configuration?.MemorySize || 128,
      lastModified: response.Configuration?.LastModified,
      arn: response.Configuration?.FunctionArn,
      region: AWS_REGION,
    };
  } catch (error) {
    return {
      connected: false,
      functionName: AWS_LAMBDA_FUNCTION,
      region: AWS_REGION,
      error: error.message,
      note: error.name === 'ResourceNotFoundException' 
        ? 'Function not yet created in AWS Console. Follow the 1-minute setup guide.' 
        : error.message,
    };
  }
};

/**
 * Invokes the AWS Lambda function with complaint or sensor payload
 * @param {object} payload
 * @returns {Promise<object>}
 */
export const invokeWasteAnalyzerLambda = async (payload) => {
  // If Function URL is provided, call via HTTPS
  if (process.env.AWS_LAMBDA_FUNCTION_URL) {
    try {
      const fetchRes = await fetch(process.env.AWS_LAMBDA_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await fetchRes.json();
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (err) {
      console.warn('Lambda Function URL error, falling back to AWS SDK:', err.message);
    }
  }

  // Invoke via AWS SDK
  try {
    const command = new InvokeCommand({
      FunctionName: AWS_LAMBDA_FUNCTION,
      Payload: Buffer.from(JSON.stringify(payload)),
    });

    const response = await lambdaClient.send(command);
    const resultString = Buffer.from(response.Payload).toString('utf-8');
    const parsed = JSON.parse(resultString);

    if (parsed.body) {
      return typeof parsed.body === 'string' ? JSON.parse(parsed.body) : parsed.body;
    }

    return parsed;
  } catch (error) {
    console.error('Lambda invocation error:', error.message);
    throw error;
  }
};

export default {
  lambdaClient,
  checkLambdaStatus,
  invokeWasteAnalyzerLambda,
  AWS_LAMBDA_FUNCTION,
  AWS_REGION,
};
