<?php

namespace App\Http\Controllers;

use App\Models\Anak;
use App\Models\DataAnak;
use App\Models\AlamatAnak;
use App\Models\PerkembanganAkademik;
use App\Models\KartuNgaji;
use App\Models\Absensi;
use App\Models\Kegiatan;
use App\Models\Spp;
use App\Models\OrangTua;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class WaliController extends Controller
{
    private function getAnak(Request $request)
    {
        $user = $request->user();
        $ortu = OrangTua::where('id_user', $user->id_user)->first();
        if (!$ortu) return null;
        return Anak::with(['kelas', 'dataAnak', 'alamatAnak', 'orangTuas'])->find($ortu->id_anak);
    }

    public function getMyChildInfo(Request $request)
    {
        $anak = $this->getAnak($request);
        if (!$anak) {
            return response()->json(['message' => 'Data anak tidak ditemukan untuk akun ini'], 404);
        }
        return response()->json($anak);
    }

    public function updateChildProfile(Request $request)
    {
        $anak = $this->getAnak($request);
        if (!$anak) {
            return response()->json(['message' => 'Data anak tidak ditemukan untuk akun ini'], 404);
        }

        $request->validate([
            // Anak general
            'nama_panggilan' => 'nullable|string',
            'tempat_lahir' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'agama' => 'nullable|string',
            'kewarganegaraan' => 'nullable|string',
            // DataAnak
            'hobi' => 'nullable|string',
            'cita_cita' => 'nullable|string',
            'anak_ke' => 'nullable|integer',
            'jumlah_saudara' => 'nullable|integer',
            'golongan_darah' => 'nullable|string',
            'berat_badan_kg' => 'nullable|numeric',
            'tinggi_badan_cm' => 'nullable|numeric',
            'lingkar_kepala_cm' => 'nullable|numeric',
            'imunisasi' => 'nullable|string',
            // AlamatAnak
            'jalan' => 'nullable|string',
            'kelurahan' => 'nullable|string',
            'kecamatan' => 'nullable|string',
            'kota' => 'nullable|string',
            'provinsi' => 'nullable|string',
            'kode_pos' => 'nullable|string',
            'jarak_ke_sekolah_km' => 'nullable|numeric',
            'telp_ayah' => 'nullable|string',
            'telp_ibu' => 'nullable|string',
            // OrangTua
            'nama_ayah' => 'nullable|string',
            'nik_ayah' => 'nullable|string',
            'ttl_ayah' => 'nullable|string',
            'pendidikan_ayah' => 'nullable|string',
            'pekerjaan_ayah' => 'nullable|string',
            'kantor_ayah' => 'nullable|string',
            'nama_ibu' => 'nullable|string',
            'nik_ibu' => 'nullable|string',
            'ttl_ibu' => 'nullable|string',
            'pendidikan_ibu' => 'nullable|string',
            'pekerjaan_ibu' => 'nullable|string',
            'kantor_ibu' => 'nullable|string',
        ]);

        // Update Anak
        $anak->update($request->only([
            'nama_panggilan', 'tempat_lahir', 'tanggal_lahir', 'agama', 'kewarganegaraan'
        ]));

        // Update DataAnak
        $dataAnak = DataAnak::firstOrCreate(['id_anak' => $anak->id_anak]);
        $dataAnak->update($request->only([
            'hobi', 'cita_cita', 'anak_ke', 'jumlah_saudara', 'golongan_darah',
            'berat_badan_kg', 'tinggi_badan_cm', 'lingkar_kepala_cm', 'imunisasi'
        ]));

        // Update AlamatAnak
        $alamatAnak = AlamatAnak::firstOrCreate(['id_anak' => $anak->id_anak]);
        $alamatAnak->update($request->only([
            'jalan', 'kelurahan', 'kecamatan', 'kota', 'provinsi', 'kode_pos',
            'jarak_ke_sekolah_km', 'telp_ayah', 'telp_ibu'
        ]));

        // Update OrangTua Profile
        $ortuRecord = OrangTua::where('id_anak', $anak->id_anak)->first();
        if ($ortuRecord) {
            $ortuRecord->update($request->only([
                'nama_ayah', 'nik_ayah', 'ttl_ayah', 'pendidikan_ayah', 'pekerjaan_ayah', 'kantor_ayah',
                'nama_ibu', 'nik_ibu', 'ttl_ibu', 'pendidikan_ibu', 'pekerjaan_ibu', 'kantor_ibu'
            ]));
        }

        return response()->json([
            'message' => 'Data diri anak berhasil diperbarui',
            'data' => Anak::with(['kelas', 'dataAnak', 'alamatAnak', 'orangTuas'])->find($anak->id_anak)
        ]);
    }

    public function getChildAcademicProgress(Request $request)
    {
        $anak = $this->getAnak($request);
        if (!$anak) return response()->json([], 404);

        $progress = PerkembanganAkademik::where('id_anak', $anak->id_anak)
            ->orderBy('tahun', 'desc')
            ->orderBy('bulan', 'desc')
            ->orderBy('minggu_ke', 'desc')
            ->get();

        return response()->json($progress);
    }

    public function getChildNgajiProgress(Request $request)
    {
        $anak = $this->getAnak($request);
        if (!$anak) return response()->json([], 404);

        $progress = KartuNgaji::where('id_anak', $anak->id_anak)
            ->orderBy('tanggal', 'desc')
            ->get();

        return response()->json($progress);
    }

    public function getChildAbsensi(Request $request)
    {
        $anak = $this->getAnak($request);
        if (!$anak) return response()->json([], 404);

        $absensi = Absensi::where('id_anak', $anak->id_anak)
            ->orderBy('tanggal', 'desc')
            ->get();

        return response()->json($absensi);
    }

    public function getKegiatanList()
    {
        return response()->json(Kegiatan::orderBy('tanggal', 'desc')->get());
    }

    // ==========================================
    // SPP
    // ==========================================
    public function getMySPPList(Request $request)
    {
        $anak = $this->getAnak($request);
        if (!$anak) return response()->json([]);

        // Get SPP records for this child
        $sppList = Spp::where('id_anak', $anak->id_anak)
            ->orderBy('tahun', 'desc')
            ->orderBy('bulan', 'desc')
            ->get();

        return response()->json($sppList);
    }

    public function uploadSPPProof(Request $request)
    {
        $request->validate([
            'id_spp' => 'required|exists:spps,id_spp',
            'bukti_transfer' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $anak = $this->getAnak($request);
        if (!$anak) return response()->json(['message' => 'Data anak tidak ditemukan'], 404);

        $spp = Spp::where('id_spp', $request->id_spp)
            ->where('id_anak', $anak->id_anak)
            ->firstOrFail();

        // Check if already paid/verified
        if ($spp->status_pembayaran === 'Lunas') {
            return response()->json(['message' => 'SPP bulan ini sudah lunas'], 400);
        }

        if ($request->hasFile('bukti_transfer')) {
            // Delete old proof if exists
            if ($spp->bukti_transfer) {
                Storage::disk('public')->delete($spp->bukti_transfer);
            }

            $path = $request->file('bukti_transfer')->store('spp', 'public');
            
            $spp->update([
                'bukti_transfer' => $path,
                'status_pembayaran' => 'Menunggu Verifikasi',
                'tanggal_bayar' => now()->toDateString(),
            ]);

            return response()->json(['message' => 'Bukti pembayaran berhasil diupload', 'data' => $spp]);
        }

        return response()->json(['message' => 'Gagal mengupload bukti transfer'], 400);
    }
}
