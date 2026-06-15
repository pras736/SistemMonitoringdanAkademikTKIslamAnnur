<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Kelas;
use App\Models\Admin;
use App\Models\Guru;
use App\Models\Anak;
use App\Models\OrangTua;
use App\Models\DataAnak;
use App\Models\AlamatAnak;
use App\Models\Nilai;
use App\Models\KartuNgaji;
use App\Models\Spp;
use App\Models\Absensi;
use App\Models\Kegiatan;
use App\Models\PerkembanganAkademik;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Kelas (3 Kelas)
        $kelasA = Kelas::create([
            'nama_kelas' => 'Kelas A (Mawar)',
            'tahun_ajaran' => '2025/2026',
            'kapasitas' => 20,
        ]);

        $kelasB = Kelas::create([
            'nama_kelas' => 'Kelas B (Melati)',
            'tahun_ajaran' => '2025/2026',
            'kapasitas' => 25,
        ]);

        $kelasC = Kelas::create([
            'nama_kelas' => 'Kelas C (Cempaka)',
            'tahun_ajaran' => '2025/2026',
            'kapasitas' => 20,
        ]);

        $classList = [$kelasA, $kelasB, $kelasC];

        // 2. Seed Users
        // Admin
        $userAdmin = User::create([
            'username' => 'admin',
            'email' => 'admin@tkan-nur.com',
            'password_hash' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $adminProfile = Admin::create([
            'id_user' => $userAdmin->id_user,
            'nama_admin' => 'Administrator Utama',
            'no_telp' => '081234567890',
        ]);

        // 3 Staf Guru
        $guruData = [
            [
                'username' => 'guru',
                'email' => 'guru@tkan-nur.com',
                'nama' => 'Ibu Sri Sarah S.Pd.',
                'nip' => '198705122010122003',
                'telp' => '082345678901',
                'kelas' => $kelasA
            ],
            [
                'username' => 'guru2',
                'email' => 'ningsih@tkan-nur.com',
                'nama' => 'Ibu Ningsih Rahayu S.Pd.',
                'nip' => '198908242013092004',
                'telp' => '082345678902',
                'kelas' => $kelasB
            ],
            [
                'username' => 'guru3',
                'email' => 'rahmawati@tkan-nur.com',
                'nama' => 'Ibu Rahmawati S.Pd.',
                'nip' => '199201152016042008',
                'telp' => '082345678903',
                'kelas' => $kelasC
            ],
        ];

        $gurus = [];
        foreach ($guruData as $g) {
            $userG = User::create([
                'username' => $g['username'],
                'email' => $g['email'],
                'password_hash' => Hash::make('password'),
                'role' => 'guru',
                'is_active' => true,
            ]);

            $gurus[] = Guru::create([
                'id_user' => $userG->id_user,
                'id_kelas' => $g['kelas']->id_kelas,
                'nama_guru' => $g['nama'],
                'nip' => $g['nip'],
                'no_telp' => $g['telp'],
            ]);
        }

        // 3. Seed 15 Siswa & Orang Tua
        $studentsData = [
            [
                'nama' => 'Ahmad Rizky Al-Fatih', 'panggilan' => 'Rizky', 'gender' => 'Laki-laki',
                'nisn' => '0123456789', 'nik' => '1471020304050001', 'akte' => 'AKTE-987654',
                't_lahir' => 'Pekanbaru', 'd_lahir' => '2020-05-15',
                'ayah' => 'Bapak Ahmad Hermansyah', 'nik_a' => '1471020304050011', 'pekerjaan_a' => 'Wiraswasta',
                'ibu' => 'Ibu Sarah Aminah', 'nik_i' => '1471020304050012', 'pekerjaan_i' => 'Ibu Rumah Tangga',
                'username' => 'orangtua' // First parent uses 'orangtua' for compatibility
            ],
            [
                'nama' => 'Aisha Zahra Cantika', 'panggilan' => 'Aisha', 'gender' => 'Perempuan',
                'nisn' => '0123456790', 'nik' => '1471020304050002', 'akte' => 'AKTE-987655',
                't_lahir' => 'Pekanbaru', 'd_lahir' => '2020-07-22',
                'ayah' => 'Bapak Budi Santoso', 'nik_a' => '1471020304050021', 'pekerjaan_a' => 'PNS',
                'ibu' => 'Ibu Rina Astuti', 'nik_i' => '1471020304050022', 'pekerjaan_i' => 'Guru',
                'username' => 'orangtua2'
            ],
            [
                'nama' => 'Budi Pratama Wijaya', 'panggilan' => 'Budi', 'gender' => 'Laki-laki',
                'nisn' => '0123456791', 'nik' => '1471020304050003', 'akte' => 'AKTE-987656',
                't_lahir' => 'Pekanbaru', 'd_lahir' => '2020-02-10',
                'ayah' => 'Bapak Joko Wijaya', 'nik_a' => '1471020304050031', 'pekerjaan_a' => 'Karyawan Swasta',
                'ibu' => 'Ibu Maria Ulfa', 'nik_i' => '1471020304050032', 'pekerjaan_i' => 'Bidan',
                'username' => 'orangtua3'
            ],
            [
                'nama' => 'Citra Aulia Rahma', 'panggilan' => 'Citra', 'gender' => 'Perempuan',
                'nisn' => '0123456792', 'nik' => '1471020304050004', 'akte' => 'AKTE-987657',
                't_lahir' => 'Pekanbaru', 'd_lahir' => '2020-11-05',
                'ayah' => 'Bapak Hendra Saputra', 'nik_a' => '1471020304050041', 'pekerjaan_a' => 'Polisi',
                'ibu' => 'Ibu Dewi Lestari', 'nik_i' => '1471020304050042', 'pekerjaan_i' => 'Apoteker',
                'username' => 'orangtua4'
            ],
            [
                'nama' => 'Daffa Al-Ghifari', 'panggilan' => 'Daffa', 'gender' => 'Laki-laki',
                'nisn' => '0123456793', 'nik' => '1471020304050005', 'akte' => 'AKTE-987658',
                't_lahir' => 'Pekanbaru', 'd_lahir' => '2020-09-18',
                'ayah' => 'Bapak Faisal Ghifari', 'nik_a' => '1471020304050051', 'pekerjaan_a' => 'Dosen',
                'ibu' => 'Ibu Yuliana', 'nik_i' => '1471020304050052', 'pekerjaan_i' => 'Penulis',
                'username' => 'orangtua5'
            ],
            [
                'nama' => 'Elvira Salsabila', 'panggilan' => 'Elvira', 'gender' => 'Perempuan',
                'nisn' => '0123456794', 'nik' => '1471020304050006', 'akte' => 'AKTE-987659',
                't_lahir' => 'Pekanbaru', 'd_lahir' => '2020-04-30',
                'ayah' => 'Bapak Ridwan Kamil', 'nik_a' => '1471020304050061', 'pekerjaan_a' => 'Arsitek',
                'ibu' => 'Ibu Atalia', 'nik_i' => '1471020304050062', 'pekerjaan_i' => 'Wirausaha',
                'username' => 'orangtua6'
            ],
            [
                'nama' => 'Fatih Al-Haddad', 'panggilan' => 'Fatih', 'gender' => 'Laki-laki',
                'nisn' => '0123456795', 'nik' => '1471020304050007', 'akte' => 'AKTE-987660',
                't_lahir' => 'Pekanbaru', 'd_lahir' => '2020-01-12',
                'ayah' => 'Bapak Ali Al-Haddad', 'nik_a' => '1471020304050071', 'pekerjaan_a' => 'Pedagang',
                'ibu' => 'Ibu Fatimah', 'nik_i' => '1471020304050072', 'pekerjaan_i' => 'Ibu Rumah Tangga',
                'username' => 'orangtua7'
            ],
            [
                'nama' => 'Ghaisan Rayyan', 'panggilan' => 'Rayyan', 'gender' => 'Laki-laki',
                'nisn' => '0123456796', 'nik' => '1471020304050008', 'akte' => 'AKTE-987661',
                't_lahir' => 'Pekanbaru', 'd_lahir' => '2020-08-08',
                'ayah' => 'Bapak Surya Dharma', 'nik_a' => '1471020304050081', 'pekerjaan_a' => 'Dokter',
                'ibu' => 'Ibu Anita Rahayu', 'nik_i' => '1471020304050082', 'pekerjaan_i' => 'Perawat',
                'username' => 'orangtua8'
            ],
            [
                'nama' => 'Humaira Adiba', 'panggilan' => 'Aira', 'gender' => 'Perempuan',
                'nisn' => '0123456797', 'nik' => '1471020304050009', 'akte' => 'AKTE-987662',
                't_lahir' => 'Pekanbaru', 'd_lahir' => '2020-03-27',
                'ayah' => 'Bapak Taufik Hidayat', 'nik_a' => '1471020304050091', 'pekerjaan_a' => 'Atlet',
                'ibu' => 'Ibu Ami Gumelar', 'nik_i' => '1471020304050092', 'pekerjaan_i' => 'Desainer',
                'username' => 'orangtua9'
            ],
            [
                'nama' => 'Ibrahim Malik', 'panggilan' => 'Ibrahim', 'gender' => 'Laki-laki',
                'nisn' => '0123456798', 'nik' => '1471020304050010', 'akte' => 'AKTE-987663',
                't_lahir' => 'Pekanbaru', 'd_lahir' => '2020-06-14',
                'ayah' => 'Bapak Malik Ibrahim', 'nik_a' => '1471020304050101', 'pekerjaan_a' => 'Penyanyi',
                'ibu' => 'Ibu Kartika', 'nik_i' => '1471020304050102', 'pekerjaan_i' => 'Model',
                'username' => 'orangtua10'
            ],
            [
                'nama' => 'Jasmine Aqila', 'panggilan' => 'Jasmine', 'gender' => 'Perempuan',
                'nisn' => '0123456799', 'nik' => '1471020304050013', 'akte' => 'AKTE-987664',
                't_lahir' => 'Pekanbaru', 'd_lahir' => '2020-10-10',
                'ayah' => 'Bapak Anang Hermansyah', 'nik_a' => '1471020304050111', 'pekerjaan_a' => 'Produser',
                'ibu' => 'Ibu Ashanty', 'nik_i' => '1471020304050112', 'pekerjaan_i' => 'Penyanyi',
                'username' => 'orangtua11'
            ],
            [
                'nama' => 'Kenzo Aditya', 'panggilan' => 'Kenzo', 'gender' => 'Laki-laki',
                'nisn' => '0123456800', 'nik' => '1471020304050014', 'akte' => 'AKTE-987665',
                't_lahir' => 'Pekanbaru', 'd_lahir' => '2020-12-25',
                'ayah' => 'Bapak Baim Wong', 'nik_a' => '1471020304050121', 'pekerjaan_a' => 'Youtuber',
                'ibu' => 'Ibu Paula Verhoeven', 'nik_i' => '1471020304050122', 'pekerjaan_i' => 'Model',
                'username' => 'orangtua12'
            ],
            [
                'nama' => 'Latisha Zahra', 'panggilan' => 'Latisha', 'gender' => 'Perempuan',
                'nisn' => '0123456801', 'nik' => '1471020304050015', 'akte' => 'AKTE-987666',
                't_lahir' => 'Pekanbaru', 'd_lahir' => '2020-02-14',
                'ayah' => 'Bapak Raffi Ahmad', 'nik_a' => '1471020304050131', 'pekerjaan_a' => 'Artis',
                'ibu' => 'Ibu Nagita Slavina', 'nik_i' => '1471020304050132', 'pekerjaan_i' => 'Produser',
                'username' => 'orangtua13'
            ],
            [
                'nama' => 'Muhammad Yusuf', 'panggilan' => 'Yusuf', 'gender' => 'Laki-laki',
                'nisn' => '0123456802', 'nik' => '1471020304050016', 'akte' => 'AKTE-987667',
                't_lahir' => 'Pekanbaru', 'd_lahir' => '2020-03-03',
                'ayah' => 'Bapak Alvin Faiz', 'nik_a' => '1471020304050141', 'pekerjaan_a' => 'Da\'i',
                'ibu' => 'Ibu Larissa Chou', 'nik_i' => '1471020304050142', 'pekerjaan_i' => 'Penulis',
                'username' => 'orangtua14'
            ],
            [
                'nama' => 'Nabila Syafa', 'panggilan' => 'Nabila', 'gender' => 'Perempuan',
                'nisn' => '0123456803', 'nik' => '1471020304050017', 'akte' => 'AKTE-987668',
                't_lahir' => 'Pekanbaru', 'd_lahir' => '2020-05-05',
                'ayah' => 'Bapak Irwansyah', 'nik_a' => '1471020304050151', 'pekerjaan_a' => 'Aktor',
                'ibu' => 'Ibu Zaskia Sungkar', 'nik_i' => '1471020304050152', 'pekerjaan_i' => 'Desainer',
                'username' => 'orangtua15'
            ],
        ];

        foreach ($studentsData as $index => $data) {
            // Pick a class (rotate between A, B, C)
            $class = $classList[$index % 3];
            $guru = $gurus[$index % 3];

            // Create User Ortu
            $uOrtu = User::create([
                'username' => $data['username'],
                'email' => $data['username'] . '@tkan-nur.com',
                'password_hash' => Hash::make('password'),
                'role' => 'orangtua',
                'is_active' => true,
            ]);

            // Create Anak
            $anak = Anak::create([
                'id_kelas' => $class->id_kelas,
                'nisn' => $data['nisn'],
                'nik' => $data['nik'],
                'no_reg_akte' => $data['akte'],
                'nama_lengkap' => $data['nama'],
                'nama_panggilan' => $data['panggilan'],
                'jenis_kelamin' => $data['gender'],
                'tempat_lahir' => $data['t_lahir'],
                'tanggal_lahir' => $data['d_lahir'],
                'agama' => 'Islam',
                'kewarganegaraan' => 'WNI',
            ]);

            // Create OrangTua (Ayah & Ibu)
            OrangTua::create([
                'id_user' => $uOrtu->id_user,
                'id_anak' => $anak->id_anak,
                
                'nama_ayah' => $data['ayah'],
                'nik_ayah' => $data['nik_a'],
                'ttl_ayah' => $data['t_lahir'] . ', 12-08-1985',
                'pendidikan_ayah' => 'S1 / D4',
                'pekerjaan_ayah' => $data['pekerjaan_a'],
                'kantor_ayah' => 'Jl. Sudirman, Pekanbaru',

                'nama_ibu' => $data['ibu'],
                'nik_ibu' => $data['nik_i'],
                'ttl_ibu' => $data['t_lahir'] . ', 25-04-1988',
                'pendidikan_ibu' => 'S1 / D4',
                'pekerjaan_ibu' => $data['pekerjaan_i'],
                'kantor_ibu' => '-',
            ]);

            // Create DataAnak
            DataAnak::create([
                'id_anak' => $anak->id_anak,
                'hobi' => 'Mewarnai & Bermain',
                'cita_cita' => 'Dokter',
                'anak_ke' => ($index % 3) + 1,
                'jumlah_saudara' => 2,
                'golongan_darah' => 'B',
                'berat_badan_kg' => 16.5 + ($index % 4),
                'tinggi_badan_cm' => 105.0 + ($index % 6),
                'lingkar_kepala_cm' => 50.0 + ($index % 3),
                'imunisasi' => 'Lengkap',
            ]);

            // Create AlamatAnak
            AlamatAnak::create([
                'id_anak' => $anak->id_anak,
                'jalan' => 'Jl. Harapan Raya No. ' . ($index + 10),
                'kelurahan' => 'Tangkerang Labuai',
                'kecamatan' => 'Bukit Raya',
                'kota' => 'Pekanbaru',
                'provinsi' => 'Riau',
                'kode_pos' => '28282',
                'jarak_ke_sekolah_km' => 1.2 + ($index * 0.2),
                'telp_ayah' => '0812' . rand(10000000, 99999999),
                'telp_ibu' => '0813' . rand(10000000, 99999999),
            ]);

            // Create Absensi (2 Hari)
            Absensi::create([
                'id_anak' => $anak->id_anak,
                'id_guru' => $guru->id_guru,
                'tanggal' => '2026-06-15',
                'status' => 'hadir',
            ]);
            Absensi::create([
                'id_anak' => $anak->id_anak,
                'id_guru' => $guru->id_guru,
                'tanggal' => '2026-06-14',
                'status' => ($index === 4) ? 'sakit' : 'hadir',
                'keterangan' => ($index === 4) ? 'Demam flu' : null,
            ]);

            // Create Perkembangan Akademik (2 Minggu)
            PerkembanganAkademik::create([
                'id_anak' => $anak->id_anak,
                'id_guru' => $guru->id_guru,
                'minggu_ke' => 1,
                'bulan' => 'Juni',
                'tahun' => '2026',
                'membaca' => 'BSH (Berkembang Sesuai Harapan)',
                'berhitung' => 'MB (Mulai Berkembang)',
                'menulis' => 'BSH (Berkembang Sesuai Harapan)',
                'catatan' => 'Mulai lancar mengeja kata pendek. Berhitung masih perlu bantuan visual.',
            ]);
            PerkembanganAkademik::create([
                'id_anak' => $anak->id_anak,
                'id_guru' => $guru->id_guru,
                'minggu_ke' => 2,
                'bulan' => 'Juni',
                'tahun' => '2026',
                'membaca' => 'BSB (Berkembang Sangat Baik)',
                'berhitung' => 'BSH (Berkembang Sesuai Harapan)',
                'menulis' => 'BSB (Berkembang Sangat Baik)',
                'catatan' => 'Kemajuan pesat minggu ini. Menulis nama lengkap sudah lancar dan rapi.',
            ]);

            // Create KartuNgaji
            KartuNgaji::create([
                'id_anak' => $anak->id_anak,
                'id_guru' => $guru->id_guru,
                'catatan' => 'Iqra 3 Halaman ' . (($index % 5) + 10),
                'tanggal' => '2026-06-15',
            ]);

            // Create SPP (Juni & Juli)
            Spp::create([
                'id_anak' => $anak->id_anak,
                'id_admin' => $adminProfile->id_admin,
                'bulan' => 'Juni',
                'tahun' => '2026',
                'nominal' => 350000.00,
                'bukti_transfer' => 'spp/bukti_dummy.png',
                'status_pembayaran' => 'Lunas',
                'tanggal_bayar' => '2026-06-02',
                'tanggal_verifikasi' => '2026-06-03',
            ]);
            Spp::create([
                'id_anak' => $anak->id_anak,
                'id_admin' => null,
                'bulan' => 'Juli',
                'tahun' => '2026',
                'nominal' => 350000.00,
                'bukti_transfer' => ($index % 3 === 0) ? 'spp/bukti_dummy_juli.png' : null,
                'status_pembayaran' => ($index % 3 === 0) ? 'Menunggu Verifikasi' : 'Belum Lunas',
                'tanggal_bayar' => ($index % 3 === 0) ? '2026-07-02' : null,
            ]);
        }

        // 4. Seed Kegiatan Sekolah
        Kegiatan::create([
            'judul' => 'Kunjungan Edukatif Kebun Binatang Kasang Kulim',
            'deskripsi' => 'Pengenalan satwa dan belajar memberi makan kelinci secara berkelompok.',
            'tanggal' => '2026-06-10',
            'foto' => null,
        ]);

        Kegiatan::create([
            'judul' => 'Lomba Mewarnai TK Se-Kota Pekanbaru',
            'deskripsi' => 'Kegiatan kreativitas menggambar dan mewarnai tingkat TK se-Pekanbaru.',
            'tanggal' => '2026-06-12',
            'foto' => null,
        ]);
    }
}
