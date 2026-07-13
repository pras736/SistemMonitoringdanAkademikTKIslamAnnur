import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Icons } from '../Icons';
import defaultAvatar from '../../assets/teacher_avatar.png';
import logoTK from '../../assets/logo_tk.png';

// ─────────────────────────────────────────────
// Help content: keyed by role → path → page guide
// Each page has: title, desc, features[], steps[]
// ─────────────────────────────────────────────
const HELP_CONTENT = {
  admin: {
    '/admin/dashboard': {
      title: 'Dashboard Admin',
      desc: 'Pusat informasi ringkasan sistem.',
      features: [
        { icon: '📊', label: 'Statistik Total', desc: 'Lihat jumlah siswa, guru, kelas, dan pengguna aktif secara real-time.' },
        { icon: '💳', label: 'SPP Menunggu', desc: 'Pantau pembayaran SPP yang menunggu verifikasi dari wali murid.' },
        { icon: '👥', label: 'Pengguna Terbaru', desc: 'Daftar 5 akun terbaru yang baru terdaftar di sistem.' },
      ],
      steps: [
        'Buka halaman Dashboard — statistik total (siswa, guru, kelas, pengguna) langsung tampil di bagian atas.',
        'Lihat bagian "Menunggu Verifikasi SPP" untuk melihat jumlah pembayaran yang perlu diproses.',
        'Scroll ke bawah untuk melihat daftar 5 pengguna terbaru yang mendaftar di sistem.',
        'Klik tombol "Kelola User Murid" atau "Kelola User Guru" untuk langsung menuju halaman pengelolaan.',
        'Jika ada SPP menunggu, klik "Verifikasi Sekarang" untuk langsung ke halaman verifikasi.',
      ],
    },
    '/admin/kelola-guru': {
      title: 'Kelola Data Guru',
      desc: 'Manajemen akun dan data seluruh guru.',
      features: [
        { icon: '➕', label: 'Tambah Guru', desc: 'Buat akun login baru beserta profil guru (NIP, no. telp, kelas).' },
        { icon: '✏️', label: 'Edit Data', desc: 'Perbarui informasi guru termasuk reset password jika diperlukan.' },
        { icon: '🗑️', label: 'Hapus Guru', desc: 'Menghapus guru akan otomatis menghapus akun login terkait.' },
        { icon: '🔍', label: 'Pencarian', desc: 'Cari guru berdasarkan nama atau kelas yang diampu.' },
      ],
      steps: [
        'Klik tombol "Tambah Guru" di bagian atas halaman.',
        'Isi formulir: username, password, nama guru, NIP (opsional), nomor telepon, dan pilih kelas.',
        'Klik "Simpan" — akun login guru otomatis terbuat dan guru bisa langsung login.',
        'Untuk mengedit, klik ikon pensil (✏️) pada baris guru yang ingin diubah.',
        'Untuk menghapus, klik ikon hapus (🗑️) — konfirmasi akan muncul sebelum data terhapus.',
        'Gunakan kolom pencarian di atas tabel untuk mencari guru berdasarkan nama.',
      ],
    },
    '/admin/kelola-siswa': {
      title: 'Kelola Data Siswa',
      desc: 'Manajemen data siswa dan akun wali murid.',
      features: [
        { icon: '➕', label: 'Tambah Siswa', desc: 'Menambah siswa otomatis membuat akun wali murid dan 12 tagihan SPP setahun.' },
        { icon: '✏️', label: 'Edit Siswa', desc: 'Perbarui data siswa lengkap termasuk data orang tua.' },
        { icon: '📤', label: 'Export CSV', desc: 'Unduh seluruh data siswa dalam format CSV siap cetak.' },
        { icon: '🔍', label: 'Pencarian', desc: 'Cari siswa berdasarkan nama atau kelas.' },
      ],
      steps: [
        'Klik tombol "Tambah Siswa" untuk membuka formulir pendaftaran.',
        'Isi data siswa: nama lengkap, nama panggilan, jenis kelamin, NISN, dan pilih kelas.',
        'Isi data orang tua: username & password akun wali, nama ayah, dan nama ibu.',
        'Klik "Simpan" — sistem otomatis membuat akun wali murid + 12 tagihan SPP untuk setahun.',
        'Untuk mengedit, klik ikon pensil (✏️) pada baris siswa.',
        'Klik "Export CSV" untuk mengunduh seluruh data siswa beserta data orang tua dalam file Excel.',
        'Gunakan kolom pencarian untuk filter siswa berdasarkan nama.',
      ],
    },
    '/admin/kelola-kelas': {
      title: 'Kelola Kelas',
      desc: 'Manajemen data kelas dan tahun ajaran.',
      features: [
        { icon: '➕', label: 'Tambah Kelas', desc: 'Buat kelas baru dengan nama, tahun ajaran, dan kapasitas.' },
        { icon: '✏️', label: 'Edit Kelas', desc: 'Perbarui informasi kelas yang sudah ada.' },
        { icon: '🗑️', label: 'Hapus Kelas', desc: 'Hapus kelas yang sudah tidak digunakan.' },
      ],
      steps: [
        'Klik tombol "Tambah Kelas" di bagian atas.',
        'Isi nama kelas (contoh: "TK A1"), tahun ajaran (contoh: "2026/2027"), dan kapasitas murid.',
        'Klik "Simpan" untuk menyimpan kelas baru.',
        'Untuk mengedit, klik ikon pensil (✏️) pada baris kelas.',
        'Untuk menghapus, klik ikon hapus (🗑️) — pastikan kelas sudah tidak memiliki siswa.',
      ],
    },
    '/admin/verifikasi-spp': {
      title: 'Verifikasi SPP',
      desc: 'Proses verifikasi pembayaran SPP dari wali murid.',
      features: [
        { icon: '🔍', label: 'Cari Siswa', desc: 'Cari pembayaran berdasarkan nama anak untuk mempercepat verifikasi.' },
        { icon: '🖼️', label: 'Bukti Transfer', desc: 'Klik tombol mata untuk melihat foto bukti transfer yang dikirim wali.' },
        { icon: '✅', label: 'Setujui', desc: 'Tandai pembayaran sebagai "Lunas" jika bukti transfer valid.' },
        { icon: '❌', label: 'Tolak', desc: 'Tolak pembayaran jika bukti tidak valid atau tidak sesuai.' },
      ],
      steps: [
        'Halaman menampilkan daftar SPP berstatus "Menunggu Verifikasi".',
        'Gunakan kolom pencarian untuk mencari berdasarkan nama anak.',
        'Klik ikon mata (👁️) pada kolom "Bukti" untuk melihat foto bukti transfer.',
        'Periksa apakah nominal dan nama pengirim sesuai.',
        'Klik tombol "Setujui" (✅) jika valid — status berubah menjadi "Lunas".',
        'Klik tombol "Tolak" (❌) jika tidak valid — wali murid bisa upload ulang.',
      ],
    },
  },
  guru: {
    '/guru/dashboard': {
      title: 'Dashboard Guru',
      desc: 'Ringkasan aktivitas dan informasi kelas.',
      features: [
        { icon: '🏫', label: 'Info Kelas', desc: 'Lihat nama kelas dan jumlah siswa yang Anda ampu.' },
        { icon: '📅', label: 'Absensi Hari Ini', desc: 'Ringkasan kehadiran siswa untuk hari ini.' },
        { icon: '📋', label: 'Aktivitas Terbaru', desc: 'Catatan mengaji dan perkembangan yang baru diinput.' },
      ],
      steps: [
        'Buka Dashboard untuk melihat ringkasan kelas dan jumlah siswa Anda.',
        'Lihat statistik absensi hari ini di bagian kartu informasi atas.',
        'Scroll ke bawah untuk melihat daftar siswa di kelas Anda.',
        'Gunakan menu sidebar untuk berpindah ke fitur lain (Absensi, Perkembangan, dll).',
      ],
    },
    '/guru/absensi': {
      title: 'Kelola Absensi',
      desc: 'Input dan kelola kehadiran siswa harian.',
      features: [
        { icon: '📅', label: 'Pilih Tanggal', desc: 'Pilih tanggal untuk melihat atau mengisi absensi hari tersebut.' },
        { icon: '✅', label: 'Status Kehadiran', desc: 'Tandai setiap siswa: Hadir, Sakit, Izin, atau Alfa.' },
        { icon: '📝', label: 'Keterangan', desc: 'Tambahkan catatan keterangan untuk siswa yang tidak hadir.' },
        { icon: '💾', label: 'Simpan', desc: 'Absensi yang sudah ada akan diperbarui otomatis (tidak duplikat).' },
      ],
      steps: [
        'Pilih tanggal absensi menggunakan pemilih tanggal di bagian atas.',
        'Daftar siswa di kelas Anda akan tampil otomatis.',
        'Untuk setiap siswa, pilih status: Hadir, Sakit, Izin, atau Alfa.',
        'Jika siswa tidak hadir, isi kolom "Keterangan" dengan alasan (opsional).',
        'Klik tombol "Simpan Absensi" di bagian bawah.',
        'Jika tanggal sudah pernah diisi, data lama akan diperbarui otomatis (tidak duplikat).',
      ],
    },
    '/guru/perkembangan': {
      title: 'Perkembangan Akademik (Calistung)',
      desc: 'Input laporan perkembangan mingguan tiap siswa.',
      features: [
        { icon: '📖', label: 'Membaca', desc: 'Catat tingkat kemampuan membaca siswa (Belum Bisa / Bisa / Lancar).' },
        { icon: '🔢', label: 'Berhitung', desc: 'Catat kemampuan berhitung siswa.' },
        { icon: '✍️', label: 'Menulis', desc: 'Catat kemampuan menulis siswa.' },
        { icon: '🔔', label: 'Notifikasi Otomatis', desc: 'Setelah simpan, orang tua otomatis mendapat notifikasi laporan baru.' },
      ],
      steps: [
        'Pilih minggu ke berapa, bulan, dan tahun laporan yang ingin diinput.',
        'Klik "Tampilkan" untuk melihat data yang sudah ada (jika ada).',
        'Pilih siswa dari daftar untuk mengisi laporan perkembangan.',
        'Isi penilaian: Membaca, Berhitung, dan Menulis dengan pilihan yang tersedia.',
        'Tambahkan catatan tambahan di kolom "Catatan" (opsional).',
        'Klik "Simpan" — orang tua otomatis mendapat notifikasi bahwa ada laporan baru.',
        'Data yang sudah ada untuk kombinasi siswa+minggu+bulan+tahun yang sama akan diperbarui.',
      ],
    },
    '/guru/mengaji': {
      title: 'Catatan Mengaji',
      desc: 'Rekam perkembangan mengaji (Iqra/Al-Qur\'an) tiap siswa.',
      features: [
        { icon: '📖', label: 'Input Catatan', desc: 'Catat halaman dan progress mengaji siswa (contoh: Iqra 3 Hal. 12).' },
        { icon: '📅', label: 'Tanggal Otomatis', desc: 'Tanggal hari ini dipakai secara default, bisa diubah.' },
        { icon: '🔔', label: 'Notifikasi Otomatis', desc: 'Orang tua otomatis mendapat notifikasi setelah input disimpan.' },
      ],
      steps: [
        'Pilih siswa dari dropdown daftar siswa kelas Anda.',
        'Isi catatan mengaji, contoh: "Iqra 3 Halaman 15" atau "Al-Qur\'an Juz 1 Hal. 5".',
        'Pilih tanggal (default: hari ini, bisa diubah ke tanggal lain).',
        'Klik "Simpan" untuk menyimpan catatan.',
        'Orang tua akan otomatis mendapat notifikasi bahwa ada catatan mengaji baru.',
        'Riwayat catatan mengaji tampil di tabel bawah, diurutkan dari yang terbaru.',
      ],
    },
    '/guru/kegiatan': {
      title: 'Kegiatan Luar Sekolah',
      desc: 'Kelola informasi kegiatan ekstrakurikuler dan event sekolah.',
      features: [
        { icon: '➕', label: 'Tambah Kegiatan', desc: 'Input judul, deskripsi, tanggal, dan foto kegiatan sekolah.' },
        { icon: '🖼️', label: 'Upload Foto', desc: 'Sertakan foto kegiatan agar tampil menarik di halaman orang tua.' },
        { icon: '🔔', label: 'Notifikasi Massal', desc: 'Semua orang tua otomatis diberitahu saat kegiatan baru ditambahkan.' },
        { icon: '🗑️', label: 'Hapus Kegiatan', desc: 'Hapus kegiatan beserta foto yang sudah tidak relevan.' },
      ],
      steps: [
        'Klik tombol "Tambah Kegiatan" di bagian atas.',
        'Isi judul kegiatan (contoh: "Kunjungan Wisata ke Kebun Binatang").',
        'Tulis deskripsi lengkap kegiatan di kolom deskripsi.',
        'Pilih tanggal pelaksanaan kegiatan.',
        'Upload foto dokumentasi kegiatan (opsional, maks 2MB, format JPG/PNG).',
        'Klik "Simpan" — semua orang tua otomatis mendapat notifikasi tentang kegiatan baru.',
        'Untuk menghapus kegiatan, klik ikon hapus (🗑️) pada kartu kegiatan.',
      ],
    },
  },
  orangtua: {
    '/orangtua/dashboard': {
      title: 'Dashboard Orang Tua',
      desc: 'Informasi perkembangan anak Anda secara keseluruhan.',
      features: [
        { icon: '👦', label: 'Info Anak', desc: 'Lihat nama, kelas, dan data dasar anak Anda.' },
        { icon: '📊', label: 'Ringkasan Absensi', desc: 'Statistik kehadiran anak selama periode berjalan.' },
        { icon: '💳', label: 'Status SPP', desc: 'Cek tagihan SPP yang belum atau sudah lunas.' },
        { icon: '📋', label: 'Perkembangan Terbaru', desc: 'Laporan Calistung dan catatan mengaji terbaru dari guru.' },
      ],
      steps: [
        'Buka Dashboard untuk melihat ringkasan lengkap perkembangan anak Anda.',
        'Lihat kartu informasi di atas: nama anak, kelas, dan status kehadiran.',
        'Periksa status SPP — apakah ada tagihan yang belum lunas.',
        'Scroll ke bawah untuk melihat perkembangan akademik dan catatan mengaji terbaru.',
        'Gunakan menu sidebar untuk mengakses halaman lainnya.',
      ],
    },
    '/orangtua/profil-anak': {
      title: 'Profil Anak',
      desc: 'Data lengkap dan informasi pribadi anak.',
      features: [
        { icon: '👤', label: 'Data Pribadi', desc: 'Lihat dan perbarui informasi dasar anak (TTL, agama, dll).' },
        { icon: '🏠', label: 'Alamat', desc: 'Perbarui alamat lengkap dan nomor telepon orang tua.' },
        { icon: '📋', label: 'Data Tambahan', desc: 'Isi hobi, cita-cita, golongan darah, dan data kesehatan anak.' },
        { icon: '💾', label: 'Simpan Perubahan', desc: 'Semua perubahan langsung tersimpan ke database sekolah.' },
      ],
      steps: [
        'Buka halaman Profil Anak dari menu sidebar.',
        'Di tab "Data Pribadi", perbarui nama panggilan, tempat/tanggal lahir, agama, dan kewarganegaraan.',
        'Pindah ke tab "Alamat" untuk mengisi alamat lengkap dan nomor telepon orang tua.',
        'Di tab "Data Tambahan", isi hobi, cita-cita, golongan darah, berat/tinggi badan, dan riwayat imunisasi.',
        'Di tab "Data Orang Tua", lengkapi data ayah dan ibu (NIK, pendidikan, pekerjaan, dll).',
        'Klik "Simpan Perubahan" — data langsung tersimpan ke database sekolah.',
      ],
    },
    '/orangtua/perkembangan': {
      title: 'Perkembangan Akademik',
      desc: 'Laporan perkembangan Calistung anak dari guru.',
      features: [
        { icon: '📖', label: 'Laporan Mingguan', desc: 'Lihat nilai membaca, berhitung, dan menulis per minggu.' },
        { icon: '📅', label: 'Riwayat Lengkap', desc: 'Semua laporan tersimpan dan bisa dilihat kapan saja.' },
        { icon: '📝', label: 'Catatan Guru', desc: 'Baca catatan dan komentar dari guru untuk anak Anda.' },
      ],
      steps: [
        'Buka halaman "Perkembangan" dari menu sidebar.',
        'Laporan akan tampil berurutan dari yang terbaru.',
        'Setiap kartu laporan menampilkan: minggu ke, bulan/tahun, dan penilaian Membaca, Berhitung, Menulis.',
        'Baca kolom "Catatan" untuk komentar tambahan dari guru.',
        'Anda akan mendapat notifikasi otomatis setiap kali guru menginput laporan baru.',
      ],
    },
    '/orangtua/mengaji': {
      title: 'Catatan Mengaji',
      desc: 'Rekam jejak perkembangan mengaji anak.',
      features: [
        { icon: '📖', label: 'Progress Iqra', desc: 'Lihat catatan halaman dan buku Iqra/Al-Qur\'an yang sedang dipelajari.' },
        { icon: '📅', label: 'Riwayat Tanggal', desc: 'Semua catatan disusun berdasarkan tanggal terbaru.' },
      ],
      steps: [
        'Buka halaman "Mengaji" dari menu sidebar.',
        'Daftar catatan mengaji akan tampil berurutan dari yang terbaru.',
        'Setiap catatan menampilkan: tanggal, dan isi catatan guru (contoh: "Iqra 3 Halaman 15").',
        'Anda akan mendapat notifikasi otomatis setiap kali guru menginput catatan mengaji baru.',
      ],
    },
    '/orangtua/absensi': {
      title: 'Absensi Anak',
      desc: 'Rekap kehadiran anak di sekolah.',
      features: [
        { icon: '✅', label: 'Status Harian', desc: 'Lihat status kehadiran: Hadir, Sakit, Izin, atau Alfa.' },
        { icon: '📝', label: 'Keterangan', desc: 'Baca keterangan yang diberikan guru untuk ketidakhadiran.' },
        { icon: '📅', label: 'Riwayat Lengkap', desc: 'Semua data absensi selama satu tahun ajaran tersimpan.' },
      ],
      steps: [
        'Buka halaman "Absensi" dari menu sidebar.',
        'Tabel absensi menampilkan seluruh rekap kehadiran anak dari yang terbaru.',
        'Kolom "Status" menunjukkan: Hadir (hijau), Sakit (kuning), Izin (biru), atau Alfa (merah).',
        'Kolom "Keterangan" berisi catatan dari guru jika anak tidak hadir.',
        'Data absensi sepanjang tahun ajaran tersimpan dan bisa dilihat kapan saja.',
      ],
    },
    '/orangtua/kegiatan': {
      title: 'Kegiatan Sekolah',
      desc: 'Informasi kegiatan dan event sekolah.',
      features: [
        { icon: '🎉', label: 'Daftar Kegiatan', desc: 'Lihat seluruh kegiatan luar sekolah yang diposting guru.' },
        { icon: '🖼️', label: 'Foto Kegiatan', desc: 'Lihat dokumentasi foto dari setiap kegiatan sekolah.' },
      ],
      steps: [
        'Buka halaman "Kegiatan" dari menu sidebar.',
        'Seluruh kegiatan luar sekolah tampil sebagai kartu, diurutkan dari yang terbaru.',
        'Setiap kartu menampilkan: judul kegiatan, tanggal, deskripsi, dan foto (jika ada).',
        'Anda akan mendapat notifikasi otomatis setiap kali ada kegiatan baru ditambahkan.',
      ],
    },
    '/orangtua/spp': {
      title: 'Pembayaran SPP',
      desc: 'Kelola tagihan dan pembayaran SPP bulanan.',
      features: [
        { icon: '💳', label: 'Status Tagihan', desc: 'Lihat status tiap bulan: Belum Lunas, Menunggu Verifikasi, atau Lunas.' },
        { icon: '📤', label: 'Upload Bukti', desc: 'Upload foto bukti transfer untuk mengajukan verifikasi pembayaran.' },
        { icon: '⏳', label: 'Proses Verifikasi', desc: 'Setelah upload, admin akan memverifikasi dalam 1×24 jam.' },
        { icon: '🔔', label: 'Notifikasi', desc: 'Admin mendapat notifikasi otomatis setiap Anda mengunggah bukti bayar.' },
      ],
      steps: [
        'Buka halaman "SPP" dari menu sidebar.',
        'Pilih tahun ajaran dari dropdown untuk melihat tagihan 12 bulan.',
        'Lihat status tiap bulan: "Belum Lunas" (merah), "Menunggu Verifikasi" (kuning), atau "Lunas" (hijau).',
        'Untuk membayar, klik tombol "Upload Bukti" pada bulan yang ingin dibayar.',
        'Pilih foto bukti transfer dari galeri (format JPG/PNG, maks 2MB).',
        'Setelah upload, status berubah menjadi "Menunggu Verifikasi".',
        'Admin akan memverifikasi dan status berubah menjadi "Lunas" jika valid.',
        'Admin mendapat notifikasi otomatis setiap Anda mengunggah bukti bayar.',
      ],
    },
  },
};

