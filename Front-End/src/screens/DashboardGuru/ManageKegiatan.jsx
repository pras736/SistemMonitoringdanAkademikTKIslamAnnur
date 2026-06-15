import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icons } from '../../components/Icons';

const API_BASE = 'http://127.0.0.1:8000/api';

export const ManageKegiatan = () => {
  const [kegiatans, setKegiatans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [foto, setFoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchKegiatans = async () => {
    try {
      const res = await axios.get(`${API_BASE}/guru/kegiatan`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKegiatans(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKegiatans();
  }, []);

  const handleFileChange = (e) => {
    setFoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('deskripsi', deskripsi);
    formData.append('tanggal', tanggal);
    if (foto) {
      formData.append('foto', foto);
    }

    try {
      await axios.post(`${API_BASE}/guru/kegiatan`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Kegiatan luar sekolah berhasil dipublikasikan!');
      setJudul('');
      setDeskripsi('');
      setTanggal(new Date().toISOString().split('T')[0]);
      setFoto(null);
      fetchKegiatans();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Gagal menambahkan kegiatan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengumuman kegiatan ini?')) {
      try {
        await axios.delete(`${API_BASE}/guru/kegiatan/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchKegiatans();
      } catch (err) {
        alert('Gagal menghapus kegiatan.');
      }
    }
  };

  const getFullImageUrl = (path) => {
    if (!path) return '';
    return `http://127.0.0.1:8000/storage/${path}`;
  };

  if (loading) return <div>Loading data kegiatan...</div>;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-tk-primary m-0">Kegiatan Luar Sekolah</h1>
        <p className="text-tk-muted text-[0.9rem] mt-1 m-0">Tambah dan bagikan info kegiatan luar sekolah TK kepada wali murid.</p>
      </header>

      {message && (
        <div className="bg-green-100 text-green-700 border border-green-200 p-4 rounded-lg font-semibold text-sm">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form Input */}
        <form onSubmit={handleSubmit} className="bg-tk-card p-6 border border-tk-border rounded-xl shadow-sm flex flex-col gap-4">
          <h2 className="text-base font-bold text-tk-primary m-0 border-b border-tk-border pb-3">Tambah Kegiatan Baru</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-tk-text">Judul Kegiatan</label>
            <input required type="text" placeholder="e.g. Field Trip / Kunjungan Museum" value={judul} onChange={(e) => setJudul(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-tk-text">Tanggal Pelaksanaan</label>
            <input required type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-tk-text">Deskripsi Kegiatan</label>
            <textarea required rows="4" placeholder="Jelaskan detail waktu, perlengkapan, dan agenda kegiatan..." value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none font-sans" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-tk-text">Foto Kegiatan (Opsional)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none bg-white" />
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full py-2.5 mt-2">
            {saving ? 'Mempublikasikan...' : 'Publikasikan Kegiatan'}
          </button>
        </form>

        {/* List of Activities */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-tk-primary m-0 pb-2 border-b border-tk-border">Kegiatan yang Sudah Dipublikasikan</h2>
          {kegiatans.length === 0 ? (
            <div className="bg-tk-card p-8 text-center text-tk-muted rounded-xl border border-tk-border">Belum ada pengumuman kegiatan.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kegiatans.map(k => (
                <div key={k.id_kegiatan} className="bg-tk-card border border-tk-border rounded-xl overflow-hidden shadow-sm flex flex-col">
                  {k.foto ? (
                    <img src={getFullImageUrl(k.foto)} alt={k.judul} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-tk-secondary-light/45 flex items-center justify-center text-tk-primary font-bold">No Photo</div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold text-tk-muted">{k.tanggal ? k.tanggal.split('T')[0] : ''}</span>
                      <h3 className="text-base font-bold text-tk-text my-1">{k.judul}</h3>
                      <p className="text-sm text-tk-muted line-clamp-3 leading-relaxed mt-1 m-0">{k.deskripsi}</p>
                    </div>
                    <button onClick={() => handleDelete(k.id_kegiatan)} className="border border-red-600 text-red-600 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-red-50 transition-colors w-full cursor-pointer bg-transparent">
                      Hapus Kegiatan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
