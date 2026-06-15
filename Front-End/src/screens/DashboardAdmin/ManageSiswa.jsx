import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icons } from '../../components/Icons';

const API_BASE = 'http://127.0.0.1:8000/api';

export const ManageSiswa = () => {
  const [tab, setTab] = useState('siswa'); // 'siswa' or 'kelas'
  const [siswa, setSiswa] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showKelasModal, setShowKelasModal] = useState(false);
  const [showSiswaModal, setShowSiswaModal] = useState(false);

  // Kelas Form State
  const [editingKelasId, setEditingKelasId] = useState(null);
  const [namaKelas, setNamaKelas] = useState('');
  const [tahunAjaran, setTahunAjaran] = useState('');
  const [kapasitas, setKapasitas] = useState(20);

  // Siswa Form State
  const [editingSiswaId, setEditingSiswaId] = useState(null);
  const [namaLengkap, setNamaLengkap] = useState('');
  const [namaPanggilan, setNamaPanggilan] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('Laki-laki');
  const [nisn, setNisn] = useState('');
  const [nik, setNik] = useState('');
  const [noRegAkte, setNoRegAkte] = useState('');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [agama, setAgama] = useState('Islam');
  const [kewarganegaraan, setKewarganegaraan] = useState('WNI');
  const [idKelas, setIdKelas] = useState('');

  // Parent account info (only when creating new student)
  const [usernameOrtu, setUsernameOrtu] = useState('');
  const [emailOrtu, setEmailOrtu] = useState('');
  const [passwordOrtu, setPasswordOrtu] = useState('');
  const [namaAyah, setNamaAyah] = useState('');
  const [namaIbu, setNamaIbu] = useState('');

  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchSiswa = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/siswa`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSiswa(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchKelas = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/kelas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKelas(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    Promise.all([fetchSiswa(), fetchKelas()]).finally(() => setLoading(false));
  }, []);

  // KELAS CRUD
  const handleOpenAddKelas = () => {
    setEditingKelasId(null);
    setNamaKelas('');
    setTahunAjaran('2025/2026');
    setKapasitas(20);
    setError('');
    setShowKelasModal(true);
  };

  const handleOpenEditKelas = (k) => {
    setEditingKelasId(k.id_kelas);
    setNamaKelas(k.nama_kelas);
    setTahunAjaran(k.tahun_ajaran);
    setKapasitas(k.kapasitas);
    setError('');
    setShowKelasModal(true);
  };

  const handleKelasSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = { nama_kelas: namaKelas, tahun_ajaran: tahunAjaran, kapasitas };
    try {
      if (editingKelasId) {
        await axios.put(`${API_BASE}/admin/kelas/${editingKelasId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE}/admin/kelas`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowKelasModal(false);
      fetchKelas();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan kelas.');
    }
  };

  const handleKelasDelete = async (id) => {
    if (window.confirm('Hapus kelas ini? Siswa yang berada di kelas ini akan diset wali kelasnya menjadi kosong.')) {
      try {
        await axios.delete(`${API_BASE}/admin/kelas/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchKelas();
        fetchSiswa();
      } catch (err) {
        alert('Gagal menghapus kelas.');
      }
    }
  };

  // SISWA CRUD
  const handleOpenAddSiswa = () => {
    setEditingSiswaId(null);
    setNamaLengkap('');
    setNamaPanggilan('');
    setJenisKelamin('Laki-laki');
    setNisn('');
    setNik('');
    setNoRegAkte('');
    setTempatLahir('');
    setTanggalLahir('');
    setAgama('Islam');
    setKewarganegaraan('WNI');
    setIdKelas(kelas[0]?.id_kelas || '');

    setUsernameOrtu('');
    setEmailOrtu('');
    setPasswordOrtu('');
    setNamaAyah('');
    setNamaIbu('');

    setError('');
    setShowSiswaModal(true);
  };

  const handleOpenEditSiswa = (s) => {
    setEditingSiswaId(s.id_anak);
    setNamaLengkap(s.nama_lengkap);
    setNamaPanggilan(s.nama_panggilan || '');
    setJenisKelamin(s.jenis_kelamin);
    setNisn(s.nisn || '');
    setNik(s.nik || '');
    setNoRegAkte(s.no_reg_akte || '');
    setTempatLahir(s.tempat_lahir || '');
    setTanggalLahir(s.tanggal_lahir ? s.tanggal_lahir.split('T')[0] : '');
    setAgama(s.agama || 'Islam');
    setKewarganegaraan(s.kewarganegaraan || 'WNI');
    setIdKelas(s.id_kelas || '');
    setError('');
    setShowSiswaModal(true);
  };

  const handleSiswaSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      nama_lengkap: namaLengkap,
      nama_panggilan: namaPanggilan,
      jenis_kelamin: jenisKelamin,
      nisn,
      nik,
      no_reg_akte: noRegAkte,
      tempat_lahir: tempatLahir,
      tanggal_lahir: tanggalLahir || null,
      agama,
      kewarganegaraan,
      id_kelas: idKelas || null,
    };

    try {
      if (editingSiswaId) {
        await axios.put(`${API_BASE}/admin/siswa/${editingSiswaId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Validation for parent info
        if (!usernameOrtu || !emailOrtu || !passwordOrtu || !namaAyah || !namaIbu) {
          setError('Semua info wali murid wajib diisi untuk siswa baru.');
          return;
        }
        payload.username_ortu = usernameOrtu;
        payload.email_ortu = emailOrtu;
        payload.password_ortu = passwordOrtu;
        payload.nama_ayah = namaAyah;
        payload.nama_ibu = namaIbu;

        await axios.post(`${API_BASE}/admin/siswa`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowSiswaModal(false);
      fetchSiswa();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan siswa.');
    }
  };

  const handleSiswaDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data siswa ini beserta data dan akun wali muridnya?')) {
      try {
        await axios.delete(`${API_BASE}/admin/siswa/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchSiswa();
      } catch (err) {
        alert('Gagal menghapus siswa.');
      }
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await axios.get(`${API_BASE}/admin/siswa/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data_siswa_lengkap.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert('Gagal mengekspor data siswa.');
    }
  };

  if (loading) return <div>Loading data akademik...</div>;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-tk-primary m-0">Mengelola Data Akademik</h1>
          <p className="text-tk-muted text-[0.9rem] mt-1 m-0">Kelola data kelas dan siswa TK Islam An Nur.</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-tk-border">
        <button onClick={() => setTab('siswa')} className={`pb-3 font-bold text-base bg-transparent border-0 border-b-2 cursor-pointer transition-all duration-200 outline-none ${tab === 'siswa' ? 'border-tk-primary text-tk-primary' : 'border-transparent text-tk-muted'}`}>
          Data Siswa ({siswa.length})
        </button>
        <button onClick={() => setTab('kelas')} className={`pb-3 font-bold text-base bg-transparent border-0 border-b-2 cursor-pointer transition-all duration-200 outline-none ${tab === 'kelas' ? 'border-tk-primary text-tk-primary' : 'border-transparent text-tk-muted'}`}>
          Data Kelas ({kelas.length})
        </button>
      </div>

      {tab === 'siswa' ? (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end gap-3">
            <button onClick={handleExportExcel} className="btn-outline">
              Ekspor Excel
            </button>
            <button onClick={handleOpenAddSiswa} className="btn-primary">
              <Icons.Plus /> Tambah Siswa & Wali
            </button>
          </div>

          <div className="bg-tk-card border border-tk-border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-tk-bg">
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">NISN / NIK</th>
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Nama Siswa</th>
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Kelas</th>
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Wali Murid</th>
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {siswa.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-tk-muted">Belum ada data siswa.</td>
                  </tr>
                ) : (
                  siswa.map((s) => (
                    <tr key={s.id_anak} className="hover:bg-tk-bg/50">
                      <td className="p-4 border-b border-tk-border text-[0.85rem]">
                        <div className="font-medium text-tk-text">NISN: {s.nisn || '-'}</div>
                        <div className="text-tk-muted">NIK: {s.nik || '-'}</div>
                      </td>
                      <td className="p-4 border-b border-tk-border">
                        <div className="font-semibold text-tk-text">{s.nama_lengkap}</div>
                        <div className="text-xs text-tk-muted">Panggilan: {s.nama_panggilan || '-'} | {s.jenis_kelamin}</div>
                      </td>
                      <td className="p-4 border-b border-tk-border font-medium text-tk-primary">
                        {s.kelas ? s.kelas.nama_kelas : <span className="text-tk-muted">Belum Ditentukan</span>}
                      </td>
                      <td className="p-4 border-b border-tk-border text-[0.85rem]">
                        {s.orang_tuas && s.orang_tuas.map((o) => (
                          <div key={o.id_ortu} className="text-tk-text font-medium flex flex-col gap-0.5">
                            <div>Ayah: {o.nama_ayah}</div>
                            <div>Ibu: {o.nama_ibu}</div>
                          </div>
                        ))}
                      </td>
                      <td className="p-4 border-b border-tk-border text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleOpenEditSiswa(s)} className="px-3 py-1.5 border border-tk-primary text-tk-primary hover:bg-tk-secondary-light rounded-md font-semibold text-sm transition-colors cursor-pointer">
                            Edit
                          </button>
                          <button onClick={() => handleSiswaDelete(s.id_anak)} className="px-3 py-1.5 border border-red-600 text-red-600 hover:bg-red-50 rounded-md font-semibold text-sm transition-colors cursor-pointer">
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <button onClick={handleOpenAddKelas} className="btn-primary">
              <Icons.Plus /> Tambah Kelas
            </button>
          </div>

          <div className="bg-tk-card border border-tk-border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-tk-bg">
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Nama Kelas</th>
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Tahun Ajaran</th>
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Kapasitas</th>
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kelas.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-tk-muted">Belum ada data kelas.</td>
                  </tr>
                ) : (
                  kelas.map((k) => (
                    <tr key={k.id_kelas} className="hover:bg-tk-bg/50">
                      <td className="p-4 border-b border-tk-border font-semibold text-tk-text">{k.nama_kelas}</td>
                      <td className="p-4 border-b border-tk-border font-semibold text-tk-muted">{k.tahun_ajaran}</td>
                      <td className="p-4 border-b border-tk-border font-medium text-tk-text">{k.kapasitas} Anak</td>
                      <td className="p-4 border-b border-tk-border text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleOpenEditKelas(k)} className="px-3 py-1.5 border border-tk-primary text-tk-primary hover:bg-tk-secondary-light rounded-md font-semibold text-sm transition-colors cursor-pointer">
                            Edit
                          </button>
                          <button onClick={() => handleKelasDelete(k.id_kelas)} className="px-3 py-1.5 border border-red-600 text-red-600 hover:bg-red-50 rounded-md font-semibold text-sm transition-colors cursor-pointer">
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Kelas Modal */}
      {showKelasModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-tk-border animate-in fade-in zoom-in duration-200">
            <header className="bg-tk-primary text-white p-5 flex justify-between items-center">
              <h2 className="text-lg font-bold m-0">{editingKelasId ? 'Edit Data Kelas' : 'Tambah Kelas Baru'}</h2>
              <button onClick={() => setShowKelasModal(false)} className="text-white hover:opacity-80 bg-transparent border-0 text-xl font-bold cursor-pointer">&times;</button>
            </header>

            <form onSubmit={handleKelasSubmit} className="p-6 flex flex-col gap-4">
              {error && <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-md text-sm">{error}</div>}

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-tk-text">Nama Kelas</label>
                <input required type="text" placeholder="e.g. Kelas A (Mawar)" value={namaKelas} onChange={(e) => setNamaKelas(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-tk-text">Tahun Ajaran</label>
                  <input required type="text" placeholder="e.g. 2025/2026" value={tahunAjaran} onChange={(e) => setTahunAjaran(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-tk-text">Kapasitas</label>
                  <input required type="number" value={kapasitas} onChange={(e) => setKapasitas(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-tk-border pt-4 mt-4">
                <button type="button" onClick={() => setShowKelasModal(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-tk-text rounded-md font-semibold cursor-pointer">Batal</button>
                <button type="submit" className="px-4 py-2 bg-tk-primary hover:bg-tk-primary-light text-white rounded-md font-semibold cursor-pointer">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Siswa Modal */}
      {showSiswaModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-tk-border animate-in fade-in zoom-in duration-200 my-8">
            <header className="bg-tk-primary text-white p-5 flex justify-between items-center">
              <h2 className="text-lg font-bold m-0">{editingSiswaId ? 'Edit Data Siswa' : 'Tambah Siswa & Akun Wali'}</h2>
              <button onClick={() => setShowSiswaModal(false)} className="text-white hover:opacity-80 bg-transparent border-0 text-xl font-bold cursor-pointer">&times;</button>
            </header>

            <form onSubmit={handleSiswaSubmit} className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
              {error && <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-md text-sm">{error}</div>}

              <h3 className="text-sm font-bold text-tk-primary uppercase tracking-wider mb-0">Biodata Siswa</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-tk-text">Nama Lengkap</label>
                  <input required type="text" value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-tk-text">Nama Panggilan</label>
                  <input type="text" value={namaPanggilan} onChange={(e) => setNamaPanggilan(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-tk-text">Jenis Kelamin</label>
                  <select value={jenisKelamin} onChange={(e) => setJenisKelamin(e.target.value)} className="p-2 border border-tk-border rounded-md bg-white focus:border-tk-primary outline-none">
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-tk-text">NISN (Opsional)</label>
                  <input type="text" value={nisn} onChange={(e) => setNisn(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-tk-text">NIK (Opsional)</label>
                  <input type="text" value={nik} onChange={(e) => setNik(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-tk-text">Tempat Lahir</label>
                  <input type="text" value={tempatLahir} onChange={(e) => setTempatLahir(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-tk-text">Tanggal Lahir</label>
                  <input type="date" value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-tk-text">Agama</label>
                  <input type="text" value={agama} onChange={(e) => setAgama(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-tk-text">Kewarganegaraan</label>
                  <input type="text" value={kewarganegaraan} onChange={(e) => setKewarganegaraan(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-tk-text">Kelas</label>
                  <select value={idKelas} onChange={(e) => setIdKelas(e.target.value)} className="p-2 border border-tk-border rounded-md bg-white focus:border-tk-primary outline-none">
                    <option value="">Pilih Kelas</option>
                    {kelas.map((kls) => (
                      <option key={kls.id_kelas} value={kls.id_kelas}>{kls.nama_kelas}</option>
                    ))}
                  </select>
                </div>
              </div>

              {!editingSiswaId && (
                <div className="border-t border-tk-border pt-4 mt-2">
                  <h3 className="text-sm font-bold text-tk-primary uppercase tracking-wider mb-3">Pembuatan Akun Login Wali Murid</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-tk-text">Nama Ayah</label>
                      <input required type="text" value={namaAyah} onChange={(e) => setNamaAyah(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-tk-text">Nama Ibu</label>
                      <input required type="text" value={namaIbu} onChange={(e) => setNamaIbu(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-tk-text">Username Wali</label>
                      <input required type="text" value={usernameOrtu} onChange={(e) => setUsernameOrtu(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-tk-text">Email Wali</label>
                      <input required type="email" value={emailOrtu} onChange={(e) => setEmailOrtu(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-tk-text">Password Wali</label>
                      <input required type="password" value={passwordOrtu} onChange={(e) => setPasswordOrtu(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" placeholder="••••••" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-tk-border pt-4 mt-4">
                <button type="button" onClick={() => setShowSiswaModal(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-tk-text rounded-md font-semibold cursor-pointer">Batal</button>
                <button type="submit" className="px-4 py-2 bg-tk-primary hover:bg-tk-primary-light text-white rounded-md font-semibold cursor-pointer">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
