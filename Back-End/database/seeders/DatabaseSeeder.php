<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // 1. Seed Kelas
        $kelasA = \App\Models\Kelas::create([
            'nama_kelas' => 'Kelas A (Mawar)',
            'tahun_ajaran' => '2025/2026',
            'kapasitas' => 20,
        ]);

        $kelasB = \App\Models\Kelas::create([
            'nama_kelas' => 'Kelas B (Melati)',
            'tahun_ajaran' => '2025/2026',
            'kapasitas' => 25,
        ]);

        // 2. Seed Users
        $userAdmin = User::create([
            'username' => 'admin',
            'email' => 'admin@tkan-nur.com',
            'password_hash' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $userGuru = User::create([
            'username' => 'guru',
            'email' => 'guru@tkan-nur.com',
            'password_hash' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'guru',
            'is_active' => true,
        ]);

        $userOrtu = User::create([
            'username' => 'orangtua',
            'email' => 'ortu@tkan-nur.com',
            'password_hash' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'orangtua',
            'is_active' => true,
        ]);

        // 3. Seed Admin Profile
        $adminProfile = \App\Models\Admin::create([
            'id_user' => $userAdmin->id_user,
            'nama_admin' => 'Administrator Utama',
            'no_telp' => '081234567890',
        ]);

        // 4. Seed Guru Profile
        $guruProfile = \App\Models\Guru::create([
            'id_user' => $userGuru->id_user,
            'id_kelas' => $kelasA->id_kelas,
            'nama_guru' => 'Ibu Sri Sarah S.Pd.',
            'nip' => '198705122010122003',
            'no_telp' => '082345678901',
        ]);

        // 5. Seed Anak Profile
        $anak = \App\Models\Anak::create([
            'id_kelas' => $kelasA->id_kelas,
            'nisn' => '0123456789',
            'nik' => '1471020304050001',
            'no_reg_akte' => 'AKTE-987654',
            'nama_lengkap' => 'Ahmad Rizky Al-Fatih',
            'nama_panggilan' => 'Rizky',
            'jenis_kelamin' => 'Laki-laki',
            'tempat_lahir' => 'Pekanbaru',
            'tanggal_lahir' => '2020-05-15',
            'agama' => 'Islam',
            'kewarganegaraan' => 'WNI',
        ]);

        // 6. Seed OrangTua Profile
        $ortuProfile = \App\Models\OrangTua::create([
            'id_user' => $userOrtu->id_user,
            'id_anak' => $anak->id_anak,
            'role' => 'Ayah',
            'nama' => 'Bapak Ahmad Hermansyah',
            'nik' => '1471020304050002',
            'tempat_tanggal_lahir' => 'Pekanbaru, 12-08-1988',
            'pendidikan_tertinggi' => 'S1 Teknik Informatika',
            'pekerjaan' => 'Wiraswasta',
            'alamat_telp_kantor' => 'Jl. Sudirman No. 45 Pekanbaru / 0811223344',
        ]);

        // 7. Seed DataAnak Details
        \App\Models\DataAnak::create([
            'id_anak' => $anak->id_anak,
            'hobi' => 'Menggambar & Mewarnai',
            'cita_cita' => 'Astronot',
            'anak_ke' => 1,
            'jumlah_saudara' => 1,
            'golongan_darah' => 'O',
            'berat_badan_kg' => 18.5,
            'tinggi_badan_cm' => 110.0,
            'lingkar_kepala_cm' => 52.0,
            'imunisasi' => 'Lengkap (BCG, DPT, Polio, Campak)',
        ]);

        // 8. Seed AlamatAnak Details
        \App\Models\AlamatAnak::create([
            'id_anak' => $anak->id_anak,
            'jalan' => 'Jl. Dahlia No. 12, Sukajadi',
            'kelurahan' => 'Kedung Sari',
            'kecamatan' => 'Sukajadi',
            'kota' => 'Pekanbaru',
            'provinsi' => 'Riau',
            'kode_pos' => '28122',
            'jarak_ke_sekolah_km' => 1.5,
            'telp_ayah' => '0811223344',
            'telp_ibu' => '0811223355',
        ]);

        // 9. Seed Nilai Records
        \App\Models\Nilai::create([
            'id_anak' => $anak->id_anak,
            'id_guru' => $guruProfile->id_guru,
            'mata_pelajaran' => 'Sains & Alam',
            'nilai' => 92.5,
            'semester' => 'Ganjil',
            'tgl_input' => '2026-06-04',
        ]);

        \App\Models\Nilai::create([
            'id_anak' => $anak->id_anak,
            'id_guru' => $guruProfile->id_guru,
            'mata_pelajaran' => 'Pendidikan Moral & Agama',
            'nilai' => 95.0,
            'semester' => 'Ganjil',
            'tgl_input' => '2026-06-04',
        ]);

        // 10. Seed KartuNgaji Progress
        \App\Models\KartuNgaji::create([
            'id_anak' => $anak->id_anak,
            'id_guru' => $guruProfile->id_guru,
            'catatan' => 'Lancar membaca Iqra 4 halaman 12. Lanjutkan halaman berikutnya.',
            'tanggal' => '2026-06-04',
        ]);

        // 11. Seed SPP Record
        \App\Models\Spp::create([
            'id_anak' => $anak->id_anak,
            'id_admin' => $adminProfile->id_admin,
            'bulan' => 'Juni',
            'tahun' => '2026',
            'nominal' => 350000.00,
            'bukti_transfer' => 'bukti_spp_juni_2026.png',
            'status_pembayaran' => 'Lunas',
            'tanggal_bayar' => '2026-06-02',
            'tanggal_verifikasi' => '2026-06-03',
        ]);
    }
}
