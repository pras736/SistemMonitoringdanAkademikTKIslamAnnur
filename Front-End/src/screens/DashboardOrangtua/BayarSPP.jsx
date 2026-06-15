import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icons } from '../../components/Icons';

const API_BASE = 'http://127.0.0.1:8000/api';

export const BayarSPP = () => {
  const [sppList, setSppList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Upload states
  const [selectedSppId, setSelectedSppId] = useState('');
  const [buktiFile, setBuktiFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchSPP = async () => {
    try {
      const res = await axios.get(`${API_BASE}/wali/spp`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSppList(res.data);
      // Select the first unpaid/waiting item as default for upload
      const unpaid = res.data.find(item => item.status_pembayaran !== 'Lunas');
      if (unpaid) {
        setSelectedSppId(unpaid.id_spp);
      } else if (res.data.length > 0) {
        setSelectedSppId(res.data[0].id_spp);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSPP();
  }, []);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSppId) {
      setError('Silakan pilih bulan tagihan SPP terlebih dahulu.');
      return;
    }
    if (!buktiFile) {
      setError('Silakan pilih file bukti transfer terlebih dahulu.');
      return;
    }

    setUploading(true);
    setMessage('');
    setError('');

    const formData = new FormData();
    formData.append('id_spp', selectedSppId);
    formData.append('bukti_transfer', buktiFile);

    try {
      await axios.post(`${API_BASE}/wali/spp/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Bukti transfer berhasil diupload. Mohon tunggu verifikasi admin.');
      setBuktiFile(null);
      fetchSPP();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengupload bukti transfer.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div>Memuat data pembayaran SPP...</div>;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-tk-primary m-0">Informasi & Pembayaran SPP</h1>
        <p className="text-tk-muted text-[0.9rem] mt-1 m-0">Lihat status tagihan SPP bulanan anak dan upload bukti pembayaran.</p>
      </header>

      {message && (
        <div className="bg-green-100 text-green-700 border border-green-200 p-4 rounded-lg font-semibold text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-lg font-semibold text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Upload Form */}
        <form onSubmit={handleUploadSubmit} className="bg-tk-card border border-tk-border rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <h2 className="text-base font-bold text-tk-primary m-0 border-b border-tk-border pb-3">Upload Bukti Pembayaran</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-tk-text">Pilih Tagihan SPP</label>
            <select 
              value={selectedSppId} 
              onChange={(e) => setSelectedSppId(e.target.value)} 
              className="p-2 border border-tk-border rounded-md bg-white focus:border-tk-primary outline-none text-sm font-medium"
            >
              {sppList.map(item => (
                <option key={item.id_spp} value={item.id_spp}>
                  {item.bulan} {item.tahun} - Rp {item.nominal.toLocaleString('id-ID')} ({item.status_pembayaran})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-tk-text">File Bukti Transfer</label>
            <input 
              required 
              type="file" 
              accept="image/*" 
              onChange={(e) => setBuktiFile(e.target.files[0])} 
              className="p-2 border border-tk-border rounded-md bg-white focus:border-tk-primary outline-none" 
            />
            <p className="text-[0.75rem] text-tk-muted m-0">Format file: jpeg, png, jpg. Maksimal file: 2MB.</p>
          </div>

          <button type="submit" disabled={uploading} className="btn-primary w-full py-2.5 mt-2">
            {uploading ? 'Mengupload...' : 'Kirim Bukti Pembayaran'}
          </button>
        </form>

        {/* SPP list */}
        <div className="lg:col-span-2 bg-tk-card border border-tk-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <h2 className="text-base font-bold text-tk-primary m-0 p-4 border-b border-tk-border bg-tk-bg">Daftar Tagihan SPP</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-tk-bg/30">
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Bulan / Tahun</th>
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Nominal</th>
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Status</th>
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border text-center">Tanggal Bayar</th>
                </tr>
              </thead>
              <tbody>
                {sppList.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-tk-muted">Belum ada data tagihan SPP.</td>
                  </tr>
                ) : (
                  sppList.map((item) => (
                    <tr key={item.id_spp} className="hover:bg-tk-bg/50">
                      <td className="p-4 border-b border-tk-border font-semibold text-tk-text">{item.bulan} {item.tahun}</td>
                      <td className="p-4 border-b border-tk-border font-bold text-tk-primary">Rp {item.nominal.toLocaleString('id-ID')}</td>
                      <td className="p-4 border-b border-tk-border">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.status_pembayaran === 'Lunas' ? 'bg-green-100 text-green-700' :
                          item.status_pembayaran === 'Menunggu Verifikasi' ? 'bg-yellow-100 text-yellow-700' :
                          item.status_pembayaran === 'Ditolak' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {item.status_pembayaran}
                        </span>
                      </td>
                      <td className="p-4 border-b border-tk-border text-center text-tk-muted text-sm font-medium">
                        {item.tanggal_bayar ? item.tanggal_bayar.split('T')[0] : '-'}
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
