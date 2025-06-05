import express, { Request, Response, NextFunction } from 'express';
import mahasiswaRoutes from './routes/mahasiswa';

const app = express();

// Middleware untuk parse JSON
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Root route
app.get('/', (req: Request, res: Response): void => {
  res.json({
    message: 'API Mahasiswa dengan Firebase v2.0',
    status: 'OK',
    environment: 'Netlify Functions',
    endpoints: {
      'GET /api/mahasiswa': 'Ambil semua data mahasiswa',
      'GET /api/mahasiswa/:id': 'Ambil mahasiswa berdasarkan ID',
      'GET /api/mahasiswa/npm/:npm': 'Ambil mahasiswa berdasarkan NPM',
      'POST /api/mahasiswa': 'Tambah mahasiswa baru',
      'PUT /api/mahasiswa/:id': 'Update data mahasiswa',
      'DELETE /api/mahasiswa/:id': 'Hapus data mahasiswa'
    }
  });
});

// Mount routes
app.use('/api/mahasiswa', mahasiswaRoutes);

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req: Request, res: Response): void => {
  res.status(404).json({ error: 'Route not found' });
});

// Export app for serverless
export default app;