import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icons } from '../../components/Icons';
/**
 * Halaman: Dashboard Guru
 * Deskripsi: Halaman utama guru yang menampilkan widget kehadiran harian siswa,
 * catatan mengaji terkini, dan preview input perkembangan calistung.
 */
export const DashboardGuru = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [mengajiData, setMengajiData] = useState([]);

  useEffect(() => {
    const fetchMengaji = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get('http://127.0.0.1:8000/api/guru/mengaji', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const formatted = res.data.map(item => {
          let tingkat = 'N/A';
          let hafalan = item.catatan;
          if (item.catatan && item.catatan.includes(' - ')) {
            const parts = item.catatan.split(' - ');
            tingkat = parts[0];
            hafalan = parts.slice(1).join(' - ');
          }
          return {
            id: item.id_kartu,
            name: item.anak?.nama_lengkap || 'Unknown',
            tingkat: tingkat,
            hafalan: hafalan,
          };
        });
        setMengajiData(formatted);

        const today = new Date().toISOString().split('T')[0];
        const resAbsen = await axios.get(`http://127.0.0.1:8000/api/guru/absensi?tanggal=${today}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Get all students for this teacher
        const stRes = await axios.get('http://127.0.0.1:8000/api/guru/siswa', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Group by id_anak to get only the latest attendance per student today
        const latestAbsen = {};
        resAbsen.data.forEach(item => {
          if (!latestAbsen[item.id_anak] || new Date(item.tanggal) > new Date(latestAbsen[item.id_anak].tanggal)) {
             latestAbsen[item.id_anak] = item;
          }
        });
        
        const formattedAbsen = stRes.data.map(student => {
          const ab = latestAbsen[student.id_anak];
          return {
            id: student.id_anak,
            name: student.nama_lengkap,
            time: ab ? (ab.keterangan || (ab.status === 'hadir' ? '07:15 AM' : '')) : '',
            status: ab ? (ab.status === 'hadir' ? 'present' : 'absent') : 'absent'
          };
        });
        
        setAttendanceData(formattedAbsen);
      } catch (error) {
        console.error('Failed to fetch mengaji data', error);
      }
    };
    fetchMengaji();
  }, []);

  const calistungData = [
    { id: 1, name: 'Ahmad Rizky', membaca: 'BSH', menulis: 'MB', berhitung: 'BB' },
    { id: 2, name: 'Budi Pratama', membaca: 'MB', menulis: 'BB', berhitung: 'MB' },
    { id: 3, name: 'Aisha Zahra', membaca: 'BSB', menulis: 'BSB', berhitung: 'BSH' },
    { id: 4, name: 'Siti Nurhaliza', membaca: 'BSH', menulis: 'BSH', berhitung: 'BSH' },
    { id: 5, name: 'Daffa Al-Fatih', membaca: 'MB', menulis: 'MB', berhitung: 'MB' },
  ];

  return (
    <div className="flex flex-col text-tk-text">
      {/* ============================================================
          BAGIAN 1: Header / Sambutan Guru
          Menampilkan sapaan kepada guru yang login saat ini.
         ============================================================ */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-tk-text mb-1">Assalamu'alaikum, Bu. Sarah!</h1>
          <p className="text-tk-muted text-[0.95rem]">Your TK An-Nur class is ready for another joyful day of learning.</p>
        </div>
        
      </header>

      {/* ============================================================
          BAGIAN 2: Grid Konten Dashboard Guru
          Layout 3 kolom berisi 3 widget utama.
         ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ============================================================
            BAGIAN 2A: Widget Absensi Harian (1 kolom)
            Menampilkan status hadir/tidak hadir seluruh siswa kelas hari ini.
            Data real-time dari API /guru/absensi?tanggal={hari_ini}.
           ============================================================ */}
        <div className="bg-tk-card rounded-xl p-6 shadow-sm flex flex-col border border-tk-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="flex items-center gap-2 text-[1.1rem] font-semibold text-tk-primary"><Icons.Absen /> Daily Attendance</h2>
            <span className="px-3 py-1 rounded-full text-[0.8rem] font-semibold bg-[#ECFCCB] text-[#65A30D]">
              {attendanceData.filter(s => s.status === 'present').length} / {attendanceData.length} Present
            </span>
          </div>
          
          <div className="flex flex-col gap-4 mb-6 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar">
            {attendanceData.map(student => (
              <div key={student.id} className="flex justify-between items-center p-3 border border-tk-border rounded-md bg-[#FAFAFA]">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold text-[0.95rem] text-tk-text m-0">{student.name}</p>
                    {student.time && <p className="text-[0.8rem] text-tk-muted m-0">{student.time}</p>}
                    {student.status === 'absent' && <p className="text-[0.8rem] text-red-600 font-medium m-0">Absent</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="text-tk-primary font-semibold text-[0.9rem] text-center p-2 mt-auto hover:underline">View All Students</button>
        </div>

        {/* ============================================================
            BAGIAN 2B: Widget Kartu Catatan Mengaji (2 kolom)
            Tabel catatan mengaji terkini semua siswa — tingkat Iqra/Al-Qur'an
            dan catatan halaman/surah. Filter berdasarkan tingkat tersedia.
           ============================================================ */}
        <div className="bg-tk-card rounded-xl p-6 shadow-sm flex flex-col border border-tk-border lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="flex items-center gap-2 text-[1.1rem] font-semibold text-tk-primary"><Icons.Mengaji /> Kartu Catatan Mengaji</h2>
            <div className="flex gap-3 items-center">
              <select className="px-4 py-2 pr-8 border border-tk-border rounded-full bg-white font-sans text-[0.9rem] text-tk-text outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg_xmlns=%22http://www.w3.org/2000/svg%22_viewBox=%220_0_24_24%22_fill=%22none%22_stroke=%22currentColor%22_stroke-width=%222%22_stroke-linecap=%22round%22_stroke-linejoin=%22round%22%3e%3cpolyline_points=%226_9_12_15_18_9%22%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px]">
                <option value="">Semua Tingkat</option>
                <option value="Iqra 1">Iqra 1</option>
                <option value="Iqra 2">Iqra 2</option>
                <option value="Iqra 3">Iqra 3</option>
                <option value="Iqra 4">Iqra 4</option>
                <option value="Iqra 5">Iqra 5</option>
                <option value="Iqra 6">Iqra 6</option>
                <option value="Al-Qur'an">Al-Qur'an</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto overflow-y-auto max-h-[340px] mb-6 custom-scrollbar">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="px-4 py-3 font-medium text-tk-muted border-b-2 border-tk-border text-[0.85rem] uppercase tracking-wide">Student</th>
                  <th className="px-4 py-3 font-medium text-tk-muted border-b-2 border-tk-border text-[0.85rem] uppercase tracking-wide">Surah / Hafalan</th>
                </tr>
              </thead>
              <tbody>
                {mengajiData.map(item => (
                  <tr key={item.id}>
                    <td className="p-4 border-b border-tk-border align-middle font-medium m-0">{item.name}</td>
                    <td className="p-4 border-b border-tk-border align-middle font-medium m-0">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#E0F2FE] text-[#0369A1] w-fit border border-[#BAE6FD]">{item.tingkat}</span>
                        <span>{item.hafalan}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="text-tk-primary font-semibold text-[0.9rem] text-center p-2 mt-auto hover:underline">View Progress History</button>
        </div>

        {/* ============================================================
            BAGIAN 2C: Widget Input Perkembangan Calistung (3 kolom)
            Preview tabel perkembangan akademik siswa (Membaca, Menulis, Berhitung)
            Filter berdasarkan bulan dan minggu tersedia di header widget.
           ============================================================ */}
        <div className="bg-tk-card rounded-xl p-6 shadow-sm flex flex-col border border-tk-border lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="flex items-center gap-2 text-[1.1rem] font-semibold text-tk-primary"><Icons.Nilai /> Input Perkembangan Calistung</h2>
            <div className="flex gap-3 items-center">
              <select className="px-4 py-2 pr-8 border border-tk-border rounded-full bg-white font-sans text-[0.9rem] text-tk-text outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg_xmlns=%22http://www.w3.org/2000/svg%22_viewBox=%220_0_24_24%22_fill=%22none%22_stroke=%22currentColor%22_stroke-width=%222%22_stroke-linecap=%22round%22_stroke-linejoin=%22round%22%3e%3cpolyline_points=%226_9_12_15_18_9%22%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px]">
                <option value="">Semua Bulan</option>
                <option value="Januari">Januari</option>
                <option value="Februari">Februari</option>
                <option value="Maret">Maret</option>
                <option value="April">April</option>
                <option value="Mei">Mei</option>
                <option value="Juni">Juni</option>
                <option value="Juli">Juli</option>
                <option value="Agustus">Agustus</option>
                <option value="September">September</option>
                <option value="Oktober">Oktober</option>
                <option value="November">November</option>
                <option value="Desember">Desember</option>
              </select>
              <select className="px-4 py-2 pr-8 border border-tk-border rounded-full bg-white font-sans text-[0.9rem] text-tk-text outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg_xmlns=%22http://www.w3.org/2000/svg%22_viewBox=%220_0_24_24%22_fill=%22none%22_stroke=%22currentColor%22_stroke-width=%222%22_stroke-linecap=%22round%22_stroke-linejoin=%22round%22%3e%3cpolyline_points=%226_9_12_15_18_9%22%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px]">
                <option value="">Semua Minggu</option>
                <option value="Minggu 1">Minggu 1</option>
                <option value="Minggu 2">Minggu 2</option>
                <option value="Minggu 3">Minggu 3</option>
                <option value="Minggu 4">Minggu 4</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto overflow-y-auto max-h-[340px] mb-6 custom-scrollbar">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="px-4 py-3 font-medium text-tk-muted border-b-2 border-tk-border text-[0.85rem] uppercase tracking-wide">Student</th>
                  <th className="px-4 py-3 font-medium text-tk-muted border-b-2 border-tk-border text-[0.85rem] uppercase tracking-wide">Membaca</th>
                  <th className="px-4 py-3 font-medium text-tk-muted border-b-2 border-tk-border text-[0.85rem] uppercase tracking-wide">Menulis</th>
                  <th className="px-4 py-3 font-medium text-tk-muted border-b-2 border-tk-border text-[0.85rem] uppercase tracking-wide">Berhitung</th>
                  <th className="px-4 py-3 font-medium text-tk-muted border-b-2 border-tk-border text-[0.85rem] uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {calistungData.map(item => (
                  <tr key={item.id}>
                    <td className="p-4 border-b border-tk-border align-middle font-medium m-0">{item.name}</td>
                    <td className="p-4 border-b border-tk-border align-middle font-medium m-0"><span className="inline-block px-3 py-1 bg-tk-secondary-light text-tk-primary rounded font-bold">{item.membaca}</span></td>
                    <td className="p-4 border-b border-tk-border align-middle font-medium m-0"><span className="inline-block px-3 py-1 bg-tk-secondary-light text-tk-primary rounded font-bold">{item.menulis}</span></td>
                    <td className="p-4 border-b border-tk-border align-middle font-medium m-0"><span className="inline-block px-3 py-1 bg-tk-secondary-light text-tk-primary rounded font-bold">{item.berhitung}</span></td>
                    <td className="p-4 border-b border-tk-border align-middle font-medium m-0"><button className="w-8 h-8 rounded-full bg-[#ECFCCB] text-[#65A30D] flex items-center justify-center transition-all duration-200 hover:bg-[#65A30D] hover:text-white"><Icons.Check /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
