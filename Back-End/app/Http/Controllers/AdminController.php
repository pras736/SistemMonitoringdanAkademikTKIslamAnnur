<?php

namespace App\Http\Controllers;

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
    public function listKelas()
    {
        return response()->json(Kelas::all());
    }

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

    public function deleteKelas($id)
    {
        $kelas = Kelas::findOrFail($id);
        $kelas->delete();
        return response()->json(['message' => 'Kelas berhasil dihapus']);
    }

    // ==========================================
    // GURU MANAGEMENT
    // ==========================================
    public function listGuru()
    {
        return response()->json(Guru::with(['user', 'kelas'])->get());
    }

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
    public function listSiswa()
    {
        return response()->json(Anak::with(['kelas', 'orangTuas.user', 'dataAnak', 'alamatAnak'])->get());
    }

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

            return $anak;
        });

        return response()->json(['message' => 'Siswa dan Orang Tua berhasil ditambahkan', 'data' => $siswa], 201);
    }

    public function updateSiswa(Request $request, $id)
    {
        $anak = Anak::findOrFail($id);
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
        ]);

        $anak->update($request->only([
            'id_kelas', 'nisn', 'nik', 'no_reg_akte', 'nama_lengkap', 'nama_panggilan',
            'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir', 'agama', 'kewarganegaraan'
        ]));

        return response()->json(['message' => 'Data Siswa berhasil diupdate', 'data' => $anak]);
    }

    public function deleteSiswa($id)
    {
        $anak = Anak::findOrFail($id);
        // Find associated parents to clean users
        $ortus = OrangTua::where('id_anak', $anak->id_anak)->get();
        
        DB::transaction(function () use ($anak, $ortus) {
            foreach ($ortus as $ortu) {
                $user = User::find($ortu->id_user);
                $ortu->delete();
                if ($user) $user->delete();
            }
            $anak->delete();
        });

        return response()->json(['message' => 'Siswa berhasil dihapus']);
    }

    // ==========================================
    // SPP MANAGEMENT
    // ==========================================
    public function listPendingSPP()
    {
        return response()->json(Spp::with('anak')->where('status_pembayaran', 'Menunggu Verifikasi')->get());
    }

    public function listAllSPP()
    {
        return response()->json(Spp::with('anak')->orderBy('created_at', 'desc')->get());
    }

    public function verifySPP(Request $request, $id)
    {
        $spp = Spp::findOrFail($id);
        $request->validate([
            'status' => 'required|in:Lunas,Ditolak',
        ]);

        $admin = $request->user()->admin; // Get admin profile
        $id_admin = $admin ? $admin->id_admin : null;

        $spp->update([
            'status_pembayaran' => $request->status,
            'id_admin' => $id_admin,
            'tanggal_verifikasi' => now()->toDateString(),
        ]);

        return response()->json(['message' => 'Verifikasi SPP berhasil diperbarui', 'data' => $spp]);
    }

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
}