export const Layout = ({ role = 'guru', navItems, userAvatar, userName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(() => {
    return localStorage.getItem('profilePhoto') || userAvatar || defaultAvatar;
  });

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (role !== 'guru') {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [role]);

  const handleMarkAsRead = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.post(`http://127.0.0.1:8000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n.id_notification === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await axios.post('http://127.0.0.1:8000/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const foto = res.data.user?.foto_profil;
        if (foto) {
          const fullUrl = `http://127.0.0.1:8000/storage/${foto}`;
          setProfilePhoto(fullUrl);
          localStorage.setItem('profilePhoto', fullUrl);
        } else {
          // Check if there is a base64 photo to migrate to the database
          const localPhoto = localStorage.getItem('profilePhoto');
          if (localPhoto && localPhoto.startsWith('data:image/')) {
            try {
              const response = await fetch(localPhoto);
              const blob = await response.blob();
              const file = new File([blob], 'profile.png', { type: blob.type });
              const formData = new FormData();
              formData.append('foto_profil', file);

              const uploadRes = await axios.post('http://127.0.0.1:8000/api/user/profile-photo', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${token}`
                }
              });
              const fotoPath = uploadRes.data.foto_profil;
              const fullUrl = `http://127.0.0.1:8000/storage/${fotoPath}`;
              setProfilePhoto(fullUrl);
              localStorage.setItem('profilePhoto', fullUrl);
            } catch (uploadErr) {
              console.error('Failed to migrate local profile photo:', uploadErr);
            }
          } else {
            // No photo in db and no base64 in local storage
            setProfilePhoto(userAvatar || defaultAvatar);
            localStorage.removeItem('profilePhoto');
          }
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('profilePhoto');
    if (stored) setProfilePhoto(stored);
    else if (userAvatar) setProfilePhoto(userAvatar);
  }, [userAvatar]);

  const handleLogout = () => {
    localStorage.removeItem('profilePhoto');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfilePhoto(ev.target.result);
    };
    reader.readAsDataURL(file);

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('foto_profil', file);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/user/profile-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      const fotoPath = res.data.foto_profil;
      const fullUrl = `http://127.0.0.1:8000/storage/${fotoPath}`;
      setProfilePhoto(fullUrl);
      localStorage.setItem('profilePhoto', fullUrl);
      setShowSettings(false);
    } catch (err) {
      console.error('Gagal mengunggah foto profil:', err);
      alert('Gagal mengunggah foto profil. Silakan coba lagi.');
    }
  };

  return (
    <div className="flex min-h-screen bg-tk-bg text-tk-text">
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={() => setShowSettings(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-5 w-[320px] z-10" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-tk-primary m-0">Ubah Foto Profil</h3>
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-tk-border shadow-md transition-all duration-200 group-hover:brightness-75"
              />
              <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                <span className="text-white text-sm font-semibold bg-black/50 px-3 py-1 rounded-full">Ganti Foto</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-tk-primary text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-tk-primary-light transition-colors"
            >
              Pilih Foto
            </button>
            <button
              onClick={() => setShowSettings(false)}
              className="text-tk-muted text-sm hover:text-tk-text transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-[260px] bg-tk-card border-r border-tk-border flex flex-col p-6 shrink-0 sticky top-0 h-screen box-border">
        <div className="mb-10 px-2">
          <div className="flex items-center gap-3">
            <img src={logoTK} alt="Logo TK Islam An Nur" className="w-10 h-10 rounded-md object-cover shrink-0" />
            <div className="flex flex-col">
              <span className="font-bold text-[1.05rem] text-tk-primary">TK Islam Annur</span>
              <span className="text-xs text-tk-muted">Sistem Monitoring & Akademik</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1">
          <ul className="flex flex-col gap-2">
            {navItems.map(item => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  end
                  className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-md font-semibold text-[0.95rem] transition-all duration-200 cursor-pointer ${isActive ? 'bg-tk-secondary-light text-tk-primary' : 'text-tk-muted hover:bg-tk-secondary-light hover:text-tk-primary'}`}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto pt-6 border-t border-tk-border flex flex-col gap-2">
          <button
            onClick={() => setShowHelp(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md font-semibold text-[0.95rem] text-tk-muted hover:bg-tk-secondary-light hover:text-tk-primary transition-all duration-200 cursor-pointer"
          >
            <Icons.Help />
            <span>Panduan Halaman</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md font-semibold text-[0.95rem] text-tk-muted hover:bg-tk-secondary-light hover:text-tk-primary transition-all duration-200 cursor-pointer" onClick={handleLogout}>
            <Icons.Logout />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Global Header */}
        <header className="h-[72px] bg-tk-card border-b border-tk-border flex justify-between items-center px-10 sticky top-0 z-50">
          <h2 className="text-xl font-bold text-tk-primary m-0">TK Islam Annur</h2>
          <div className="flex items-center gap-4">
            {role !== 'guru' && (() => {
              const unreadCount = notifications.filter(n => !n.is_read).length;
              return (
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative w-10 h-10 rounded-full flex items-center justify-center bg-transparent text-tk-muted transition-all duration-200 hover:bg-tk-bg hover:text-tk-primary cursor-pointer border-none"
                  >
                    <Icons.Bell />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 bg-red-600 text-white text-[0.65rem] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                      <div className="absolute right-0 mt-2 w-80 bg-white border border-tk-border rounded-xl shadow-xl z-50 flex flex-col max-h-[400px]">
                        <div className="p-4 border-b border-tk-border flex justify-between items-center bg-tk-bg/30 rounded-t-xl">
                          <span className="font-bold text-sm text-tk-primary">Notifikasi</span>
                          {unreadCount > 0 && (
                            <button
                              onClick={handleMarkAllAsRead}
                              className="text-xs text-tk-primary hover:underline font-semibold bg-transparent border-0 cursor-pointer p-0"
                            >
                              Tandai Semua Dibaca
                            </button>
                          )}
                        </div>
                        
                        <div className="overflow-y-auto flex-1 flex flex-col">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center text-tk-muted text-xs font-semibold">
                              Tidak ada notifikasi
                            </div>
                          ) : (
                            notifications.map(n => (
                              <div
                                key={n.id_notification}
                                onClick={() => handleMarkAsRead(n.id_notification)}
                                className={`p-4 border-b border-tk-border/60 flex flex-col gap-1 transition-colors cursor-pointer text-left ${!n.is_read ? 'bg-tk-secondary-light/20 hover:bg-tk-secondary-light/35' : 'hover:bg-tk-bg/50'}`}
                              >
                                <div className="flex justify-between items-center">
                                  <span className={`text-xs font-bold ${!n.is_read ? 'text-tk-primary' : 'text-tk-text'}`}>{n.title}</span>
                                  {!n.is_read && <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0" />}
                                </div>
                                <p className="text-[0.75rem] text-tk-muted m-0 leading-relaxed font-medium">{n.message}</p>
                                <span className="text-[0.6rem] text-tk-muted mt-0.5">{new Date(n.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })()}
            <button
              title="Ubah Foto Profil"
              onClick={() => setShowSettings(true)}
              className="relative w-10 h-10 rounded-full flex items-center justify-center bg-transparent text-tk-muted transition-all duration-200 hover:bg-tk-bg hover:text-tk-primary"
            >
              <Icons.Settings />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="group cursor-pointer border-none bg-transparent p-0 rounded-full"
              title="Ubah Foto Profil"
            >
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-tk-border transition-all duration-200 group-hover:opacity-80 group-hover:border-tk-primary"
              />
            </button>
          </div>
        </header>

        {/* Page Content injected via Outlet */}
        <div className="p-10 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
      {/* ── Help Panel ── */}
      {showHelp && (() => {
        const roleKey = role === 'orangtua' ? 'orangtua' : role;
        const pageGuide = HELP_CONTENT[roleKey]?.[location.pathname];
        const roleLabel = role === 'admin' ? 'Administrator' : role === 'guru' ? 'Guru' : 'Orang Tua';
        return (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm"
              onClick={() => setShowHelp(false)}
            />
            {/* Slide-in Panel */}
            <div
              className="fixed left-[260px] top-0 h-screen w-[360px] z-[100] flex flex-col shadow-2xl"
              style={{ animation: 'slideInFromLeft 0.25s cubic-bezier(.4,0,.2,1)' }}
            >
              {/* Panel Header */}
              <div className="bg-gradient-to-br from-tk-primary to-tk-primary-light p-6 flex flex-col gap-1 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💡</span>
                    <span className="font-bold text-white text-lg">Panduan Halaman</span>
                  </div>
                  <button
                    onClick={() => setShowHelp(false)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors border-none cursor-pointer text-xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <span className="text-white/70 text-xs font-medium mt-1">Anda login sebagai <strong className="text-white">{roleLabel}</strong></span>
              </div>

              {/* Panel Body */}
              <div className="flex-1 overflow-y-auto bg-white">
                {pageGuide ? (
                  <div className="p-6 flex flex-col gap-5">
                    {/* Page title */}
                    <div className="flex flex-col gap-1 pb-4 border-b border-tk-border">
                      <h3 className="text-tk-primary font-bold text-base m-0">{pageGuide.title}</h3>
                      <p className="text-tk-muted text-sm m-0">{pageGuide.desc}</p>
                    </div>

                    {/* Feature list */}
                    <div className="flex flex-col gap-3">
                      <span className="text-xs font-bold text-tk-muted uppercase tracking-wider">Fungsi di Halaman Ini</span>
                      {pageGuide.features.map((f, i) => (
                        <div
                          key={i}
                          className="flex gap-3 p-3 rounded-xl bg-tk-bg/60 border border-tk-border hover:border-tk-primary/30 transition-colors"
                        >
                          <span className="text-2xl shrink-0 mt-0.5">{f.icon}</span>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-sm text-tk-text">{f.label}</span>
                            <span className="text-xs text-tk-muted leading-relaxed">{f.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cara Penggunaan */}
                    {pageGuide.steps && pageGuide.steps.length > 0 && (
                      <div className="flex flex-col gap-3 pt-2">
                        <span className="text-xs font-bold text-tk-muted uppercase tracking-wider">Cara Penggunaan</span>
                        <div className="flex flex-col gap-0 rounded-xl border border-tk-border overflow-hidden">
                          {pageGuide.steps.map((step, i) => (
                            <div
                              key={i}
                              className={`flex gap-3 px-4 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-tk-bg/40'} ${i < pageGuide.steps.length - 1 ? 'border-b border-tk-border/60' : ''}`}
                            >
                              <span className="w-6 h-6 rounded-full bg-tk-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <span className="text-sm text-tk-text leading-relaxed">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // No specific guide for current page
                  <div className="p-6 flex flex-col items-center justify-center gap-4 text-center h-full min-h-[300px]">
                    <span className="text-5xl">🗺️</span>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-tk-text text-sm">Panduan Tidak Tersedia</span>
                      <span className="text-tk-muted text-xs">Belum ada panduan khusus untuk halaman ini.</span>
                    </div>
                  </div>
                )}

                {/* Quick nav */}
                <div className="px-6 pb-6 flex flex-col gap-3">
                  <span className="text-xs font-bold text-tk-muted uppercase tracking-wider">Halaman Lainnya</span>
                  {Object.entries(HELP_CONTENT[roleKey] || {}).map(([path, page]) => (
                    <button
                      key={path}
                      onClick={() => { navigate(path); setShowHelp(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 border cursor-pointer ${
                        location.pathname === path
                          ? 'bg-tk-secondary-light text-tk-primary border-tk-primary/30'
                          : 'bg-transparent text-tk-muted hover:bg-tk-bg border-transparent hover:border-tk-border'
                      }`}
                    >
                      {page.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Panel Footer */}
              <div className="bg-tk-bg border-t border-tk-border p-4 shrink-0">
                <p className="text-xs text-tk-muted text-center m-0">
                  Sistem Monitoring &amp; Akademik · TK Islam Annur
                </p>
              </div>
            </div>

            <style>{`
              @keyframes slideInFromLeft {
                from { transform: translateX(-20px); opacity: 0; }
                to   { transform: translateX(0);     opacity: 1; }
              }
            `}</style>
          </>
        );
      })()}
    </div>
  );
};
