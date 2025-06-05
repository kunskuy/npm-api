// src/types.ts
// Mendefinisikan struktur data objek mahasiswa yang akan digunakan 
// di seluruh aplikasi agar konsisten dan mudah dipahami
export interface Mahasiswa {
  id?: string; // ID unik mahasiswa (Firebase auto-generated key)
  nama: string; // Nama lengkap mahasiswa
  npm: string; // Nomor Pokok Mahasiswa (ID mahasiswa)
  jurusan: string; // Jurusan mahasiswa
  program_studi: string; // Program studi mahasiswa
  semester: number; // Semester saat ini
  created_at?: string; // Timestamp created
  updated_at?: string; // Timestamp updated
}

// Interface untuk request body saat create/update
export interface MahasiswaInput {
  nama: string;
  npm: string;
  jurusan: string;
  program_studi: string;
  semester: number;
}