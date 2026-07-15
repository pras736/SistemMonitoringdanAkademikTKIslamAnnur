<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\User;
use App\Models\Guru;
use App\Models\Anak;
use App\Models\OrangTua;
use App\Models\Kelas;
use App\Models\Spp;
use App\Models\DataAnak;
use App\Models\AlamatAnak;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    // ==========================================
    // KELAS MANAGEMENT
    // ==========================================
    /**
     * Fitur: Daftar Kelas
     * Deskripsi: Mendapatkan seluruh daftar kelas yang terdaftar di sekolah.
     */
    public function listKelas()
    {
        return response()->json(Kelas::all());
    }

    /**
     * Fitur: Tambah Kelas Baru
     * Deskripsi: Membuat kelas baru dengan nama kelas, tahun ajaran, dan batasan kapasitas murid.
     */
    public function storeKelas(Request $request)
    {
        $validated = $request->validate([
            'nama_kelas' => 'required|string',
            'tahun_ajaran' => 'required|string',
            'kapasitas' => 'required|integer|min:1',
        ]);

        $kelas = Kelas::create($validated);
        return response()->json(['message' => 'Kelas berhasil ditambahkan', 'data' => $kelas], 210);
    }

    /**
     * Fitur: Update Data Kelas
     * Deskripsi: Memperbarui informasi nama kelas, tahun ajaran, dan kapasitas kelas tertentu.
     */
    public function updateKelas(Request $request, $id)
    {
        $kelas = Kelas::findOrFail($id);
        $validated = $request->validate([
            'nama_kelas' => 'required|string',
            'tahun_ajaran' => 'required|string',
            'kapasitas' => 'required|integer|min:1',
        ]);

        $kelas->update($validated);
        return response()->json(['message' => 'Kelas berhasil diupdate', 'data' => $kelas]);
    }

    /**
     * Fitur: Hapus Kelas
     * Deskripsi: Menghapus kelas tertentu dari sistem.
     */
    public function deleteKelas($id)
    {
        $kelas = Kelas::findOrFail($id);
        $kelas->delete();
        return response()->json(['message' => 'Kelas berhasil dihapus']);
    }

    // ==========================================
    // GURU MANAGEMENT
    // ==========================================
    /**
     * Fitur: Daftar Guru
     * Deskripsi: Mendapatkan data seluruh guru lengkap beserta informasi akun user dan kelas yang diampunya.
     */
    public function listGuru()
    {
        return response()->json(Guru::with(['user', 'kelas'])->get());
    }

    /**
     * Fitur: Tambah Guru Baru
     * Deskripsi: Mendaftarkan guru baru beserta pembuatan akun login (username & password) dalam satu transaksi.
     */
    public function storeGuru(Request $request)
    {
        $request->validate([
            'username' => 'required|string|unique:users,username',
            'password' => 'required|string|min:6',
            'nama_guru' => 'required|string',
            'nip' => 'nullable|string',
            'no_telp' => 'required|string',
            'id_kelas' => 'nullable|exists:kelas,id_kelas',
        ]);

        $guru = DB::transaction(function () use ($request) {
            $user = User::create([
                'username' => $request->username,
                'password_hash' => Hash::make($request->password),
                'role' => 'guru',
                'is_active' => true,
            ]);

            return Guru::create([
                'id_user' => $user->id_user,
                'id_kelas' => $request->id_kelas,
                'nama_guru' => $request->nama_guru,
                'nip' => $request->nip,
                'no_telp' => $request->no_telp,
            ]);
        });

        return response()->json(['message' => 'Guru berhasil ditambahkan', 'data' => $guru], 201);
    }

    /**
     * Fitur: Update Data Guru
     * Deskripsi: Memperbarui profil data guru serta informasi kredensial akun login guru terkait.
     */
    public function updateGuru(Request $request, $id)
    {
        $guru = Guru::findOrFail($id);
        $user = User::findOrFail($guru->id_user);

        $request->validate([
            'username' => 'required|string|unique:users,username,' . $user->id_user . ',id_user',
            'password' => 'nullable|string|min:6',
            'nama_guru' => 'required|string',
            'nip' => 'nullable|string',
            'no_telp' => 'required|string',
            'id_kelas' => 'nullable|exists:kelas,id_kelas',
        ]);

        DB::transaction(function () use ($request, $guru, $user) {
            $userUpdate = [
                'username' => $request->username,
            ];
            if ($request->password) {
                $userUpdate['password_hash'] = Hash::make($request->password);
            }
            $user->update($userUpdate);

            $guru->update([
                'id_kelas' => $request->id_kelas,
                'nama_guru' => $request->nama_guru,
                'nip' => $request->nip,
                'no_telp' => $request->no_telp,
            ]);
        });

        return response()->json(['message' => 'Guru berhasil diupdate']);
    }

    /**
     * Fitur: Hapus Guru
     * Deskripsi: Menghapus data guru beserta akun login guru terkait dari sistem.
     */
    public function deleteGuru($id)
    {
        $guru = Guru::findOrFail($id);
        // Cascades to user deletes as well because of constrained delete or manual
        $user = User::find($guru->id_user);
        $guru->delete();
        if ($user) $user->delete();

        return response()->json(['message' => 'Guru berhasil dihapus']);
    }

    // ==========================================
    // SISWA (ANAK) MANAGEMENT
    // ==========================================
    /**
     * Fitur: Daftar Murid/Siswa
     * Deskripsi: Mendapatkan seluruh daftar murid beserta relasi kelas, wali murid (user), alamat, dan data kesehatannya.
     */
    public function listSiswa()
    {
        return response()->json(Anak::with(['kelas', 'orangTuas.user', 'dataAnak', 'alamatAnak'])->get());
    }

    /**
     * Fitur: Tambah Siswa & Wali Murid Baru
     * Deskripsi: Menambahkan data siswa baru, menautkan ke kelas, membuat data alamat/tambahan default, membuat akun wali murid,
     * serta mengenerate secara otomatis tagihan SPP nominal Rp 330.000 selama 12 bulan (1 tahun ajaran).
     */
    public function storeSiswa(Request $request)
    {
        $request->validate([
            'nama_lengkap' => 'required|string',
            'nama_panggilan' => 'nullable|string',
            'jenis_kelamin' => 'required|string',
            'nisn' => 'nullable|string',
            'nik' => 'nullable|string',
            'no_reg_akte' => 'nullable|string',
            'tempat_lahir' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'agama' => 'nullable|string',
            'kewarganegaraan' => 'nullable|string',
            'id_kelas' => 'nullable|exists:kelas,id_kelas',

            // Parent info to create account
            'username_ortu' => 'required|string|unique:users,username',
            'password_ortu' => 'required|string|min:6',
            'nama_ayah' => 'required|string',
            'nama_ibu' => 'required|string',
        ]);

        $siswa = DB::transaction(function () use ($request) {
            // Create Anak
            $anak = Anak::create([
                'id_kelas' => $request->id_kelas,
                'nisn' => $request->nisn,
                'nik' => $request->nik,
                'no_reg_akte' => $request->no_reg_akte,
                'nama_lengkap' => $request->nama_lengkap,
                'nama_panggilan' => $request->nama_panggilan,
                'jenis_kelamin' => $request->jenis_kelamin,
                'tempat_lahir' => $request->tempat_lahir,
                'tanggal_lahir' => $request->tanggal_lahir,
                'agama' => $request->agama,
                'kewarganegaraan' => $request->kewarganegaraan,
            ]);

            // Create DataAnak default
            DataAnak::create(['id_anak' => $anak->id_anak]);
            // Create AlamatAnak default
            AlamatAnak::create(['id_anak' => $anak->id_anak]);

            // Create User Ortu
            $userOrtu = User::create([
                'username' => $request->username_ortu,
                'password_hash' => Hash::make($request->password_ortu),
                'role' => 'orangtua',
                'is_active' => true,
            ]);

            // Create OrangTua profile
            OrangTua::create([
                'id_user' => $userOrtu->id_user,
                'id_anak' => $anak->id_anak,
                'nama_ayah' => $request->nama_ayah,
                'nama_ibu' => $request->nama_ibu,
            ]);

            // Automatically generate 12 months SPP bills for the Indonesian academic year (Juli 2026 - Juni 2027)
            $academicMonths = [
                ['bulan' => 'Juli', 'tahun' => '2026'],
                ['bulan' => 'Agustus', 'tahun' => '2026'],
                ['bulan' => 'September', 'tahun' => '2026'],
                ['bulan' => 'Oktober', 'tahun' => '2026'],
                ['bulan' => 'November', 'tahun' => '2026'],
                ['bulan' => 'Desember', 'tahun' => '2026'],
                ['bulan' => 'Januari', 'tahun' => '2027'],
                ['bulan' => 'Februari', 'tahun' => '2027'],
                ['bulan' => 'Maret', 'tahun' => '2027'],
                ['bulan' => 'April', 'tahun' => '2027'],
                ['bulan' => 'Mei', 'tahun' => '2027'],
                ['bulan' => 'Juni', 'tahun' => '2027'],
            ];

            // Bulk insert 12 SPP records in a single query (was 12 separate queries)
            $now = now();
            Spp::insert(array_map(fn($m) => [
                'id_anak'           => $anak->id_anak,
                'id_admin'          => null,
                'bulan'             => $m['bulan'],
                'tahun'             => $m['tahun'],
                'nominal'           => 330000.00,
                'bukti_transfer'    => null,
                'status_pembayaran' => 'Belum Lunas',
                'tanggal_bayar'     => null,
                'tanggal_verifikasi'=> null,
                'created_at'        => $now,
                'updated_at'        => $now,
            ], $academicMonths));

            return $anak;
        });

        return response()->json(['message' => 'Siswa dan Orang Tua berhasil ditambahkan', 'data' => $siswa], 201);
    }

    /**
     * Fitur: Update Data Siswa & Wali
     * Deskripsi: Mengedit data pribadi siswa dan menautkan ulang kelas, serta mengupdate nama & akun wali murid.
     */
    public function updateSiswa(Request $request, $id)
    {
        $anak = Anak::findOrFail($id);
        $ortu = $anak->orangTuas()->first();
        $idUserOrtu = $ortu ? $ortu->id_user : null;

        $request->validate([
            'nama_lengkap' => 'required|string',
            'nama_panggilan' => 'nullable|string',
            'jenis_kelamin' => 'required|string',
            'nisn' => 'nullable|string',
            'nik' => 'nullable|string',
            'no_reg_akte' => 'nullable|string',
            'tempat_lahir' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'agama' => 'nullable|string',
            'kewarganegaraan' => 'nullable|string',
            'id_kelas' => 'nullable|exists:kelas,id_kelas',

            // Parent details
            'nama_ayah' => 'required|string',
            'nama_ibu' => 'required|string',
            'username_ortu' => 'required|string|unique:users,username,' . ($idUserOrtu ?: 'NULL') . ',id_user',
            'password_ortu' => 'nullable|string|min:6',
        ]);

        DB::transaction(function () use ($request, $anak, $ortu) {
            $anak->update($request->only([
                'id_kelas', 'nisn', 'nik', 'no_reg_akte', 'nama_lengkap', 'nama_panggilan',
                'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir', 'agama', 'kewarganegaraan'
            ]));

            if ($ortu) {
                $ortu->update([
                    'nama_ayah' => $request->nama_ayah,
                    'nama_ibu' => $request->nama_ibu,
                ]);

                $user = User::find($ortu->id_user);
                if ($user) {
                    $userUpdate = [
                        'username' => $request->username_ortu,
                    ];
                    if ($request->password_ortu) {
                        $userUpdate['password_hash'] = Hash::make($request->password_ortu);
                    }
                    $user->update($userUpdate);
                }
            }
        });

        return response()->json(['message' => 'Data Siswa dan Wali berhasil diupdate', 'data' => $anak]);
    }

    /**
     * Fitur: Hapus Siswa
     * Deskripsi: Menghapus data siswa dan akun login wali muridnya dalam satu transaksi.
     */
    public function deleteSiswa($id)
    {
        $anak = Anak::findOrFail($id);
        // Find associated parents to clean users
        $ortus = OrangTua::where('id_anak', $anak->id_anak)->get();

        DB::transaction(function () use ($anak, $ortus) {
            // Bulk delete user accounts (was 1 query per ortu in loop)
            $userIds = $ortus->pluck('id_user')->filter()->all();
            $ortus->each->delete();
            if (!empty($userIds)) {
                User::whereIn('id_user', $userIds)->delete();
            }
            $anak->delete();
        });

        return response()->json(['message' => 'Siswa berhasil dihapus']);
    }

    // ==========================================
    // SPP MANAGEMENT
    // ==========================================
    /**
     * Fitur: SPP Menunggu Verifikasi
     * Deskripsi: Menampilkan seluruh bukti pembayaran SPP dari wali murid yang menunggu konfirmasi admin.
     */
    public function listPendingSPP()
    {
        return response()->json(Spp::with('anak')->where('status_pembayaran', 'Menunggu Verifikasi')->get());
    }

    /**
     * Fitur: Semua Riwayat SPP
     * Deskripsi: Mendapatkan seluruh riwayat pembayaran SPP dibatasi maksimal 200 data teratas.
     */
    public function listAllSPP()
    {
        // Limit to 200 records as safety guard — prevents loading entire table
        return response()->json(Spp::with('anak')->orderBy('created_at', 'desc')->limit(200)->get());
    }

    /**
     * Fitur: Verifikasi Pembayaran SPP
     * Deskripsi: Admin mengubah status pembayaran SPP menjadi Lunas (Disetujui) atau Ditolak.
     */
    public function verifySPP(Request $request, $id)
    {
        $spp = Spp::findOrFail($id);
        $request->validate([
            'status' => 'required|in:Lunas,Ditolak',
        ]);

        // User->admin() relationship now defined — no extra query needed
        $id_admin = optional($request->user()->admin)->id_admin;

        $spp->update([
            'status_pembayaran' => $request->status,
            'id_admin' => $id_admin,
            'tanggal_verifikasi' => now()->toDateString(),
        ]);

        return response()->json(['message' => 'Verifikasi SPP berhasil diperbarui', 'data' => $spp]);
    }

    /**
     * Fitur: Ekspor Data Siswa Ke CSV
     * Deskripsi: Mendownload seluruh data siswa, data tambahan, alamat, serta profile wali murid ke file spreadsheet CSV.
     */
    public function exportSiswa()
    {
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=data_siswa_lengkap.csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $siswa = Anak::with(['kelas', 'orangTuas.user', 'dataAnak', 'alamatAnak'])->get();

        $callback = function() use($siswa) {
            $file = fopen('php://output', 'w');

            // Add UTF-8 BOM for proper Excel encoding
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            // CSV Columns
            fputcsv($file, [
                'NISN', 'NIK', 'No Reg Akte', 'Nama Lengkap', 'Nama Panggilan', 'Jenis Kelamin',
                'Tempat Lahir', 'Tanggal Lahir', 'Agama', 'Kewarganegaraan', 'Kelas',
                'Nama Ayah', 'NIK Ayah', 'TTL Ayah', 'Pendidikan Ayah', 'Pekerjaan Ayah', 'Kantor Ayah',
                'Nama Ibu', 'NIK Ibu', 'TTL Ibu', 'Pendidikan Ibu', 'Pekerjaan Ibu', 'Kantor Ibu',
                'No Telp Ayah', 'No Telp Ibu',
                'Alamat Jalan', 'Kelurahan', 'Kecamatan', 'Kota', 'Provinsi', 'Kode Pos',
                'Jarak ke Sekolah (Km)', 'Hobi', 'Cita-Cita', 'Anak Ke', 'Jumlah Saudara',
                'Golongan Darah', 'Berat Badan (Kg)', 'Tinggi Badan (Cm)', 'Lingkar Kepala (Cm)', 'Imunisasi'
            ], ';');

            foreach ($siswa as $s) {
                $ortu = $s->orangTuas->first();
                $kelasName = $s->kelas ? $s->kelas->nama_kelas : '-';

                $nisn = $s->nisn ? '="' . $s->nisn . '"' : '-';
                $nik = $s->nik ? '="' . $s->nik . '"' : '-';
                $akte = $s->no_reg_akte ? '="' . $s->no_reg_akte . '"' : '-';
                $telpAyah = ($s->alamatAnak && $s->alamatAnak->telp_ayah) ? '="' . $s->alamatAnak->telp_ayah . '"' : '-';
                $telpIbu = ($s->alamatAnak && $s->alamatAnak->telp_ibu) ? '="' . $s->alamatAnak->telp_ibu . '"' : '-';
                $kodePos = ($s->alamatAnak && $s->alamatAnak->kode_pos) ? '="' . $s->alamatAnak->kode_pos . '"' : '-';

                $nikAyah = ($ortu && $ortu->nik_ayah) ? '="' . $ortu->nik_ayah . '"' : '-';
                $nikIbu = ($ortu && $ortu->nik_ibu) ? '="' . $ortu->nik_ibu . '"' : '-';

                fputcsv($file, [
                    $nisn,
                    $nik,
                    $akte,
                    $s->nama_lengkap,
                    $s->nama_panggilan ?: '-',
                    $s->jenis_kelamin,
                    $s->tempat_lahir ?: '-',
                    $s->tanggal_lahir ? $s->tanggal_lahir->toDateString() : '-',
                    $s->agama ?: '-',
                    $s->kewarganegaraan ?: '-',
                    $kelasName,
                    $ortu ? $ortu->nama_ayah : '-',
                    $nikAyah,
                    $ortu ? $ortu->ttl_ayah : '-',
                    $ortu ? $ortu->pendidikan_ayah : '-',
                    $ortu ? $ortu->pekerjaan_ayah : '-',
                    $ortu ? $ortu->kantor_ayah : '-',
                    $ortu ? $ortu->nama_ibu : '-',
                    $nikIbu,
                    $ortu ? $ortu->ttl_ibu : '-',
                    $ortu ? $ortu->pendidikan_ibu : '-',
                    $ortu ? $ortu->pekerjaan_ibu : '-',
                    $ortu ? $ortu->kantor_ibu : '-',
                    $telpAyah,
                    $telpIbu,
                    $s->alamatAnak ? $s->alamatAnak->jalan : '-',
                    $s->alamatAnak ? $s->alamatAnak->kelurahan : '-',
                    $s->alamatAnak ? $s->alamatAnak->kecamatan : '-',
                    $s->alamatAnak ? $s->alamatAnak->kota : '-',
                    $s->alamatAnak ? $s->alamatAnak->provinsi : '-',
                    $kodePos,
                    $s->alamatAnak ? $s->alamatAnak->jarak_ke_sekolah_km : '-',
                    $s->dataAnak ? $s->dataAnak->hobi : '-',
                    $s->dataAnak ? $s->dataAnak->cita_cita : '-',
                    $s->dataAnak ? $s->dataAnak->anak_ke : '-',
                    $s->dataAnak ? $s->dataAnak->jumlah_saudara : '-',
                    $s->dataAnak ? $s->dataAnak->golongan_darah : '-',
                    $s->dataAnak ? $s->dataAnak->berat_badan_kg : '-',
                    $s->dataAnak ? $s->dataAnak->tinggi_badan_cm : '-',
                    $s->dataAnak ? $s->dataAnak->lingkar_kepala_cm : '-',
                    $s->dataAnak ? $s->dataAnak->imunisasi : '-'
                ], ';');
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Fitur: Statistik & Data Dashboard Admin
     * Deskripsi: Menampilkan total data agregasi (jumlah kelas, guru, siswa) serta menampilkan 5 akun user terbaru dan 3 pembayaran SPP pending terbaru.
     */
    public function dashboardStats(Request $request)
    {
        $totalSiswa = Anak::count();
        $totalKelas = Kelas::count();
        $totalGuru = Guru::count();
        $totalUsers = User::count();
        $pendingSppCount = Spp::where('status_pembayaran', 'Menunggu Verifikasi')->count();

        // Fix N+1: eager load admin/guru/orangTua relationships in 4 queries instead of up to 25
        $users = User::with(['admin', 'guru', 'orangTua'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $recentUsers = $users->map(function ($u) {
            $name = '-';
            if ($u->role === 'admin') {
                $name = $u->admin ? $u->admin->nama_admin : 'Administrator';
            } elseif ($u->role === 'guru') {
                $name = $u->guru ? $u->guru->nama_guru : 'Guru';
            } elseif ($u->role === 'orangtua') {
                if ($u->orangTua) {
                    $name = $u->orangTua->nama_ibu ?: $u->orangTua->nama_ayah;
                } else {
                    $name = 'Orang Tua';
                }
            }

            // Map roles to match UI labels
            $roleLabel = 'Admin';
            if ($u->role === 'guru') $roleLabel = 'Teacher';
            if ($u->role === 'orangtua') $roleLabel = 'Parent';

            return [
                'id'         => $u->id_user,
                'username'   => $u->username,
                'name'       => $name,
                'role'       => $roleLabel,
                'status'     => $u->is_active ? 'Active' : 'Inactive',
                'foto_profil' => $u->foto_profil,
            ];
        });

        // 3 Recent Pending SPP Payments
        $pendingSpps = Spp::with(['anak.orangTuas'])
            ->where('status_pembayaran', 'Menunggu Verifikasi')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(function ($s) {
                $parentName = '-';
                if ($s->anak && $s->anak->orangTuas->isNotEmpty()) {
                    $ortu = $s->anak->orangTuas->first();
                    $parentName = $ortu->nama_ibu ?: $ortu->nama_ayah;
                }
                return [
                    'id_spp'         => $s->id_spp,
                    'anak_nama'      => $s->anak ? $s->anak->nama_lengkap : 'Siswa',
                    'bulan'          => $s->bulan,
                    'tahun'          => $s->tahun,
                    'nominal'        => $s->nominal,
                    'sender'         => $parentName,
                    'bukti_transfer' => $s->bukti_transfer,
                ];
            });

        return response()->json([
            'total_siswa'       => $totalSiswa,
            'total_kelas'       => $totalKelas,
            'total_guru'        => $totalGuru,
            'total_users'       => $totalUsers,
            'pending_spp_count' => $pendingSppCount,
            'recent_users'      => $recentUsers,
            'pending_spps'      => $pendingSpps,
        ]);
    }
}
