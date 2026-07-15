import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Icons } from '../../components/Icons';
import teacherAvatar from '../../assets/teacher_avatar.png';
import student1Avatar from '../../assets/student_avatar_1.png';

const API_BASE = 'http://127.0.0.1:8000/api';

/**
 * Halaman: Dashboard Admin
 * Deskripsi: Halaman utama admin yang menampilkan ringkasan statistik sistem,
 * daftar pengguna terbaru, dan quick-action verifikasi SPP pending.
 */
const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  // [Data Fetching] Mengambil data statistik dashboard dari API backend
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // [Action] Verifikasi SPP dari Dashboard — approve atau reject pembayaran SPP
  const handleVerifySPP = async (id, status) => {
    const act = status === 'Lunas' ? 'menyetujui' : 'menolak';
    if (window.confirm(`Apakah Anda yakin ingin ${act} pembayaran SPP ini?`)) {
      try {
        await axios.post(`${API_BASE}/admin/spp/${id}/verify`, { status }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchStats();
      } catch (err) {
        alert('Gagal memproses verifikasi SPP.');
      }
    }
  };

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center font-semibold text-tk-muted">Memuat data dashboard...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* ============================================================
          BAGIAN 1: Header / Sambutan
          Menampilkan judul halaman dan kalimat selamat datang admin.
         ============================================================ */}
      <header>
        <h1 className="text-3xl font-bold mb-1">Hello, Admin !</h1>
        <p className="text-tk-muted text-[0.95rem]">Here's what's happening at TK Islam An Nur today.</p>
      </header>

      {/* ============================================================
          BAGIAN 2: Statistik Utama (Top Stats Cards)
          3 kartu ringkasan: Total Pengguna, Kelas Aktif, dan SPP Pending.
          Data diambil dari API /admin/dashboard-stats.
         ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-tk-card p-6 rounded-xl border border-tk-border shadow-sm">
          <p className="text-[0.8rem] font-semibold text-tk-muted mb-2 uppercase">TOTAL PENGGUNA</p>
          <h2 className="text-4xl font-bold mb-2">{stats?.total_users || 0}</h2>
          <p className="text-[0.85rem] text-[#65A30D]">{stats?.total_siswa || 0} Siswa | {stats?.total_guru || 0} Guru</p>
        </div>
        <div className="bg-tk-card p-6 rounded-xl border border-tk-border shadow-sm">
          <p className="text-[0.8rem] font-semibold text-tk-muted mb-2 uppercase">KELAS AKTIF</p>
          <h2 className="text-4xl font-bold mb-2">{stats?.total_kelas || 0}</h2>
          <p className="text-[0.85rem] text-tk-muted">Terdaftar di sistem akademik</p>
        </div>
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-sm">
          <p className="text-[0.8rem] font-semibold text-red-600 mb-2 uppercase">PENDING SPP</p>
          <h2 className="text-4xl font-bold mb-2">{stats?.pending_spp_count || 0}</h2>
          <p className="text-[0.85rem] text-red-600 font-semibold">! Perlu verifikasi admin</p>
        </div>
      </div>

      {/* ============================================================
          BAGIAN 3: Grid Utama (Main Grid)
          Terdiri dari 2 bagian utama:
          - Kiri (2/3): Tabel User Terbaru + shortcut navigasi kelola guru & murid
          - Kanan (1/3): Widget verifikasi SPP pending dengan tombol Approve/Reject
         ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Management */}
        <div className="bg-tk-card rounded-xl border border-tk-border p-6 flex flex-col lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-[1.1rem] font-semibold m-0">User Terbaru</h2>
              <span className="px-3 py-1 rounded-full text-[0.8rem] font-semibold bg-tk-secondary-light text-tk-primary">Terdaftar Baru</span>
            </div>
            <button onClick={() => navigate('/admin/users')} className="bg-tk-primary text-white px-4 py-2 rounded-md flex items-center gap-2 font-semibold hover:bg-tk-primary-light transition-colors cursor-pointer border-0">
              <Icons.Plus /> Kelola Guru
            </button>
          </div>
          
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 text-tk-muted border-b border-tk-border font-medium text-[0.9rem]">User</th>
                  <th className="text-left p-4 text-tk-muted border-b border-tk-border font-medium text-[0.9rem]">Role</th>
                  <th className="text-left p-4 text-tk-muted border-b border-tk-border font-medium text-[0.9rem]">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recent_users.map(user => (
                  <tr key={user.id} className="hover:bg-tk-bg/50">
                    <td className="p-4 border-b border-tk-border">
                      <div className="flex items-center gap-4">
                        <img 
                          src={user.foto_profil ? `http://127.0.0.1:8000/storage/${user.foto_profil}` : (user.role === 'Teacher' ? teacherAvatar : student1Avatar)} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full object-cover border border-tk-border" 
                        />
                        <div>
                          <p className="font-semibold text-tk-text m-0 leading-tight">{user.name}</p>
                          <p className="text-xs text-tk-muted m-0">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-tk-border">
                      <span className={`px-3 py-1 rounded-full text-[0.85rem] font-semibold ${
                        user.role === 'Teacher' ? 'bg-[#FEF3C7] text-[#B45309]' : 
                        user.role === 'Parent' ? 'bg-[#FCE7F3] text-[#BE185D]' : 
                        'bg-[#E0F2FE] text-[#0369A1]'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 border-b border-tk-border">
                      <span className="flex items-center gap-2 font-medium">
                        <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-[#65A30D]' : 'bg-tk-muted'}`}></span> {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-auto">
            <button 
              onClick={() => navigate('/admin/users')} 
              className="p-3.5 rounded-md font-semibold text-center bg-[#FAFAFA] border border-dashed border-tk-border text-tk-muted hover:bg-tk-bg hover:text-tk-primary transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <Icons.Users /> Kelola Guru
            </button>
            <button 
              onClick={() => navigate('/admin/academic')} 
              className="p-3.5 rounded-md font-semibold text-center bg-[#FAFAFA] border border-dashed border-tk-border text-tk-muted hover:bg-tk-bg hover:text-tk-primary transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <Icons.Book /> Kelola Murid & Kelas
            </button>
          </div>
        </div>

        {/* ============================================================
            BAGIAN 3B: Widget Verifikasi SPP (Sidebar kanan)
            Menampilkan 3 pembayaran SPP pending terbaru dengan
            tombol Approve (Lunas) dan Reject (Ditolak).
           ============================================================ */}
        <div className="bg-tk-card rounded-xl border border-tk-border p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[1.1rem] font-semibold m-0">Verifikasi SPP</h2>
            <span className="px-3 py-1 rounded-full text-[0.8rem] font-semibold bg-red-600 text-white">Urgent</span>
          </div>

          <div className="flex flex-col gap-4">
            {stats?.pending_spps.length === 0 ? (
              <div className="text-center text-tk-muted py-8 text-sm">
                Tidak ada pembayaran SPP tertunda.
              </div>
            ) : (
              stats?.pending_spps.map((spp) => (
                <div key={spp.id_spp} className="border border-tk-border rounded-md p-4 bg-tk-bg/30">
                  <div className="flex gap-4 mb-4">
                    <div className="w-12 h-12 rounded-md bg-tk-secondary-light text-tk-primary flex items-center justify-center shrink-0">
                      <Icons.Payment />
                    </div>
                    <div>
                      <p className="font-semibold m-0">{spp.anak_nama}'s SPP</p>
                      <p className="text-[0.85rem] text-tk-muted m-0">{spp.bulan} {spp.tahun}</p>
                      <p className="text-[0.85rem] text-tk-muted m-0">Pengirim: {spp.sender}</p>
                      <p className="font-bold text-tk-primary mt-1 m-0">Rp {spp.nominal.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleVerifySPP(spp.id_spp, 'Lunas')} 
                      className="border border-[#65A30D] text-[#65A30D] bg-transparent px-4 py-2 rounded-md flex-1 flex items-center justify-center gap-2 font-semibold hover:bg-[#65A30D] hover:text-white transition-colors cursor-pointer"
                    >
                      <Icons.Check /> Approve
                    </button>
                    <button 
                      onClick={() => handleVerifySPP(spp.id_spp, 'Ditolak')} 
                      className="border border-red-600 text-red-600 bg-transparent px-4 py-2 rounded-md flex-1 flex items-center justify-center gap-2 font-semibold hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                    >
                      <Icons.Plus className="rotate-45" /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <button onClick={() => navigate('/admin/spp')} className="w-full p-4 rounded-md font-semibold text-center bg-[#FAFAFA] border border-dashed border-tk-border text-tk-muted hover:bg-tk-border transition-colors mt-auto cursor-pointer">
            Lihat Semua SPP Pending
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
