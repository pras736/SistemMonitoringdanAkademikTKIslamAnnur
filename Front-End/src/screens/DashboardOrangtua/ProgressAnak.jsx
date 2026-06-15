import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icons } from '../../components/Icons';

const API_BASE = 'http://127.0.0.1:8000/api';

export const ProgressAnak = () => {
  const [academic, setAcademic] = useState([]);
  const [ngaji, setNgaji] = useState([]);
  const [absensi, setAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState('akademik'); // 'akademik', 'ngaji', 'absensi'

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const [acRes, ngRes, abRes] = await Promise.all([
          axios.get(`${API_BASE}/wali/anak/akademik`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE}/wali/anak/mengaji`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE}/wali/anak/absensi`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setAcademic(acRes.data);
        setNgaji(ngRes.data);
        setAbsensi(abRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) return <div>Memuat data perkembangan anak...</div>;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-tk-primary m-0">Perkembangan Belajar Buah Hati</h1>
        <p className="text-tk-muted text-[0.9rem] mt-1 m-0">Lihat rekam jejak akademik mingguan, perkembangan mengaji, dan absensi anak Anda.</p>
      </header>

      {/* Sub Tabs */}
      <div className="flex gap-4 border-b border-tk-border">
        <button onClick={() => setSubTab('akademik')} className={`pb-3 font-bold text-base bg-transparent border-0 border-b-2 cursor-pointer transition-all duration-200 outline-none ${subTab === 'akademik' ? 'border-tk-primary text-tk-primary' : 'border-transparent text-tk-muted'}`}>
          Perkembangan Mingguan (Calistung)
        </button>
        <button onClick={() => setSubTab('ngaji')} className={`pb-3 font-bold text-base bg-transparent border-0 border-b-2 cursor-pointer transition-all duration-200 outline-none ${subTab === 'ngaji' ? 'border-tk-primary text-tk-primary' : 'border-transparent text-tk-muted'}`}>
          Catatan Mengaji
        </button>
        <button onClick={() => setSubTab('absensi')} className={`pb-3 font-bold text-base bg-transparent border-0 border-b-2 cursor-pointer transition-all duration-200 outline-none ${subTab === 'absensi' ? 'border-tk-primary text-tk-primary' : 'border-transparent text-tk-muted'}`}>
          Riwayat Kehadiran (Absensi)
        </button>
      </div>

      {subTab === 'akademik' && (
        <div className="flex flex-col gap-4">
          {academic.length === 0 ? (
            <div className="bg-tk-card border border-tk-border rounded-xl p-8 text-center text-tk-muted">Belum ada catatan akademik mingguan dari guru.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {academic.map((item) => (
                <div key={item.id_perkembangan} className="bg-tk-card border border-tk-border rounded-xl p-6 shadow-sm flex flex-col gap-4">
                  <header className="flex justify-between items-center border-b border-tk-border pb-3 flex-wrap gap-2">
                    <span className="font-bold text-tk-primary text-base">Minggu Ke-{item.minggu_ke} - {item.bulan} {item.tahun}</span>
                    <span className="text-xs font-semibold text-tk-muted">Tanggal Input: {item.created_at ? item.created_at.split('T')[0] : ''}</span>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-tk-bg/40 border border-tk-border rounded-lg flex flex-col gap-1">
                      <span className="text-xs font-bold text-tk-muted uppercase">Membaca</span>
                      <span className="text-sm font-bold text-tk-primary">{item.membaca}</span>
                    </div>
                    <div className="p-4 bg-tk-bg/40 border border-tk-border rounded-lg flex flex-col gap-1">
                      <span className="text-xs font-bold text-tk-muted uppercase">Berhitung</span>
                      <span className="text-sm font-bold text-tk-primary">{item.berhitung}</span>
                    </div>
                    <div className="p-4 bg-tk-bg/40 border border-tk-border rounded-lg flex flex-col gap-1">
                      <span className="text-xs font-bold text-tk-muted uppercase">Menulis</span>
                      <span className="text-sm font-bold text-tk-primary">{item.menulis}</span>
                    </div>
                  </div>

                  {item.catatan && (
                    <div className="flex flex-col gap-1.5 p-4 bg-[#FAFAFA] border border-tk-border rounded-lg">
                      <span className="text-xs font-bold text-tk-primary uppercase">Catatan Perkembangan Guru:</span>
                      <p className="text-sm text-tk-text m-0 leading-relaxed italic">"{item.catatan}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {subTab === 'ngaji' && (
        <div className="bg-tk-card border border-tk-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <h3 className="text-base font-bold text-tk-primary m-0 p-4 border-b border-tk-border bg-tk-bg">Catatan Mengaji Iqra & Al-Quran</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-tk-bg/25">
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Tanggal</th>
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Catatan / Tingkatan</th>
                </tr>
              </thead>
              <tbody>
                {ngaji.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="p-6 text-center text-tk-muted">Belum ada catatan mengaji.</td>
                  </tr>
                ) : (
                  ngaji.map((item) => (
                    <tr key={item.id_kartu} className="hover:bg-tk-bg/50">
                      <td className="p-4 border-b border-tk-border text-tk-muted text-sm font-semibold">{item.tanggal ? item.tanggal.split('T')[0] : '-'}</td>
                      <td className="p-4 border-b border-tk-border text-tk-text font-bold">{item.catatan}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'absensi' && (
        <div className="bg-tk-card border border-tk-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <h3 className="text-base font-bold text-tk-primary m-0 p-4 border-b border-tk-border bg-tk-bg">Riwayat Kehadiran Harian</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-tk-bg/25">
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Tanggal</th>
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Status Kehadiran</th>
                  <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {absensi.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-6 text-center text-tk-muted">Belum ada riwayat absensi.</td>
                  </tr>
                ) : (
                  absensi.map((item) => (
                    <tr key={item.id_absensi} className="hover:bg-tk-bg/50">
                      <td className="p-4 border-b border-tk-border text-tk-muted text-sm font-semibold">{item.tanggal ? item.tanggal.split('T')[0] : '-'}</td>
                      <td className="p-4 border-b border-tk-border">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.status === 'hadir' ? 'bg-green-100 text-green-700' :
                          item.status === 'sakit' ? 'bg-yellow-100 text-yellow-700' :
                          item.status === 'izin' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 border-b border-tk-border text-tk-muted text-sm font-medium">{item.keterangan || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
