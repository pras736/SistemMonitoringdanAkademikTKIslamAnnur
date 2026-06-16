import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icons } from '../../components/Icons';

const API_BASE = 'http://127.0.0.1:8000/api';

export const ManageGuru = () => {
  const [gurus, setGurus] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form States
  const [editingId, setEditingId] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [namaGuru, setNamaGuru] = useState('');
  const [nip, setNip] = useState('');
  const [noTelp, setNoTelp] = useState('');
  const [idKelas, setIdKelas] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchGurus = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/guru`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGurus(res.data);
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
    Promise.all([fetchGurus(), fetchKelas()]).finally(() => setLoading(false));
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setUsername('');
    setPassword('');
    setNamaGuru('');
    setNip('');
    setNoTelp('');
    setIdKelas('');
    setError('');
    setShowModal(true);
  };

  const handleOpenEdit = (guru) => {
    setEditingId(guru.id_guru);
    setUsername(guru.user?.username || '');
    setPassword('');
    setNamaGuru(guru.nama_guru);
    setNip(guru.nip || '');
    setNoTelp(guru.no_telp);
    setIdKelas(guru.id_kelas || '');
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      username,
      nama_guru: namaGuru,
      nip,
      no_telp: noTelp,
      id_kelas: idKelas || null,
    };
    if (password) {
      payload.password = password;
    }

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/admin/guru/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        if (!password) {
          setError('Password wajib diisi untuk guru baru.');
          return;
        }
        payload.password = password;
        await axios.post(`${API_BASE}/admin/guru`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowModal(false);
      fetchGurus();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data guru ini? Akun login guru juga akan terhapus.')) {
      try {
        await axios.delete(`${API_BASE}/admin/guru/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchGurus();
      } catch (err) {
        alert('Gagal menghapus data guru.');
      }
    }
  };

  if (loading) return <div>Loading data guru...</div>;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-tk-primary m-0">Mengelola Data Guru</h1>
          <p className="text-tk-muted text-[0.9rem] mt-1 m-0">Tambah, ubah, dan hapus data staf pengajar TK Islam An Nur.</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary">
          <Icons.Plus /> Tambah Guru
        </button>
      </header>

      <div className="bg-tk-card border border-tk-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-tk-bg">
              <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">NIP</th>
              <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Nama Guru</th>
              <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Username</th>
              <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">No. Telepon</th>
              <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Wali Kelas</th>
              <th className="p-4 font-semibold text-tk-primary border-b border-tk-border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {gurus.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-tk-muted">Belum ada data guru.</td>
              </tr>
            ) : (
              gurus.map((guru) => (
                <tr key={guru.id_guru} className="hover:bg-tk-bg/50">
                  <td className="p-4 border-b border-tk-border font-medium">{guru.nip || '-'}</td>
                  <td className="p-4 border-b border-tk-border font-semibold text-tk-text">{guru.nama_guru}</td>
                  <td className="p-4 border-b border-tk-border text-[0.9rem]">
                    <div className="font-semibold text-tk-text">{guru.user?.username}</div>
                    <div className="text-tk-muted">-</div>
                  </td>
                  <td className="p-4 border-b border-tk-border">{guru.no_telp}</td>
                  <td className="p-4 border-b border-tk-border font-medium text-tk-primary">
                    {guru.kelas ? guru.kelas.nama_kelas : <span className="text-tk-muted">-</span>}
                  </td>
                  <td className="p-4 border-b border-tk-border text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleOpenEdit(guru)} className="px-3 py-1.5 border border-tk-primary text-tk-primary hover:bg-tk-secondary-light rounded-md font-semibold text-sm transition-colors cursor-pointer">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(guru.id_guru)} className="px-3 py-1.5 border border-red-600 text-red-600 hover:bg-red-50 rounded-md font-semibold text-sm transition-colors cursor-pointer">
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

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-tk-border animate-in fade-in zoom-in duration-200">
            <header className="bg-tk-primary text-white p-5 flex justify-between items-center">
              <h2 className="text-lg font-bold m-0">{editingId ? 'Edit Data Guru' : 'Tambah Guru Baru'}</h2>
              <button onClick={() => setShowModal(false)} className="text-white hover:opacity-80 bg-transparent border-0 text-xl font-bold cursor-pointer">&times;</button>
            </header>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {error && (
                <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-md text-sm">{error}</div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-tk-text">Nama Lengkap</label>
                  <input required type="text" value={namaGuru} onChange={(e) => setNamaGuru(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-tk-text">NIP (Opsional)</label>
                  <input type="text" value={nip} onChange={(e) => setNip(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-tk-text">No. Telepon</label>
                  <input required type="text" value={noTelp} onChange={(e) => setNoTelp(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-tk-text">Wali Kelas</label>
                  <select value={idKelas} onChange={(e) => setIdKelas(e.target.value)} className="p-2 border border-tk-border rounded-md bg-white focus:border-tk-primary outline-none">
                    <option value="">Bukan Wali Kelas</option>
                    {kelas.map((kls) => (
                      <option key={kls.id_kelas} value={kls.id_kelas}>{kls.nama_kelas}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t border-tk-border pt-4 mt-2">
                <h3 className="text-sm font-bold text-tk-primary mb-3 uppercase tracking-wider">Kredensial Akun Login</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-tk-text">Username</label>
                    <input required type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
                  </div>
                  <div className="flex flex-col gap-1.5">

                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-tk-text">Password {editingId && '(Kosongkan jika tidak ingin mengubah)'}</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" placeholder="••••••" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-tk-border pt-4 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-tk-text rounded-md font-semibold cursor-pointer">Batal</button>
                <button type="submit" className="px-4 py-2 bg-tk-primary hover:bg-tk-primary-light text-white rounded-md font-semibold cursor-pointer">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
