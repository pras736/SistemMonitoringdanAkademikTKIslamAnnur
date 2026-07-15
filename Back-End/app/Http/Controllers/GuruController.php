<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\Kegiatan;
use App\Models\PerkembanganAkademik;
use App\Models\KartuNgaji;
use App\Models\Anak;
use App\Models\Guru;
use App\Models\Notification;
use App\Models\User;
use App\Models\OrangTua;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class GuruController extends Controller
{
    /**
     * Helper Internal: Ambil Profil Guru
     * Deskripsi: Mendapatkan data model Guru berdasarkan pengguna (User) yang sedang login.
     */
    private function getGuru(Request $request)
    {
        $user = $request->user();
        return Guru::where('id_user', $user->id_user)->first();
    }

    /**
     * Fitur: Daftar Siswa Kelas Guru
     * Deskripsi: Menampilkan seluruh data siswa yang terdaftar di kelas yang diampu oleh Guru login.
     */
    public function listMyStudents(Request $request)
    {
        $guru = $this->getGuru($request);
        if (!$guru || !$guru->id_kelas) {
            return response()->json([]);
        }
        return response()->json(Anak::where('id_kelas', $guru->id_kelas)->get());
    }

    // ==========================================
    // ABSENSI
    // ==========================================
    /**
     * Fitur: Lihat Absensi Siswa
     * Deskripsi: Menampilkan riwayat kehadiran siswa pada tanggal tertentu di kelas ampu guru.
     */
    public function listAbsensi(Request $request)
    {
        $request->validate(['tanggal' => 'required|date']);
        $guru = $this->getGuru($request);
        if (!$guru) {
            return response()->json(['message' => 'Profile guru tidak ditemukan'], 404);
        }

        $tanggal = $request->tanggal;
        $absensi = Absensi::with('anak')
            ->where('id_guru', $guru->id_guru)
            ->where('tanggal', $tanggal)
            ->get();

        return response()->json($absensi);
    }

    /**
     * Fitur: Simpan Absensi Siswa
     * Deskripsi: Menyimpan kehadiran harian seluruh siswa kelas secara bulk (menghapus data lama pada tanggal sama lalu batch insert).
     */
    public function storeAbsensi(Request $request)
    {
        $request->validate([
            'tanggal'              => 'required|date',
            'absensi'              => 'required|array',
            'absensi.*.id_anak'   => 'required|exists:anaks,id_anak',
            'absensi.*.status'    => 'required|in:hadir,sakit,izin,alfa',
            'absensi.*.keterangan'=> 'nullable|string',
        ]);

        $guru    = $this->getGuru($request);
        if (!$guru) {
            return response()->json(['message' => 'Profile guru tidak ditemukan'], 404);
        }

        $tanggal = $request->tanggal;
        $now     = now();

        // Fix N+1: delete existing records for this guru+date, then bulk insert
        // (was: 1 SELECT + 1 INSERT/UPDATE per student = 50 queries for 25 students)
        DB::table('absensis')
            ->where('id_guru', $guru->id_guru)
            ->where('tanggal', $tanggal)
            ->delete();

        $records = array_map(fn($item) => [
            'id_anak'    => $item['id_anak'],
            'id_guru'    => $guru->id_guru,
            'tanggal'    => $tanggal,
            'status'     => $item['status'],
            'keterangan' => $item['keterangan'] ?? null,
            'created_at' => $now,
            'updated_at' => $now,
        ], $request->absensi);

        Absensi::insert($records);

        // Fetch the freshly inserted records to return (same response structure)
        $saved = Absensi::with('anak')
            ->where('id_guru', $guru->id_guru)
            ->where('tanggal', $tanggal)
            ->get();

        return response()->json(['message' => 'Absensi berhasil disimpan', 'data' => $saved]);
    }

    // ==========================================
    // PERKEMBANGAN AKADEMIK
    // ==========================================
    /**
     * Fitur: Riwayat Perkembangan Mingguan
     * Deskripsi: Mengambil nilai calistung siswa per minggu/bulan/tahun tertentu.
     */
    public function listPerkembangan(Request $request)
    {
        $request->validate([
            'minggu_ke' => 'required|integer',
            'bulan'     => 'required|string',
            'tahun'     => 'required|string',
        ]);

        $guru = $this->getGuru($request);
        if (!$guru) return response()->json(['message' => 'Guru not found'], 404);

        $data = PerkembanganAkademik::with('anak')
            ->where('id_guru', $guru->id_guru)
            ->where('minggu_ke', $request->minggu_ke)
            ->where('bulan', $request->bulan)
            ->where('tahun', $request->tahun)
            ->get();

        return response()->json($data);
    }

    /**
     * Fitur: Simpan Perkembangan Akademik (Calistung)
     * Deskripsi: Menginput/update evaluasi membaca, berhitung, menulis satu murid sekaligus mengirim notifikasi real-time ke wali muridnya.
     */
    public function storePerkembangan(Request $request)
    {
        $request->validate([
            'id_anak'   => 'required|exists:anaks,id_anak',
            'minggu_ke' => 'required|integer',
            'bulan'     => 'required|string',
            'tahun'     => 'required|string',
            'membaca'   => 'required|string',
            'berhitung' => 'required|string',
            'menulis'   => 'required|string',
            'catatan'   => 'nullable|string',
        ]);

        $guru = $this->getGuru($request);
        if (!$guru) return response()->json(['message' => 'Guru not found'], 404);

        $perkembangan = PerkembanganAkademik::updateOrCreate(
            [
                'id_anak'   => $request->id_anak,
                'minggu_ke' => $request->minggu_ke,
                'bulan'     => $request->bulan,
                'tahun'     => $request->tahun,
            ],
            [
                'id_guru'   => $guru->id_guru,
                'membaca'   => $request->membaca,
                'berhitung' => $request->berhitung,
                'menulis'   => $request->menulis,
                'catatan'   => $request->catatan,
            ]
        );

        // Fix N+1: Get child name in 1 query, batch insert notifications
        $anakNama = Anak::where('id_anak', $request->id_anak)->value('nama_lengkap') ?? 'Anak';
        $ortus    = OrangTua::where('id_anak', $request->id_anak)->get(['id_user']);

        if ($ortus->isNotEmpty()) {
            $now        = now();
            $notifBatch = $ortus->map(fn($ortu) => [
                'id_user'    => $ortu->id_user,
                'title'      => 'Laporan Calistung Baru',
                'message'    => 'Laporan perkembangan akademik (Calistung) baru untuk ' . $anakNama . ' (Minggu Ke-' . $perkembangan->minggu_ke . ', ' . $perkembangan->bulan . ' ' . $perkembangan->tahun . ') telah diinput oleh Guru.',
                'is_read'    => false,
                'created_at' => $now,
                'updated_at' => $now,
            ])->all();
            Notification::insert($notifBatch);
        }

        return response()->json(['message' => 'Perkembangan akademik berhasil disimpan', 'data' => $perkembangan]);
    }

    // ==========================================
    // MENGAJI (KARTU NGAJI)
    // ==========================================
    /**
     * Fitur: Riwayat Catatan Mengaji Kelas
     * Deskripsi: Menampilkan riwayat mengaji siswa-siswa yang diajar oleh guru.
     */
    public function listMengaji(Request $request)
    {
        $guru = $this->getGuru($request);
        if (!$guru) return response()->json(['message' => 'Guru not found'], 404);

        $data = KartuNgaji::with('anak')
            ->where('id_guru', $guru->id_guru)
            ->orderBy('tanggal', 'desc')
            ->get();

        return response()->json($data);
    }

    /**
     * Fitur: Simpan Catatan Mengaji Siswa
     * Deskripsi: Menyimpan progress belajar mengaji/bacaan iqra satu murid dan menembakkan notifikasi real-time ke akun wali muridnya.
     */
    public function storeMengaji(Request $request)
    {
        $request->validate([
            'id_anak' => 'required|exists:anaks,id_anak',
            'catatan' => 'required|string', // e.g. Iqra 3 Halaman 12
            'tanggal' => 'required|date',
        ]);

        $guru = $this->getGuru($request);
        if (!$guru) return response()->json(['message' => 'Guru not found'], 404);

        $mengaji = KartuNgaji::create([
            'id_anak' => $request->id_anak,
            'id_guru' => $guru->id_guru,
            'catatan' => $request->catatan,
            'tanggal' => $request->tanggal,
        ]);

        // Fix N+1: Get child name in 1 query, batch insert notifications
        $anakNama = Anak::where('id_anak', $request->id_anak)->value('nama_lengkap') ?? 'Anak';
        $ortus    = OrangTua::where('id_anak', $request->id_anak)->get(['id_user']);

        if ($ortus->isNotEmpty()) {
            $now        = now();
            $notifBatch = $ortus->map(fn($ortu) => [
                'id_user'    => $ortu->id_user,
                'title'      => 'Catatan Mengaji Baru',
                'message'    => 'Catatan mengaji baru untuk ' . $anakNama . ' telah diinput oleh Guru pada tanggal ' . $mengaji->tanggal . ': ' . $mengaji->catatan . '.',
                'is_read'    => false,
                'created_at' => $now,
                'updated_at' => $now,
            ])->all();
            Notification::insert($notifBatch);
        }

        return response()->json(['message' => 'Catatan mengaji berhasil ditambahkan', 'data' => $mengaji]);
    }

    // ==========================================
    // KEGIATAN LUAR SEKOLAH
    // ==========================================
    /**
     * Fitur: Riwayat Daftar Kegiatan Sekolah
     * Deskripsi: Mendapatkan daftar semua agenda/kegiatan luar sekolah yang aktif.
     */
    public function listKegiatan()
    {
        return response()->json(Kegiatan::orderBy('tanggal', 'desc')->get());
    }

    /**
     * Fitur: Tambah Kegiatan Baru
     * Deskripsi: Mengunggah data agenda sekolah/wisata/outbound, menyimpan fotonya, serta menyebarkan notifikasi ke seluruh wali murid secara massal.
     */
    public function storeKegiatan(Request $request)
    {
        $request->validate([
            'judul'    => 'required|string',
            'deskripsi'=> 'required|string',
            'tanggal'  => 'required|date',
            'foto'     => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('kegiatan', 'public');
        }

        $kegiatan = Kegiatan::create([
            'judul'    => $request->judul,
            'deskripsi'=> $request->deskripsi,
            'tanggal'  => $request->tanggal,
            'foto'     => $fotoPath,
        ]);

        // Fix N+1: pluck only id_user (1 query), then batch insert notifications
        $parentIds = User::where('role', 'orangtua')->pluck('id_user');

        if ($parentIds->isNotEmpty()) {
            $now        = now();
            $notifBatch = $parentIds->map(fn($userId) => [
                'id_user'    => $userId,
                'title'      => 'Kegiatan Sekolah Baru',
                'message'    => 'Ada kegiatan luar sekolah baru: ' . $kegiatan->judul . ' pada tanggal ' . $kegiatan->tanggal . '.',
                'is_read'    => false,
                'created_at' => $now,
                'updated_at' => $now,
            ])->all();
            Notification::insert($notifBatch);
        }

        return response()->json(['message' => 'Kegiatan luar sekolah berhasil ditambahkan', 'data' => $kegiatan]);
    }

    /**
     * Fitur: Hapus Kegiatan
     * Deskripsi: Menghapus data kegiatan sekolah beserta file fotonya dari storage.
     */
    public function deleteKegiatan($id)
    {
        $kegiatan = Kegiatan::findOrFail($id);
        if ($kegiatan->foto) {
            Storage::disk('public')->delete($kegiatan->foto);
        }
        $kegiatan->delete();

        return response()->json(['message' => 'Kegiatan berhasil dihapus']);
    }
}
