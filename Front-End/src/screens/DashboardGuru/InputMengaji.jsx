import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icons } from '../../components/Icons';

const API_BASE = 'http://127.0.0.1:8000/api';

export const InputMengaji = () => {
  const [students, setStudents] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [idAnak, setIdAnak] = useState('');
  const [catatan, setCatatan] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const stRes = await axios.get(`${API_BASE}/guru/siswa`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(stRes.data);
      if (stRes.data.length > 0) {
        setIdAnak(stRes.data[0].id_anak);
      }

      const histRes = await axios.get(`${API_BASE}/guru/mengaji`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(histRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');

    try {
      await axios.post(`${API_BASE}/guru/mengaji`, {
        id_anak: parseInt(idAnak),
        catatan,
        tanggal
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Catatan mengaji berhasil disimpan!');
      setCatatan('');
      setTanggal(new Date().toISOString().split('T')[0]);
      // Refetch history
      const histRes = await axios.get(`${API_BASE}/guru/mengaji`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(histRes.data);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert('Gagal menyimpan catatan mengaji.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading data mengaji...</div>;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-tk-primary m-0">Catatan Mengaji Siswa</h1>
        <p className="text-tk-muted text-[0.9rem] mt-1 m-0">Catat perkembangan mengaji Iqra & Al-Quran para siswa.</p>
      </header>

      {success && (
        <div className="bg-green-100 text-green-700 border border-green-200 p-4 rounded-lg font-semibold text-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form Input */}
        <form onSubmit={handleSubmit} className="bg-tk-card p-6 border border-tk-border rounded-xl shadow-sm flex flex-col gap-4">
          <h2 className="text-base font-bold text-tk-primary m-0 border-b border-tk-border pb-3">Input Catatan Baru</h2>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-tk-text">Pilih Siswa</label>
            <select value={idAnak} onChange={(e) => setIdAnak(e.target.value)} className="p-2 border border-tk-border rounded-md bg-white focus:border-tk-primary outline-none">
              {students.map(s => (
                <option key={s.id_anak} value={s.id_anak}>{s.nama_lengkap}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-tk-text">Tanggal</label>
            <input required type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-tk-text">Catatan Perkembangan (Iqra / Surah)</label>
            <textarea 
              required 
              rows="3" 
              placeholder="Contoh: Iqra 4 Halaman 12 (Lancar membaca mad tobi'i)" 
              value={catatan} 
              onChange={(e) => setCatatan(e.target.value)} 
              className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none font-sans"
            />
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full py-2.5 mt-2">
            {saving ? 'Menyimpan...' : 'Simpan Catatan'}
          </button>
        </form>

        {/* History List */}
        <div className="lg:col-span-2 bg-tk-card border border-tk-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <h2 className="text-base font-bold text-tk-primary m-0 p-4 border-b border-tk-border bg-tk-bg">Riwayat Catatan Mengaji</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-tk-bg/30">
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Tanggal</th>
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Nama Siswa</th>
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Catatan Mengaji</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-6 text-center text-tk-muted">Belum ada riwayat mengaji.</td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr key={item.id_kart} className="hover:bg-tk-bg/50">
                      <td className="p-4 border-b border-tk-border font-medium text-tk-muted text-sm">
                        {item.tanggal ? item.tanggal.split('T')[0] : '-'}
                      </td>
                      <td className="p-4 border-b border-tk-border font-semibold text-tk-text">
                        {item.anak?.nama_lengkap}
                      </td>
                      <td className="p-4 border-b border-tk-border text-tk-text font-medium">
                        {item.catatan}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
