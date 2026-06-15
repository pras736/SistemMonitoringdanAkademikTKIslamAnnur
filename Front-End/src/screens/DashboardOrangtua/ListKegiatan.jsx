import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icons } from '../../components/Icons';

const API_BASE = 'http://127.0.0.1:8000/api';

export const ListKegiatan = () => {
  const [kegiatans, setKegiatans] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchKegiatans = async () => {
      try {
        const res = await axios.get(`${API_BASE}/wali/kegiatan`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setKegiatans(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchKegiatans();
  }, []);

  const getFullImageUrl = (path) => {
    if (!path) return '';
    return `http://127.0.0.1:8000/storage/${path}`;
  };

  if (loading) return <div>Memuat info kegiatan sekolah...</div>;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-tk-primary m-0">Info Kegiatan Sekolah</h1>
        <p className="text-tk-muted text-[0.9rem] mt-1 m-0">Lihat agenda, pengumuman, dan foto kegiatan luar sekolah buah hati Anda.</p>
      </header>

      {kegiatans.length === 0 ? (
        <div className="bg-tk-card border border-tk-border rounded-xl p-8 text-center text-tk-muted">Belum ada pengumuman kegiatan baru saat ini.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kegiatans.map((k) => (
            <div key={k.id_kegiatan} className="bg-tk-card border border-tk-border rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
              {k.foto ? (
                <img src={getFullImageUrl(k.foto)} alt={k.judul} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-tk-secondary-light/45 flex items-center justify-center text-tk-primary font-bold">Foto Kegiatan</div>
              )}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-tk-primary bg-tk-secondary-light px-2.5 py-1 rounded-full">{k.tanggal ? k.tanggal.split('T')[0] : ''}</span>
                  </div>
                  <h3 className="text-lg font-bold text-tk-text m-0 my-1">{k.judul}</h3>
                  <p className="text-sm text-tk-muted leading-relaxed mt-2 m-0 whitespace-pre-line">{k.deskripsi}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
