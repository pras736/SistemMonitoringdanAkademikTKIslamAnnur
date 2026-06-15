const data = {
  "id_anak": 1,
  "id_kelas": 1,
  "nisn": "0123456789",
  "nik": "1471020304050001",
  "no_reg_akte": "AKTE-987654",
  "nama_lengkap": "Ahmad Rizky Al-Fatih",
  "nama_panggilan": "Rizky",
  "jenis_kelamin": "Laki-laki",
  "tempat_lahir": "Pekanbaru",
  "tanggal_lahir": "2020-05-15T00:00:00.000000Z",
  "agama": "Islam",
  "kewarganegaraan": "WNI",
  "created_at": "2026-06-15T16:22:41.000000Z",
  "updated_at": "2026-06-15T16:22:41.000000Z",
  "kelas": {
    "id_kelas": 1,
    "nama_kelas": "Kelas A (Mawar)",
    "tahun_ajaran": "2025/2026",
    "kapasitas": 20,
    "created_at": "2026-06-15T16:22:40.000000Z",
    "updated_at": "2026-06-15T16:22:40.000000Z"
  },
  "data_anak": {
    "id_data_anak": 1,
    "id_anak": 1,
    "hobi": "Mewarnai & Bermain",
    "cita_cita": "Dokter",
    "anak_ke": 1,
    "jumlah_saudara": 2,
    "golongan_darah": "B",
    "berat_badan_kg": 16.5,
    "tinggi_badan_cm": 105,
    "lingkar_kepala_cm": 50,
    "imunisasi": "Lengkap",
    "created_at": "2026-06-15T16:22:41.000000Z",
    "updated_at": "2026-06-15T16:22:41.000000Z"
  },
  "alamat_anak": {
    "id_alamat": 1,
    "id_anak": 1,
    "jalan": "Jl. Harapan Raya No. 10",
    "kelurahan": "Tangkerang Labuai",
    "kecamatan": "Bukit Raya",
    "kota": "Pekanbaru",
    "provinsi": "Riau",
    "kode_pos": "28282",
    "jarak_ke_sekolah_km": 1.2,
    "telp_ayah": "081287071046",
    "telp_ibu": "081317786752",
    "created_at": "2026-06-15T16:22:41.000000Z",
    "updated_at": "2026-06-15T16:22:41.000000Z"
  },
  "orang_tuas": [
    {
      "id_ortu": 1,
      "id_user": 5,
      "id_anak": 1,
      "nama_ayah": "Bapak Ahmad Hermansyah",
      "nik_ayah": "1471020304050011",
      "ttl_ayah": "Pekanbaru, 12-08-1985",
      "pendidikan_ayah": "S1 / D4",
      "pekerjaan_ayah": "Wiraswasta",
      "kantor_ayah": "Jl. Sudirman, Pekanbaru",
      "nama_ibu": "Ibu Sarah Aminah",
      "nik_ibu": "1471020304050012",
      "ttl_ibu": "Pekanbaru, 25-04-1988",
      "pendidikan_ibu": "S1 / D4",
      "pekerjaan_ibu": "Ibu Rumah Tangga",
      "kantor_ibu": "-",
      "created_at": "2026-06-15T16:22:41.000000Z",
      "updated_at": "2026-06-15T16:22:41.000000Z"
    }
  ]
};

try {
      console.log(data.nama_lengkap);
      console.log(data.nisn || '');
      console.log(data.nama_panggilan || '');
      console.log(data.tempat_lahir || '');
      console.log(data.tanggal_lahir ? data.tanggal_lahir.split('T')[0] : '');
      console.log(data.agama || 'Islam');
      console.log(data.kewarganegaraan || 'WNI');

      const extra = data.data_anak || {};
      console.log(extra.hobi || '');
      console.log(extra.cita_cita || '');
      console.log(extra.anak_ke || '');
      console.log(extra.jumlah_saudara || '');
      console.log(extra.golongan_darah || '');
      console.log(extra.berat_badan_kg || '');
      console.log(extra.tinggi_badan_cm || '');
      console.log(extra.lingkar_kepala_cm || '');
      console.log(extra.imunisasi || '');

      const addr = data.alamat_anak || {};
      console.log(addr.jalan || '');
      console.log(addr.kelurahan || '');
      console.log(addr.kecamatan || '');
      console.log(addr.kota || '');
      console.log(addr.provinsi || '');
      console.log(addr.kode_pos || '');
      console.log(addr.jarak_ke_sekolah_km || '');
      console.log(addr.telp_ayah || '');
      console.log(addr.telp_ibu || '');

      const ortu = data.orang_tuas?.[0] || {};
      console.log(ortu.nama_ayah || '');
      console.log(ortu.nik_ayah || '');
      console.log(ortu.ttl_ayah || '');
      console.log(ortu.pendidikan_ayah || '');
      console.log(ortu.pekerjaan_ayah || '');
      console.log(ortu.kantor_ayah || '');

      console.log(ortu.nama_ibu || '');
      console.log(ortu.nik_ibu || '');
      console.log(ortu.ttl_ibu || '');
      console.log(ortu.pendidikan_ibu || '');
      console.log(ortu.pekerjaan_ibu || '');
      console.log(ortu.kantor_ibu || '');
      console.log("SUCCESS");
} catch (e) {
  console.error("FAIL", e);
}
