// src/routes/mahasiswa.ts
import express, { Request, Response } from 'express';
import { ref, push, get, set, remove, query, orderByChild, equalTo, update } from 'firebase/database';
import { database } from '../firebase';
import { Mahasiswa, MahasiswaInput } from '../types';

const router = express.Router();

// Route GET /mahasiswa - Mengambil semua data mahasiswa
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const mahasiswaRef = ref(database, 'mahasiswa');
    const snapshot = await get(mahasiswaRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const mahasiswaList: Mahasiswa[] = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      res.json(mahasiswaList);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching mahasiswa:', error);
    res.status(500).json({ error: 'Failed to fetch mahasiswa data' });
  }
});

// Route GET /mahasiswa/npm/:npm - Mengambil data mahasiswa berdasarkan NPM
router.get('/npm/:npm', async (req: Request, res: Response): Promise<void> => {
  try {
    const { npm } = req.params;
    const mahasiswaRef = ref(database, 'mahasiswa');
    const npmQuery = query(mahasiswaRef, orderByChild('npm'), equalTo(npm));
    const snapshot = await get(npmQuery);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const key = Object.keys(data)[0];
      const mahasiswa: Mahasiswa = {
        id: key,
        ...data[key]
      };
      res.json(mahasiswa);
    } else {
      res.status(404).json({ message: 'Mahasiswa dengan NPM tersebut tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error fetching mahasiswa by NPM:', error);
    res.status(500).json({ error: 'Failed to fetch mahasiswa data' });
  }
});

// Route POST /mahasiswa - Menambah data mahasiswa baru
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const mahasiswaInput: MahasiswaInput = req.body;
    
    // Validasi input
    if (!mahasiswaInput.nama || !mahasiswaInput.npm || !mahasiswaInput.jurusan || 
        !mahasiswaInput.program_studi || !mahasiswaInput.semester) {
      res.status(400).json({ 
        error: 'Semua field (nama, npm, jurusan, program_studi, semester) harus diisi' 
      });
      return;
    }

    // Cek apakah NPM sudah ada
    const mahasiswaRef = ref(database, 'mahasiswa');
    const npmQuery = query(mahasiswaRef, orderByChild('npm'), equalTo(mahasiswaInput.npm));
    const existingSnapshot = await get(npmQuery);
    
    if (existingSnapshot.exists()) {
      res.status(409).json({ 
        error: 'NPM sudah terdaftar, gunakan NPM yang berbeda' 
      });
      return;
    }

    // Buat data mahasiswa baru
    const newMahasiswa: Omit<Mahasiswa, 'id'> = {
      ...mahasiswaInput,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Push data ke Firebase
    const newMahasiswaRef = push(mahasiswaRef);
    await set(newMahasiswaRef, newMahasiswa);

    // Return data yang baru dibuat
    const createdMahasiswa: Mahasiswa = {
      id: newMahasiswaRef.key!,
      ...newMahasiswa
    };

    res.status(201).json({
      message: 'Mahasiswa berhasil ditambahkan',
      data: createdMahasiswa
    });
  } catch (error) {
    console.error('Error creating mahasiswa:', error);
    res.status(500).json({ error: 'Failed to create mahasiswa' });
  }
});

// Route GET /mahasiswa/:id - Mengambil data mahasiswa berdasarkan ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const mahasiswaRef = ref(database, `mahasiswa/${id}`);
    const snapshot = await get(mahasiswaRef);
    
    if (snapshot.exists()) {
      const mahasiswa: Mahasiswa = {
        id: id,
        ...snapshot.val()
      };
      res.json(mahasiswa);
    } else {
      res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error fetching mahasiswa:', error);
    res.status(500).json({ error: 'Failed to fetch mahasiswa data' });
  }
});

// Route PUT /mahasiswa/:id - Mengupdate data mahasiswa
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const mahasiswaInput: MahasiswaInput = req.body;
    
    if (!mahasiswaInput.nama || !mahasiswaInput.npm || !mahasiswaInput.jurusan || 
        !mahasiswaInput.program_studi || !mahasiswaInput.semester) {
      res.status(400).json({ 
        error: 'Semua field (nama, npm, jurusan, program_studi, semester) harus diisi' 
      });
      return;
    }

    // Cek apakah mahasiswa dengan ID tersebut ada
    const mahasiswaRef = ref(database, `mahasiswa/${id}`);
    const snapshot = await get(mahasiswaRef);
    
    if (!snapshot.exists()) {
      res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
      return;
    }

    // Cek apakah NPM sudah digunakan oleh mahasiswa lain
    const allMahasiswaRef = ref(database, 'mahasiswa');
    const npmQuery = query(allMahasiswaRef, orderByChild('npm'), equalTo(mahasiswaInput.npm));
    const existingSnapshot = await get(npmQuery);
    
    if (existingSnapshot.exists()) {
      const existingData = existingSnapshot.val();
      const existingKey = Object.keys(existingData)[0];
      // Jika NPM sudah ada dan bukan milik mahasiswa yang sedang diupdate
      if (existingKey !== id) {
        res.status(409).json({ 
          error: 'NPM sudah digunakan oleh mahasiswa lain' 
        });
        return;
      }
    }

    // Update data
    const updatedData = {
      ...mahasiswaInput,
      updated_at: new Date().toISOString()
    };

    await update(mahasiswaRef, updatedData);

    // Get updated data
    const updatedSnapshot = await get(mahasiswaRef);
    const updatedMahasiswa: Mahasiswa = {
      id: id,
      ...updatedSnapshot.val()
    };

    res.json({
      message: 'Data mahasiswa berhasil diupdate',
      data: updatedMahasiswa
    });
  } catch (error) {
    console.error('Error updating mahasiswa:', error);
    res.status(500).json({ error: 'Failed to update mahasiswa' });
  }
});

// Route DELETE /mahasiswa/:id - Menghapus data mahasiswa
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Cek apakah mahasiswa dengan ID tersebut ada
    const mahasiswaRef = ref(database, `mahasiswa/${id}`);
    const snapshot = await get(mahasiswaRef);
    
    if (!snapshot.exists()) {
      res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
      return;
    }

    // Simpan data sebelum dihapus untuk response
    const deletedMahasiswa: Mahasiswa = {
      id: id,
      ...snapshot.val()
    };

    // Hapus data
    await remove(mahasiswaRef);

    res.json({
      message: 'Mahasiswa berhasil dihapus',
      data: deletedMahasiswa
    });
  } catch (error) {
    console.error('Error deleting mahasiswa:', error);
    res.status(500).json({ error: 'Failed to delete mahasiswa' });
  }
});

export default router;