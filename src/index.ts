import express, { Request, Response, NextFunction } from 'express';
import mahasiswaRoutes from './routes/mahasiswa';

const app = express();
const port = process.env.PORT || 3000;

// Middleware untuk parse JSON pada request body
app.use(express.json());

// Middleware untuk CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Route root
app.get('/', (req: Request, res: Response): void => {
  res.json({
    message: 'API Mahasiswa dengan Firebase v2.0',
    status: 'OK',
    endpoints: {
      'GET /mahasiswa': 'Ambil semua data mahasiswa',
      'GET /mahasiswa/:id': 'Ambil mahasiswa berdasarkan ID',
      'GET /mahasiswa/npm/:npm': 'Ambil mahasiswa berdasarkan NPM',
      'POST /mahasiswa': 'Tambah mahasiswa baru',
      'PUT /mahasiswa/:id': 'Update data mahasiswa',
      'DELETE /mahasiswa/:id': 'Hapus data mahasiswa'
    }
  });
});

app.use('/mahasiswa', mahasiswaRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404
app.use('*', (req: Request, res: Response): void => {
  res.status(404).json({ error: 'Route not found' });
});

// Export untuk Vercel (PENTING!)
export default app;

// Local development only
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}