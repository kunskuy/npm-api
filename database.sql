-- Membuat database bernama db_mahasiswa jika belum ada
CREATE DATABASE IF NOT EXISTS db_mahasiswa;

-- Memilih database db_mahasiswa untuk digunakan
USE db_mahasiswa;

-- Membuat tabel mahasiswa dengan kolom-kolom berikut:
CREATE TABLE mahasiswa (
  id INT AUTO_INCREMENT PRIMARY KEY, -- Kolom id sebagai primary key dengan auto increment (unik dan bertambah otomatis)
  nama VARCHAR(100), -- Kolom nama dengan tipe teks maksimal 100 karakter
  npm VARCHAR(20), -- Kolom npm (nomor pokok mahasiswa) dengan tipe teks maksimal 20 karakter
  jurusan VARCHAR(100), -- Kolom jurusan dengan tipe teks maksimal 100 karakter
  program_studi VARCHAR(100), -- Kolom program studi dengan tipe teks maksimal 100 karakter
  semester INT -- Kolom semester dengan tipe integer (angka)
);

-- Memasukkan 5 data mahasiswa ke tabel mahasiswa
INSERT INTO mahasiswa (nama, npm, jurusan, program_studi, semester) VALUES
('Andi Saputra', '5220411001', 'Teknik Informatika', 'Sistem Informasi', 4),
('Budi Santoso', '5220411002', 'Teknik Informatika', 'Informatika', 6),
('Citra Dewi', '5220411003', 'Ekonomi', 'Manajemen', 2),
('Dewi Lestari', '5220411004', 'Hukum', 'Ilmu Hukum', 8),
('Eka Nugraha', '5220411005', 'Sastra', 'Sastra Inggris', 3);
