import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icons } from '../../components/Icons';

const API_BASE = 'http://127.0.0.1:8000/api';

export const EditAnak = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form states
  const [namaLengkap, setNamaLengkap] = useState(''); // Read-only
  const [nisn, setNisn] = useState(''); // Read-only
  
  const [namaPanggilan, setNamaPanggilan] = useState('');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [agama, setAgama] = useState('Islam');
  const [kewarganegaraan, setKewarganegaraan] = useState('WNI');

  // Data Anak
  const [hobi, setHobi] = useState('');
  const [citaCita, setCitaCita] = useState('');
  const [anakKe, setAnakKe] = useState('');
  const [jumlahSaudara, setJumlahSaudara] = useState('');
  const [golonganDarah, setGolonganDarah] = useState('');
  const [beratBadan, setBeratBadan] = useState('');
  const [tinggiBadan, setTinggiBadan] = useState('');
  const [lingkarKepala, setLingkarKepala] = useState('');
  const [imunisasi, setImunisasi] = useState('');

  // Alamat Anak
  const [jalan, setJalan] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kota, setKota] = useState('');
  const [provinsi, setProvinsi] = useState('');
  const [kodePos, setKodePos] = useState('');
  const [jarakSekolah, setJarakSekolah] = useState('');
  const [telpAyah, setTelpAyah] = useState('');
  const [telpIbu, setTelpIbu] = useState('');

  // Data Ayah & Ibu
  const [namaAyah, setNamaAyah] = useState('');
  const [nikAyah, setNikAyah] = useState('');
  const [ttlAyah, setTtlAyah] = useState('');
  const [pendidikanAyah, setPendidikanAyah] = useState('');
  const [pekerjaanAyah, setPekerjaanAyah] = useState('');
  const [kantorAyah, setKantorAyah] = useState('');

  const [namaIbu, setNamaIbu] = useState('');
  const [nikIbu, setNikIbu] = useState('');
  const [ttlIbu, setTtlIbu] = useState('');
  const [pendidikanIbu, setPendidikanIbu] = useState('');
  const [pekerjaanIbu, setPekerjaanIbu] = useState('');
  const [kantorIbu, setKantorIbu] = useState('');

  const token = localStorage.getItem('token');

  const fetchChildInfo = async () => {
    try {
      const res = await axios.get(`${API_BASE}/wali/anak`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data;
      
      setNamaLengkap(data.nama_lengkap);
      setNisn(data.nisn || '');
      setNamaPanggilan(data.nama_panggilan || '');
      setTempatLahir(data.tempat_lahir || '');
      setTanggalLahir(data.tanggal_lahir ? data.tanggal_lahir.split('T')[0] : '');
      setAgama(data.agama || 'Islam');
      setKewarganegaraan(data.kewarganegaraan || 'WNI');

      const extra = data.data_anak || {};
      setHobi(extra.hobi || '');
      setCitaCita(extra.cita_cita || '');
      setAnakKe(extra.anak_ke || '');
      setJumlahSaudara(extra.jumlah_saudara || '');
      setGolonganDarah(extra.golongan_darah || '');
      setBeratBadan(extra.berat_badan_kg || '');
      setTinggiBadan(extra.tinggi_badan_cm || '');
      setLingkarKepala(extra.lingkar_kepala_cm || '');
      setImunisasi(extra.imunisasi || '');

      const addr = data.alamat_anak || {};
      setJalan(addr.jalan || '');
      setKelurahan(addr.kelurahan || '');
      setKecamatan(addr.kecamatan || '');
      setKota(addr.kota || '');
      setProvinsi(addr.provinsi || '');
      setKodePos(addr.kode_pos || '');
      setJarakSekolah(addr.jarak_ke_sekolah_km || '');
      setTelpAyah(addr.telp_ayah || '');
      setTelpIbu(addr.telp_ibu || '');

      const ortu = data.orang_tuas?.[0] || {};
      setNamaAyah(ortu.nama_ayah || '');
      setNikAyah(ortu.nik_ayah || '');
      setTtlAyah(ortu.ttl_ayah || '');
      setPendidikanAyah(ortu.pendidikan_ayah || '');
      setPekerjaanAyah(ortu.pekerjaan_ayah || '');
      setKantorAyah(ortu.kantor_ayah || '');

      setNamaIbu(ortu.nama_ibu || '');
      setNikIbu(ortu.nik_ibu || '');
      setTtlIbu(ortu.ttl_ibu || '');
      setPendidikanIbu(ortu.pendidikan_ibu || '');
      setPekerjaanIbu(ortu.pekerjaan_ibu || '');
      setKantorIbu(ortu.kantor_ibu || '');

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Gagal memuat profil anak.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    const payload = {
      nama_panggilan: namaPanggilan,
      tempat_lahir: tempatLahir,
      tanggal_lahir: tanggalLahir || null,
      agama,
      kewarganegaraan,
      hobi,
      cita_cita: citaCita,
      anak_ke: anakKe ? parseInt(anakKe) : null,
      jumlah_saudara: jumlahSaudara ? parseInt(jumlahSaudara) : null,
      golongan_darah: golonganDarah,
      berat_badan_kg: beratBadan ? parseFloat(beratBadan) : null,
      tinggi_badan_cm: tinggiBadan ? parseFloat(tinggiBadan) : null,
      lingkar_kepala_cm: lingkarKepala ? parseFloat(lingkarKepala) : null,
      imunisasi,
      jalan,
      kelurahan,
      kecamatan,
      kota,
      provinsi,
      kode_pos: kodePos,
      jarak_ke_sekolah_km: jarakSekolah ? parseFloat(jarakSekolah) : null,
      telp_ayah: telpAyah,
      telp_ibu: telpIbu,
      nama_ayah: namaAyah,
      nik_ayah: nikAyah,
      ttl_ayah: ttlAyah,
      pendidikan_ayah: pendidikanAyah,
      pekerjaan_ayah: pekerjaanAyah,
      kantor_ayah: kantorAyah,
      nama_ibu: namaIbu,
      nik_ibu: nikIbu,
      ttl_ibu: ttlIbu,
      pendidikan_ibu: pendidikanIbu,
      pekerjaan_ibu: pekerjaanIbu,
      kantor_ibu: kantorIbu
    };

    try {
      await axios.put(`${API_BASE}/wali/anak`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Biodata dan informasi profil anak berhasil diperbarui!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan pembaruan.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Memuat profil anak...</div>;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-tk-primary m-0">Ubah Biodata Diri Anak</h1>
        <p className="text-tk-muted text-[0.9rem] mt-1 m-0">Perbarui informasi dasar, rekam medis ringkas, hobi, dan kontak darurat anak.</p>
      </header>

      {success && (
        <div className="bg-green-100 text-green-700 border border-green-200 p-4 rounded-lg font-semibold text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-lg font-semibold text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-tk-card border border-tk-border rounded-xl shadow-sm p-8 flex flex-col gap-6">
        
        {/* Siswa Identitas Read-Only */}
        <div className="bg-[#FAFAFA] border border-tk-border rounded-lg p-5">
          <h3 className="text-sm font-bold text-tk-primary uppercase tracking-wider mb-3 m-0">Identitas Sekolah (Tidak Dapat Diubah)</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-tk-muted">Nama Lengkap: </span>
              <span className="font-bold text-tk-text">{namaLengkap}</span>
            </div>
            <div>
              <span className="font-semibold text-tk-muted">NISN: </span>
              <span className="font-bold text-tk-text">{nisn || '-'}</span>
            </div>
          </div>
        </div>

        {/* 1. DATA PRIBADI */}
        <section className="flex flex-col gap-4">
          <h3 className="text-base font-bold text-tk-primary border-b border-tk-border pb-2 m-0">1. Biodata Pribadi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-tk-text">Nama Panggilan</label>
              <input type="text" value={namaPanggilan} onChange={(e) => setNamaPanggilan(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-tk-text">Tempat Lahir</label>
              <input type="text" value={tempatLahir} onChange={(e) => setTempatLahir(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-tk-text">Tanggal Lahir</label>
              <input type="date" value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-tk-text">Agama</label>
              <input type="text" value={agama} onChange={(e) => setAgama(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-tk-text">Kewarganegaraan</label>
              <input type="text" value={kewarganegaraan} onChange={(e) => setKewarganegaraan(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
            </div>
          </div>
        </section>

        {/* 2. DATA UTAMA FISIK & HOBI */}
        <section className="flex flex-col gap-4">
          <h3 className="text-base font-bold text-tk-primary border-b border-tk-border pb-2 m-0">2. Kondisi Fisik & Hobi</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-tk-text">Hobi</label>
              <input type="text" value={hobi} onChange={(e) => setHobi(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-tk-text">Cita-cita</label>
              <input type="text" value={citaCita} onChange={(e) => setCitaCita(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-tk-text">Anak Ke-</label>
              <input type="number" value={anakKe} onChange={(e) => setAnakKe(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-tk-text">Jumlah Saudara</label>
              <input type="number" value={jumlahSaudara} onChange={(e) => setJumlahSaudara(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-tk-text">Golongan Darah</label>
              <input type="text" placeholder="A / B / AB / O" value={golonganDarah} onChange={(e) => setGolonganDarah(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-tk-text">Berat Badan (Kg)</label>
              <input type="number" step="0.1" value={beratBadan} onChange={(e) => setBeratBadan(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-tk-text">Tinggi Badan (Cm)</label>
              <input type="number" step="0.1" value={tinggiBadan} onChange={(e) => setTinggiBadan(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-tk-text">Lingkar Kepala (Cm)</label>
              <input type="number" step="0.1" value={lingkarKepala} onChange={(e) => setLingkarKepala(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-tk-text">Riwayat Imunisasi</label>
            <input type="text" placeholder="e.g. Lengkap (BCG, Polio, Campak)" value={imunisasi} onChange={(e) => setImunisasi(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
          </div>
        </section>

        {/* 3. ALAMAT & KONTAK WALI */}
        <section className="flex flex-col gap-4">
          <h3 className="text-base font-bold text-tk-primary border-b border-tk-border pb-2 m-0">3. Alamat Rumah & Kontak Wali</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-tk-text">Jalan (Alamat Rumah)</label>
              <input type="text" value={jalan} onChange={(e) => setJalan(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
            </div>
            <div className="flex grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-sm font-semibold text-tk-text">Kelurahan</label>
                <input type="text" value={kelurahan} onChange={(e) => setKelurahan(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-sm font-semibold text-tk-text">Kecamatan</label>
                <input type="text" value={kecamatan} onChange={(e) => setKecamatan(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-tk-text">Kota</label>
              <input type="text" value={kota} onChange={(e) => setKota(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-tk-text">Provinsi</label>
              <input type="text" value={provinsi} onChange={(e) => setProvinsi(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-tk-text">Kode Pos</label>
              <input type="text" value={kodePos} onChange={(e) => setKodePos(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-tk-text">Jarak ke Sekolah (Km)</label>
              <input type="number" step="0.1" value={jarakSekolah} onChange={(e) => setJarakSekolah(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-tk-text">No. Telepon Ayah</label>
              <input type="text" value={telpAyah} onChange={(e) => setTelpAyah(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-tk-text">No. Telepon Ibu</label>
              <input type="text" value={telpIbu} onChange={(e) => setTelpIbu(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none focus:border-tk-primary" />
            </div>
          </div>
        </section>

        {/* 4. DATA ORANG TUA (AYAH & IBU) */}
        <section className="flex flex-col gap-4">
          <h3 className="text-base font-bold text-tk-primary border-b border-tk-border pb-2 m-0">4. Informasi Orang Tua (Ayah & Ibu)</h3>
          
          {/* Data Ayah */}
          <div className="bg-[#FAFAFA] border border-tk-border rounded-lg p-5 flex flex-col gap-4">
            <h4 className="text-sm font-bold text-tk-primary m-0 uppercase tracking-wider">A. Data Ayah</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tk-text">Nama Lengkap Ayah</label>
                <input required type="text" value={namaAyah} onChange={(e) => setNamaAyah(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none bg-white focus:border-tk-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tk-text">NIK Ayah</label>
                <input type="text" value={nikAyah} onChange={(e) => setNikAyah(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none bg-white focus:border-tk-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tk-text">Tempat, Tanggal Lahir Ayah</label>
                <input type="text" placeholder="e.g. Pekanbaru, 12-08-1988" value={ttlAyah} onChange={(e) => setTtlAyah(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none bg-white focus:border-tk-primary" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tk-text">Pendidikan Tertinggi Ayah</label>
                <input type="text" value={pendidikanAyah} onChange={(e) => setPendidikanAyah(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none bg-white focus:border-tk-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tk-text">Pekerjaan Ayah</label>
                <input type="text" value={pekerjaanAyah} onChange={(e) => setPekerjaanAyah(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none bg-white focus:border-tk-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tk-text">Alamat & Telp Kantor Ayah</label>
                <input type="text" value={kantorAyah} onChange={(e) => setKantorAyah(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none bg-white focus:border-tk-primary" />
              </div>
            </div>
          </div>

          {/* Data Ibu */}
          <div className="bg-[#FAFAFA] border border-tk-border rounded-lg p-5 flex flex-col gap-4">
            <h4 className="text-sm font-bold text-tk-primary m-0 uppercase tracking-wider">B. Data Ibu</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tk-text">Nama Lengkap Ibu</label>
                <input required type="text" value={namaIbu} onChange={(e) => setNamaIbu(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none bg-white focus:border-tk-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tk-text">NIK Ibu</label>
                <input type="text" value={nikIbu} onChange={(e) => setNikIbu(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none bg-white focus:border-tk-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tk-text">Tempat, Tanggal Lahir Ibu</label>
                <input type="text" placeholder="e.g. Pekanbaru, 25-04-1990" value={ttlIbu} onChange={(e) => setTtlIbu(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none bg-white focus:border-tk-primary" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tk-text">Pendidikan Tertinggi Ibu</label>
                <input type="text" value={pendidikanIbu} onChange={(e) => setPendidikanIbu(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none bg-white focus:border-tk-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tk-text">Pekerjaan Ibu</label>
                <input type="text" value={pekerjaanIbu} onChange={(e) => setPekerjaanIbu(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none bg-white focus:border-tk-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tk-text">Alamat & Telp Kantor Ibu</label>
                <input type="text" value={kantorIbu} onChange={(e) => setKantorIbu(e.target.value)} className="p-2 border border-tk-border rounded-md outline-none bg-white focus:border-tk-primary" />
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end border-t border-tk-border pt-6 mt-4">
          <button type="submit" disabled={saving} className="btn-primary px-8 py-3">
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
};
