import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icons } from '../../components/Icons';

const API_BASE = 'http://127.0.0.1:8000/api';

const SKALA_PERKEMBANGAN = [
  { value: 'BB (Belum Berkembang)', label: 'BB (Belum Berkembang)' },
  { value: 'MB (Mulai Berkembang)', label: 'MB (Mulai Berkembang)' },
  { value: 'BSH (Berkembang Sesuai Harapan)', label: 'BSH (Berkembang Sesuai Harapan)' },
  { value: 'BSB (Berkembang Sangat Baik)', label: 'BSB (Berkembang Sangat Baik)' },
];

const BULAN_LIST = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const InputAkademik = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Weekly selection state
  const [mingguKe, setMingguKe] = useState(1);
  const [bulan, setBulan] = useState(BULAN_LIST[new Date().getMonth()]);
  const [tahun, setTahun] = useState('2026');

  // Input states for selected student
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [membaca, setMembaca] = useState('BB (Belum Berkembang)');
  const [berhitung, setBerhitung] = useState('BB (Belum Berkembang)');
  const [menulis, setMenulis] = useState('BB (Belum Berkembang)');
  const [catatan, setCatatan] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/guru/siswa`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
      if (res.data.length > 0) {
        setSelectedStudent(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgressForStudent = async (studentId) => {
    if (!studentId) return;
    try {
      const res = await axios.get(
        `${API_BASE}/guru/perkembangan?minggu_ke=${mingguKe}&bulan=${bulan}&tahun=${tahun}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const matched = res.data.find(item => item.id_anak === studentId);
      if (matched) {
        setMembaca(matched.membaca);
        setBerhitung(matched.berhitung);
        setMenulis(matched.menulis);
        setCatatan(matched.catatan || '');
      } else {
        setMembaca('BB (Belum Berkembang)');
        setBerhitung('BB (Belum Berkembang)');
        setMenulis('BB (Belum Berkembang)');
        setCatatan('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchProgressForStudent(selectedStudent.id_anak);
    }
  }, [selectedStudent, mingguKe, bulan, tahun]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    
    setSaving(true);
    setMessage('');
    
    const payload = {
      id_anak: selectedStudent.id_anak,
      minggu_ke: mingguKe,
      bulan,
      tahun,
      membaca,
      berhitung,
      menulis,
      catatan
    };

    try {
      await axios.post(`${API_BASE}/guru/perkembangan`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Perkembangan akademik berhasil disimpan!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Gagal menyimpan data perkembangan.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading data akademik...</div>;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-tk-primary m-0">Input Perkembangan Akademik Mingguan</h1>
        <p className="text-tk-muted text-[0.9rem] mt-1 m-0">Input catatan perkembangan membaca, menulis, dan berhitung siswa per minggu.</p>
      </header>

      {/* Selector Area */}
      <div className="bg-tk-card p-6 border border-tk-border rounded-xl shadow-sm flex gap-4 flex-wrap items-center">
        <div className="flex flex-col gap-1.5 min-w-[150px]">
          <label className="text-sm font-semibold text-tk-text">Pilih Siswa</label>
          <select 
            value={selectedStudent?.id_anak || ''} 
            onChange={(e) => setSelectedStudent(students.find(s => s.id_anak === parseInt(e.target.value)))} 
            className="p-2 border border-tk-border rounded-md bg-white focus:border-tk-primary outline-none"
          >
            {students.map(s => (
              <option key={s.id_anak} value={s.id_anak}>{s.nama_lengkap}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[100px]">
          <label className="text-sm font-semibold text-tk-text">Minggu Ke</label>
          <select value={mingguKe} onChange={(e) => setMingguKe(parseInt(e.target.value))} className="p-2 border border-tk-border rounded-md bg-white focus:border-tk-primary outline-none">
            <option value={1}>Minggu 1</option>
            <option value={2}>Minggu 2</option>
            <option value={3}>Minggu 3</option>
            <option value={4}>Minggu 4</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[150px]">
          <label className="text-sm font-semibold text-tk-text">Bulan</label>
          <select value={bulan} onChange={(e) => setBulan(e.target.value)} className="p-2 border border-tk-border rounded-md bg-white focus:border-tk-primary outline-none">
            {BULAN_LIST.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[100px]">
          <label className="text-sm font-semibold text-tk-text">Tahun</label>
          <select value={tahun} onChange={(e) => setTahun(e.target.value)} className="p-2 border border-tk-border rounded-md bg-white focus:border-tk-primary outline-none">
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </div>
      </div>

      {message && (
        <div className="bg-green-100 text-green-700 border border-green-200 p-4 rounded-lg font-semibold text-sm">
          {message}
        </div>
      )}

      {selectedStudent && (
        <form onSubmit={handleSave} className="bg-tk-card p-8 border border-tk-border rounded-xl shadow-sm flex flex-col gap-6">
          <h2 className="text-lg font-bold text-tk-primary m-0 pb-3 border-b border-tk-border">
            Input Perkembangan: <span className="text-tk-text">{selectedStudent.nama_lengkap}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Membaca */}
            <div className="flex flex-col gap-2 p-4 bg-[#FAFAFA] border border-tk-border rounded-lg">
              <label className="text-base font-bold text-tk-primary">1. Membaca</label>
              <p className="text-xs text-tk-muted m-0 mb-2">Kemampuan mengeja huruf, kata, dan kelancaran membaca.</p>
              <select value={membaca} onChange={(e) => setMembaca(e.target.value)} className="p-2 border border-tk-border rounded-md bg-white focus:border-tk-primary outline-none text-sm font-medium">
                {SKALA_PERKEMBANGAN.map(item => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>

            {/* Berhitung */}
            <div className="flex flex-col gap-2 p-4 bg-[#FAFAFA] border border-tk-border rounded-lg">
              <label className="text-base font-bold text-tk-primary">2. Berhitung</label>
              <p className="text-xs text-tk-muted m-0 mb-2">Kemampuan mengenal angka, menghitung objek, dan penjumlahan dasar.</p>
              <select value={berhitung} onChange={(e) => setBerhitung(e.target.value)} className="p-2 border border-tk-border rounded-md bg-white focus:border-tk-primary outline-none text-sm font-medium">
                {SKALA_PERKEMBANGAN.map(item => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>

            {/* Menulis */}
            <div className="flex flex-col gap-2 p-4 bg-[#FAFAFA] border border-tk-border rounded-lg">
              <label className="text-base font-bold text-tk-primary">3. Menulis</label>
              <p className="text-xs text-tk-muted m-0 mb-2">Kemampuan meniru bentuk huruf, kerapian menulis kata/nama sendiri.</p>
              <select value={menulis} onChange={(e) => setMenulis(e.target.value)} className="p-2 border border-tk-border rounded-md bg-white focus:border-tk-primary outline-none text-sm font-medium">
                {SKALA_PERKEMBANGAN.map(item => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Catatan Tambahan */}
          <div className="flex flex-col gap-2">
            <label className="text-base font-bold text-tk-primary">Catatan Perkembangan / Saran Guru</label>
            <textarea 
              rows="4" 
              placeholder="Berikan detail catatan perkembangan atau hal penting yang dicapai anak pada minggu ini..." 
              value={catatan} 
              onChange={(e) => setCatatan(e.target.value)} 
              className="p-3 border border-tk-border rounded-md focus:border-tk-primary outline-none font-sans"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-tk-border">
            <button type="submit" disabled={saving} className="btn-primary px-8 py-3">
              {saving ? 'Menyimpan...' : 'Simpan Perkembangan'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
