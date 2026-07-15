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
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class WaliController extends Controller
{
    // Memoize the child lookup — getAnak() called multiple times per request
    // (e.g. uploadSPPProof calls it, then other logic runs — was 2 queries every call)
    private ?Anak $anakCache = null;

    /**
     * Helper Internal: Ambil Data Anak
     * Deskripsi: Mengambil relasi profil anak milik Wali Murid yang login dan menyimpan hasilnya di cache lokal objek.
     */
    private function getAnak(Request $request)
    {
        if ($this->anakCache !== null) {
            return $this->anakCache;
        }

        $user = $request->user();
        $ortu = OrangTua::where('id_user', $user->id_user)->first();
        if (!$ortu) return null;

        $this->anakCache = Anak::with(['kelas', 'dataAnak', 'alamatAnak', 'orangTuas'])
            ->find($ortu->id_anak);

        return $this->anakCache;
    }

    /**
     * Fitur: Informasi Anak Saya
     * Deskripsi: Menampilkan biodata lengkap anak dari wali murid yang sedang aktif login.
     */
    public function getMyChildInfo(Request $request)
    {
        $anak = $this->getAnak($request);
        if (!$anak) {
            return response()->json(['message' => 'Data anak tidak ditemukan untuk akun ini'], 404);
        }
        return response()->json($anak);
    }

    /**
     * Fitur: Perbarui Profil Anak & Orang Tua
     * Deskripsi: Memperbarui data umum anak, data tambahan/kesehatan, alamat tinggal, dan data orang tua (ayah/ibu).
     */
    public function updateChildProfile(Request $request)
    {
        $anak = $this->getAnak($request);
        if (!$anak) {
            return response()->json(['message' => 'Data anak tidak ditemukan untuk akun ini'], 404);
        }

        $request->validate([
            // Anak general
            'nama_panggilan'   => 'nullable|string',
            'tempat_lahir'     => 'nullable|string',
            'tanggal_lahir'    => 'nullable|date',
            'agama'            => 'nullable|string',
            'kewarganegaraan'  => 'nullable|string',
            // DataAnak
            'hobi'             => 'nullable|string',
            'cita_cita'        => 'nullable|string',
            'anak_ke'          => 'nullable|integer',
            'jumlah_saudara'   => 'nullable|integer',
            'golongan_darah'   => 'nullable|string',
            'berat_badan_kg'   => 'nullable|numeric',
            'tinggi_badan_cm'  => 'nullable|numeric',
            'lingkar_kepala_cm'=> 'nullable|numeric',
            'imunisasi'        => 'nullable|string',
            // AlamatAnak
            'jalan'               => 'nullable|string',
            'kelurahan'           => 'nullable|string',
            'kecamatan'           => 'nullable|string',
            'kota'                => 'nullable|string',
            'provinsi'            => 'nullable|string',
            'kode_pos'            => 'nullable|string',
            'jarak_ke_sekolah_km' => 'nullable|numeric',
            'telp_ayah'           => 'nullable|string',
            'telp_ibu'            => 'nullable|string',
            // OrangTua
            'nama_ayah'       => 'nullable|string',
            'nik_ayah'        => 'nullable|string',
            'ttl_ayah'        => 'nullable|string',
            'pendidikan_ayah' => 'nullable|string',
            'pekerjaan_ayah'  => 'nullable|string',
            'kantor_ayah'     => 'nullable|string',
            'nama_ibu'        => 'nullable|string',
            'nik_ibu'         => 'nullable|string',
            'ttl_ibu'         => 'nullable|string',
            'pendidikan_ibu'  => 'nullable|string',
            'pekerjaan_ibu'   => 'nullable|string',
            'kantor_ibu'      => 'nullable|string',
        ]);

        // Update Anak
        $anak->update($request->only([
            'nama_panggilan', 'tempat_lahir', 'tanggal_lahir', 'agama', 'kewarganegaraan'
        ]));

        // Fix: Use eager-loaded relation instead of extra DB query
        $dataAnak = $anak->dataAnak ?? DataAnak::firstOrCreate(['id_anak' => $anak->id_anak]);
        $dataAnak->update($request->only([
            'hobi', 'cita_cita', 'anak_ke', 'jumlah_saudara', 'golongan_darah',
            'berat_badan_kg', 'tinggi_badan_cm', 'lingkar_kepala_cm', 'imunisasi'
        ]));

        $alamatAnak = $anak->alamatAnak ?? AlamatAnak::firstOrCreate(['id_anak' => $anak->id_anak]);
        $alamatAnak->update($request->only([
            'jalan', 'kelurahan', 'kecamatan', 'kota', 'provinsi', 'kode_pos',
            'jarak_ke_sekolah_km', 'telp_ayah', 'telp_ibu'
        ]));

        // Fix: Use eager-loaded orangTuas instead of extra DB query
        $ortuRecord = $anak->orangTuas->first();
        if ($ortuRecord) {
            $ortuRecord->update($request->only([
                'nama_ayah', 'nik_ayah', 'ttl_ayah', 'pendidikan_ayah', 'pekerjaan_ayah', 'kantor_ayah',
                'nama_ibu', 'nik_ibu', 'ttl_ibu', 'pendidikan_ibu', 'pekerjaan_ibu', 'kantor_ibu'
            ]));
        }

        // Fix: reload relations instead of full refetch from DB
        return response()->json([
            'message' => 'Data diri anak berhasil diperbarui',
            'data'    => $anak->refresh()->load(['kelas', 'dataAnak', 'alamatAnak', 'orangTuas']),
        ]);
    }

    /**
     * Fitur: Riwayat Perkembangan Akademik
     * Deskripsi: Menampilkan rekam perkembangan membaca, menulis, berhitung (calistung) anak yang diinput guru.
     */
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

    /**
     * Fitur: Riwayat Mengaji anak
     * Deskripsi: Menampilkan riwayat perkembangan membaca Iqra atau Al-Qur'an anak dari guru.
     */
    public function getChildNgajiProgress(Request $request)
    {
        $anak = $this->getAnak($request);
        if (!$anak) return response()->json([], 404);

        $progress = KartuNgaji::where('id_anak', $anak->id_anak)
            ->orderBy('tanggal', 'desc')
            ->get();

        return response()->json($progress);
    }

    /**
     * Fitur: Riwayat Kehadiran (Absensi)
     * Deskripsi: Menampilkan riwayat absensi harian anak (Hadir, Sakit, Izin, Alfa).
     */
    public function getChildAbsensi(Request $request)
    {
        $anak = $this->getAnak($request);
        if (!$anak) return response()->json([], 404);

        $absensi = Absensi::where('id_anak', $anak->id_anak)
            ->orderBy('tanggal', 'desc')
            ->get();

        return response()->json($absensi);
    }

    /**
     * Fitur: Daftar Kegiatan Sekolah
     * Deskripsi: Menampilkan daftar seluruh agenda/kegiatan luar sekolah yang aktif.
     */
    public function getKegiatanList()
    {
        return response()->json(Kegiatan::orderBy('tanggal', 'desc')->get());
    }

    /**
     * Fitur: Riwayat Pembayaran SPP
     * Deskripsi: Menampilkan daftar tagihan bulanan SPP siswa beserta status pembayarannya.
     */
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

    /**
     * Fitur: Unggah Bukti Bayar SPP
     * Deskripsi: Wali murid mengunggah file bukti transfer SPP untuk diverifikasi Admin.
     * Mengirimkan notifikasi baru ke semua Administrator secara real-time.
     */
    public function uploadSPPProof(Request $request)
    {
        $request->validate([
            'id_spp'         => 'required|exists:spps,id_spp',
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
                'bukti_transfer'    => $path,
                'status_pembayaran' => 'Menunggu Verifikasi',
                'tanggal_bayar'     => now()->toDateString(),
            ]);

            // Fix N+1: pluck only ids (1 query) then batch insert notifications
            $adminIds = User::where('role', 'admin')->pluck('id_user');

            if ($adminIds->isNotEmpty()) {
                $now        = now();
                $notifBatch = $adminIds->map(fn($adminUserId) => [
                    'id_user'    => $adminUserId,
                    'title'      => 'Pembayaran SPP Baru',
                    'message'    => 'Wali murid dari ' . $anak->nama_lengkap . ' telah mengunggah bukti pembayaran SPP untuk ' . $spp->bulan . ' ' . $spp->tahun . '.',
                    'is_read'    => false,
                    'created_at' => $now,
                    'updated_at' => $now,
                ])->all();
                Notification::insert($notifBatch);
            }

            return response()->json(['message' => 'Bukti pembayaran berhasil diupload', 'data' => $spp]);
        }

        return response()->json(['message' => 'Gagal mengupload bukti transfer'], 400);
    }
}
