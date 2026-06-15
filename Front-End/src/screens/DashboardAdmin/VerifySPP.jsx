import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icons } from '../../components/Icons';

const API_BASE = 'http://127.0.0.1:8000/api';

export const VerifySPP = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProofUrl, setSelectedProofUrl] = useState(null);
  const [tab, setTab] = useState('pending'); // 'pending' or 'all'

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    setLoading(true);
    try {
      const pendingRes = await axios.get(`${API_BASE}/admin/spp/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allRes = await axios.get(`${API_BASE}/admin/spp/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingPayments(pendingRes.data);
      setAllPayments(allRes.data);
    } catch (err) {
      console.error('Error fetching SPP records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (id, status) => {
    const act = status === 'Lunas' ? 'menyetujui' : 'menolak';
    if (window.confirm(`Apakah Anda yakin ingin ${act} pembayaran SPP ini?`)) {
      try {
        await axios.post(`${API_BASE}/admin/spp/${id}/verify`, { status }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (err) {
        alert('Gagal memproses verifikasi SPP.');
      }
    }
  };

  const getFullImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://127.0.0.1:8000/storage/${path}`;
  };

  if (loading) return <div>Loading data pembayaran SPP...</div>;

  const currentList = tab === 'pending' ? pendingPayments : allPayments;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-tk-primary m-0">Verifikasi Pembayaran SPP</h1>
        <p className="text-tk-muted text-[0.9rem] mt-1 m-0">Verifikasi bukti transfer pembayaran bulanan dari wali murid.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-tk-border">
        <button onClick={() => setTab('pending')} className={`pb-3 font-bold text-base bg-transparent border-0 border-b-2 cursor-pointer transition-all duration-200 outline-none ${tab === 'pending' ? 'border-tk-primary text-tk-primary' : 'border-transparent text-tk-muted'}`}>
          Menunggu Verifikasi ({pendingPayments.length})
        </button>
        <button onClick={() => setTab('all')} className={`pb-3 font-bold text-base bg-transparent border-0 border-b-2 cursor-pointer transition-all duration-200 outline-none ${tab === 'all' ? 'border-tk-primary text-tk-primary' : 'border-transparent text-tk-muted'}`}>
          Semua Riwayat SPP ({allPayments.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* List of Payments */}
        <div className="lg:col-span-2 bg-tk-card border border-tk-border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-tk-bg">
                <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Siswa</th>
                <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Bulan / Tahun</th>
                <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Nominal</th>
                <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Status</th>
                <th className="p-4 font-semibold text-tk-primary border-b border-tk-border text-center">Aksi / Bukti</th>
              </tr>
            </thead>
            <tbody>
              {currentList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-tk-muted">Tidak ada data pembayaran.</td>
                </tr>
              ) : (
                currentList.map((payment) => (
                  <tr key={payment.id_spp} className="hover:bg-tk-bg/50">
                    <td className="p-4 border-b border-tk-border font-semibold text-tk-text">
                      {payment.anak?.nama_lengkap}
                    </td>
                    <td className="p-4 border-b border-tk-border">
                      {payment.bulan} {payment.tahun}
                    </td>
                    <td className="p-4 border-b border-tk-border font-bold text-tk-primary">
                      Rp {payment.nominal.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4 border-b border-tk-border">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        payment.status_pembayaran === 'Lunas' ? 'bg-green-100 text-green-700' :
                        payment.status_pembayaran === 'Menunggu Verifikasi' ? 'bg-yellow-100 text-yellow-700' :
                        payment.status_pembayaran === 'Ditolak' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {payment.status_pembayaran}
                      </span>
                    </td>
                    <td className="p-4 border-b border-tk-border text-center">
                      <div className="flex justify-center gap-2">
                        {payment.bukti_transfer && (
                          <button onClick={() => setSelectedProofUrl(getFullImageUrl(payment.bukti_transfer))} className="px-3 py-1.5 bg-tk-secondary-light text-tk-primary rounded-md font-semibold text-sm hover:opacity-95 transition-colors cursor-pointer border-0">
                            Lihat Bukti
                          </button>
                        )}
                        {payment.status_pembayaran === 'Menunggu Verifikasi' && (
                          <>
                            <button onClick={() => handleVerify(payment.id_spp, 'Lunas')} className="px-3 py-1.5 bg-tk-primary text-white rounded-md font-semibold text-sm hover:bg-tk-primary-light transition-colors cursor-pointer border-0">
                              Setujui
                            </button>
                            <button onClick={() => handleVerify(payment.id_spp, 'Ditolak')} className="px-3 py-1.5 bg-red-600 text-white rounded-md font-semibold text-sm hover:bg-red-500 transition-colors cursor-pointer border-0">
                              Tolak
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Image Viewer */}
        <div className="bg-tk-card border border-tk-border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center gap-4 min-h-[350px]">
          <h3 className="text-base font-bold text-tk-primary border-b border-tk-border pb-2 w-full text-center">Preview Bukti Transfer</h3>
          {selectedProofUrl ? (
            <div className="w-full flex flex-col items-center gap-4">
              <div className="border border-tk-border rounded-lg overflow-hidden max-h-[350px] w-full flex items-center justify-center bg-tk-bg">
                <img src={selectedProofUrl} alt="Bukti Transfer" className="object-contain max-h-[350px] max-w-full" />
              </div>
              <a href={selectedProofUrl} target="_blank" rel="noopener noreferrer" className="text-tk-primary font-semibold text-sm hover:underline">
                Buka di Tab Baru
              </a>
            </div>
          ) : (
            <div className="text-center text-tk-muted flex flex-col items-center gap-2 p-6">
              <Icons.Payment />
              <p className="text-sm m-0">Klik tombol "Lihat Bukti" di salah satu transaksi untuk melihat gambar transfer.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
