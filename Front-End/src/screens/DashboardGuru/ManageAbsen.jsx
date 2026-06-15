import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icons } from '../../components/Icons';

const API_BASE = 'http://127.0.0.1:8000/api';

export const ManageAbsen = () => {
  const [students, setStudents] = useState([]);
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [absensiMap, setAbsensiMap] = useState({}); // id_anak -> { status: 'hadir', keterangan: '' }
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const token = localStorage.getItem('token');

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/guru/siswa`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const fetchAbsensi = async (currentStudents) => {
    try {
      const res = await axios.get(`${API_BASE}/guru/absensi?tanggal=${tanggal}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newMap = {};
      // Preset all to 'hadir' first
      currentStudents.forEach(st => {
        newMap[st.id_anak] = { status: 'hadir', keterangan: '' };
      });

      // Override with backend data
      res.data.forEach(item => {
        newMap[item.id_anak] = {
          status: item.status,
          keterangan: item.keterangan || ''
        };
      });

      setAbsensiMap(newMap);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchStudents().then(stList => {
      if (stList.length > 0) {
        fetchAbsensi(stList);
      }
      setLoading(false);
    });
  }, [tanggal]);

  const handleStatusChange = (studentId, status) => {
    setAbsensiMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleKeteranganChange = (studentId, keterangan) => {
    setAbsensiMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        keterangan
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');
    
    const absData = Object.keys(absensiMap).map(idAnak => ({
      id_anak: parseInt(idAnak),
      status: absensiMap[idAnak].status,
      keterangan: absensiMap[idAnak].keterangan
    }));

    try {
      await axios.post(`${API_BASE}/guru/absensi`, {
        tanggal,
        absensi: absData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMsg('Absensi berhasil disimpan!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Gagal menyimpan absensi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading data absensi...</div>;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-tk-primary m-0">Mengelola Absensi Siswa</h1>
          <p className="text-tk-muted text-[0.9rem] mt-1 m-0">Kelola kehadiran harian untuk seluruh murid di kelas Anda.</p>
        </div>
        <div className="flex items-center gap-4">
          <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="p-2 border border-tk-border rounded-md focus:border-tk-primary outline-none text-sm font-semibold" />
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'Menyimpan...' : 'Simpan Absensi'}
          </button>
        </div>
      </header>

      {successMsg && (
        <div className="bg-green-100 text-green-700 border border-green-200 p-4 rounded-lg font-semibold text-sm animate-in fade-in slide-in-from-top-2">
          {successMsg}
        </div>
      )}

      <div className="bg-tk-card border border-tk-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-tk-bg">
              <th className="p-4 font-semibold text-tk-primary border-b border-tk-border w-[30%]">Nama Siswa</th>
              <th className="p-4 font-semibold text-tk-primary border-b border-tk-border text-center">Hadir</th>
              <th className="p-4 font-semibold text-tk-primary border-b border-tk-border text-center">Sakit</th>
              <th className="p-4 font-semibold text-tk-primary border-b border-tk-border text-center">Izin</th>
              <th className="p-4 font-semibold text-tk-primary border-b border-tk-border text-center">Alfa</th>
              <th className="p-4 font-semibold text-tk-primary border-b border-tk-border">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-tk-muted">Belum ada data siswa di kelas Anda.</td>
              </tr>
            ) : (
              students.map((student) => {
                const currentVal = absensiMap[student.id_anak] || { status: 'hadir', keterangan: '' };
                return (
                  <tr key={student.id_anak} className="hover:bg-tk-bg/50">
                    <td className="p-4 border-b border-tk-border font-semibold text-tk-text">
                      {student.nama_lengkap}
                      {student.nama_panggilan && <span className="text-xs text-tk-muted font-normal block">Panggilan: {student.nama_panggilan}</span>}
                    </td>
                    <td className="p-4 border-b border-tk-border text-center">
                      <input type="radio" checked={currentVal.status === 'hadir'} onChange={() => handleStatusChange(student.id_anak, 'hadir')} name={`status-${student.id_anak}`} className="w-4 h-4 text-tk-primary focus:ring-tk-primary" />
                    </td>
                    <td className="p-4 border-b border-tk-border text-center">
                      <input type="radio" checked={currentVal.status === 'sakit'} onChange={() => handleStatusChange(student.id_anak, 'sakit')} name={`status-${student.id_anak}`} className="w-4 h-4 text-tk-primary focus:ring-tk-primary" />
                    </td>
                    <td className="p-4 border-b border-tk-border text-center">
                      <input type="radio" checked={currentVal.status === 'izin'} onChange={() => handleStatusChange(student.id_anak, 'izin')} name={`status-${student.id_anak}`} className="w-4 h-4 text-tk-primary focus:ring-tk-primary" />
                    </td>
                    <td className="p-4 border-b border-tk-border text-center">
                      <input type="radio" checked={currentVal.status === 'alfa'} onChange={() => handleStatusChange(student.id_anak, 'alfa')} name={`status-${student.id_anak}`} className="w-4 h-4 text-tk-primary focus:ring-tk-primary" />
                    </td>
                    <td className="p-4 border-b border-tk-border">
                      <input type="text" placeholder="Catatan/Alasan (misal: Demam)" value={currentVal.keterangan} onChange={(e) => handleKeteranganChange(student.id_anak, e.target.value)} className="w-full p-2 border border-tk-border rounded-md text-sm focus:border-tk-primary outline-none" />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
