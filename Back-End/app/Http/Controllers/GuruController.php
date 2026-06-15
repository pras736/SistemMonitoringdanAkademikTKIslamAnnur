<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\Kegiatan;
use App\Models\PerkembanganAkademik;
use App\Models\KartuNgaji;
use App\Models\Anak;
use App\Models\Guru;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GuruController extends Controller
{
    private function getGuru(Request $request)
    {
        $user = $request->user();
        return Guru::where('id_user', $user->id_user)->first();
    }

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

    public function storeAbsensi(Request $request)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'absensi' => 'required|array',
            'absensi.*.id_anak' => 'required|exists:anaks,id_anak',
            'absensi.*.status' => 'required|in:hadir,sakit,izin,alfa',
            'absensi.*.keterangan' => 'nullable|string',
        ]);

        $guru = $this->getGuru($request);
        if (!$guru) {
            return response()->json(['message' => 'Profile guru tidak ditemukan'], 404);
        }

        $tanggal = $request->tanggal;
        $saved = [];

        foreach ($request->absensi as $item) {
            $abs = Absensi::updateOrCreate(
                [
                    'id_anak' => $item['id_anak'],
                    'tanggal' => $tanggal,
                ],
                [
                    'id_guru' => $guru->id_guru,
                    'status' => $item['status'],
                    'keterangan' => $item['keterangan'] ?? null,
                ]
            );
            $saved[] = $abs;
        }

        return response()->json(['message' => 'Absensi berhasil disimpan', 'data' => $saved]);
    }

    // ==========================================
    // PERKEMBANGAN AKADEMIK
    // ==========================================
    public function listPerkembangan(Request $request)
    {
        $request->validate([
            'minggu_ke' => 'required|integer',
            'bulan' => 'required|string',
            'tahun' => 'required|string',
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

    public function storePerkembangan(Request $request)
    {
        $request->validate([
            'id_anak' => 'required|exists:anaks,id_anak',
            'minggu_ke' => 'required|integer',
            'bulan' => 'required|string',
            'tahun' => 'required|string',
            'membaca' => 'required|string',
            'berhitung' => 'required|string',
            'menulis' => 'required|string',
            'catatan' => 'nullable|string',
        ]);

        $guru = $this->getGuru($request);
        if (!$guru) return response()->json(['message' => 'Guru not found'], 404);

        $perkembangan = PerkembanganAkademik::updateOrCreate(
            [
                'id_anak' => $request->id_anak,
                'minggu_ke' => $request->minggu_ke,
                'bulan' => $request->bulan,
                'tahun' => $request->tahun,
            ],
            [
                'id_guru' => $guru->id_guru,
                'membaca' => $request->membaca,
                'berhitung' => $request->berhitung,
                'menulis' => $request->menulis,
                'catatan' => $request->catatan,
            ]
        );

        return response()->json(['message' => 'Perkembangan akademik berhasil disimpan', 'data' => $perkembangan]);
    }

    // ==========================================
    // MENGAJI (KARTU NGAJI)
    // ==========================================
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

        return response()->json(['message' => 'Catatan mengaji berhasil ditambahkan', 'data' => $mengaji]);
    }

    // ==========================================
    // KEGIATAN LUAR SEKOLAH
    // ==========================================
    public function listKegiatan()
    {
        return response()->json(Kegiatan::orderBy('tanggal', 'desc')->get());
    }

    public function storeKegiatan(Request $request)
    {
        $request->validate([
            'judul' => 'required|string',
            'deskripsi' => 'required|string',
            'tanggal' => 'required|date',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('kegiatan', 'public');
        }

        $kegiatan = Kegiatan::create([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'tanggal' => $request->tanggal,
            'foto' => $fotoPath,
        ]);

        return response()->json(['message' => 'Kegiatan luar sekolah berhasil ditambahkan', 'data' => $kegiatan]);
    }

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
