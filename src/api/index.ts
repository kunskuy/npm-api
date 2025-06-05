import express, { Request, Response, NextFunction } from 'express';
import mahasiswaRoutes from '../routes/mahasiswa';

const app = express();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Routes
app.get('/', (req: Request, res: Response): void => {
  res.json({
    message: 'API Mahasiswa dengan Firebase v2.0',
    status: 'OK',
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

app.use('/mahasiswa', mahasiswaRoutes);

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use('*', (req: Request, res: Response): void => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;