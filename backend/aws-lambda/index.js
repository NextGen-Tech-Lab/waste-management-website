/**
 * AWS Lambda Function: ecomanage-waste-analyzer
 * Runtime: Node.js 20.x
 * Handler: index.handler
 * Description: Serverless Waste Triage & Urgency Scoring Engine for EcoManage
 */

export const handler = async (event) => {
  console.log('Received event from EcoManage backend:', JSON.stringify(event, null, 2));

  // Extract payload whether invoked directly or via Function URL/API Gateway
  let body = event;
  if (event.body) {
    try {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch {
      body = {};
    }
  }

  const {
    subject = '',
    description = '',
    category = 'general',
    severity = 'medium',
    binId = null,
    vehicleId = null,
    location = null,
  } = body;

  const textContent = `${subject} ${description}`.toLowerCase();

  // Intelligent Waste Classification & Urgency Engine
  let urgencyScore = 50;
  let recommendedPriority = 'MEDIUM';
  let estimatedResolutionHours = 24;
  let requiresCompactor = false;

  // Urgent hazard keywords
  const criticalKeywords = ['overflowing', 'toxic', 'chemical', 'hospital', 'fire', 'hazard', 'blocked', 'leak', 'drainage'];
  const matchedKeywords = criticalKeywords.filter((k) => textContent.includes(k));

  if (severity === 'critical' || matchedKeywords.length >= 2) {
    urgencyScore = Math.min(100, 85 + matchedKeywords.length * 5);
    recommendedPriority = 'IMMEDIATE_DISPATCH';
    estimatedResolutionHours = 2;
    requiresCompactor = true;
  } else if (severity === 'high' || matchedKeywords.length === 1) {
    urgencyScore = 75;
    recommendedPriority = 'HIGH';
    estimatedResolutionHours = 6;
  } else if (severity === 'low') {
    urgencyScore = 30;
    recommendedPriority = 'LOW';
    estimatedResolutionHours = 48;
  }

  // Calculate estimated waste volume index
  const estimatedVolumeLiters = requiresCompactor ? 800 : 350;

  const analysisResult = {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: true,
      service: 'AWS Lambda (Serverless Compute)',
      functionName: 'ecomanage-waste-analyzer',
      region: 'ap-south-1',
      runtime: 'Node.js 20.x',
      executionTimestamp: new Date().toISOString(),
      analysis: {
        category,
        inputSeverity: severity,
        computedUrgencyScore: urgencyScore,
        priorityLevel: recommendedPriority,
        estimatedResolutionHours,
        recommendedVehicle: requiresCompactor ? 'Heavy Compactor Truck (Type A)' : 'Standard Tipper Truck',
        estimatedVolumeLiters,
        matchedHazardKeywords: matchedKeywords,
        automatedAction: urgencyScore >= 80 ? 'AUTO_ALERT_SUPERVISOR' : 'QUEUED_FOR_STANDARD_ROUTE',
      },
      metadata: {
        binId: binId || 'N/A',
        vehicleId: vehicleId || 'N/A',
        coordinates: location?.coordinates || null,
      },
    }),
  };

  return analysisResult;
};
