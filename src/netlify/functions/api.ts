import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    // Dynamic import to avoid build issues
    const { default: serverless } = await import('serverless-http');
    const { default: app } = await import('../../index');
    
    const serverlessHandler = serverless(app);
    const result = await serverlessHandler(event, context);
    
    return {
      statusCode: (result as any).statusCode || 200,
      body: (result as any).body || JSON.stringify({ message: 'OK' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        ...(result as any).headers
      }
    };
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};