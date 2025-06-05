import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import express from 'express';
import mahasiswaRoutes from '../../routes/mahasiswa';

const app = express();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'API Mahasiswa dengan Firebase v2.0',
    status: 'OK',
    environment: 'Netlify Functions'
  });
});

app.use('/api/mahasiswa', mahasiswaRoutes);
app.use('/mahasiswa', mahasiswaRoutes);

// Convert Express app to Netlify function
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    // Import serverless-http inside the handler to avoid type issues
    const serverless = await import('serverless-http');
    const serverlessHandler = serverless.default(app);
    
    const result = await serverlessHandler(event, context);
    return result as any;
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