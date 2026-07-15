import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Icons } from '../../components/Icons';
import student2Avatar from '../../assets/student_avatar_2.png';

/**
 * Halaman: Dashboard Wali Murid
 * Deskripsi: Halaman utama wali murid yang menampilkan ringkasan informasi anak
 * seperti perkembangan akademik calistung terbaru, catatan mengaji, status SPP,
 * dan log aktivitas perkembangan anak dari semua aspek.
 */
const DashboardOrangtua = () => {
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(student2Avatar);
  const [parentProfile, setParentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [academicList, setAcademicList] = useState([]);
  const [ngajiList, setNgajiList] = useState([]);
  const [absensiList, setAbsensiList] = useState([]);
  const [sppList, setSppList] = useState([]);

  useEffect(() => {
    // [Data Fetching] Mengambil data profil, akademik, ngaji, absensi, dan SPP
    // secara paralel menggunakan Promise.all untuk efisiensi
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const headers = { Authorization: `Bearer ${token}` };
        
        // 1. Fetch user profile
        const profileRes = await axios.get('http://127.0.0.1:8000/api/user', { headers });
        setParentProfile(profileRes.data);
        
        const foto = profileRes.data.user?.foto_profil;
        if (foto) {
          setProfilePhoto(`http://127.0.0.1:8000/storage/${foto}`);
        }

        // 2. Fetch student logs and progress
        const [academicRes, ngajiRes, absensiRes, sppRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/wali/anak/akademik', { headers }),
          axios.get('http://127.0.0.1:8000/api/wali/anak/mengaji', { headers }),
          axios.get('http://127.0.0.1:8000/api/wali/anak/absensi', { headers }),
          axios.get('http://127.0.0.1:8000/api/wali/spp', { headers }),
        ]);

        setAcademicList(academicRes.data);
        setNgajiList(ngajiRes.data);
        setAbsensiList(absensiRes.data);
        setSppList(sppRes.data);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center font-semibold text-tk-muted">
        Memuat data dashboard...
      </div>
    );
  }

  // Derive latest records
  const latestAcademic = academicList[0] || null;
  const latestNgaji = ngajiList[0] || null;
  const latestAbsensi = absensiList[0] || null;
  const activeSPP = sppList.find(s => s.status_pembayaran === 'Belum Lunas' || s.status_pembayaran === 'Menunggu Verifikasi') || sppList[0] || null;

  const childName = parentProfile?.profile?.anak?.nama_lengkap || 'Anak';
  const ayah = parentProfile?.profile?.nama_ayah;
  const ibu = parentProfile?.profile?.nama_ibu;
  const parentName = ayah || ibu ? `${ayah || ''}${ayah && ibu ? ' / ' : ''}${ibu || ''}` : 'Bapak/Ibu Wali Murid';

  return (
    <div className="flex flex-col gap-8">
      {/* ============================================================
          BAGIAN 1: Welcome Banner
          Spanduk selamat datang dengan sapaan personal nama ayah/ibu,
          nama anak yang dipantau, dan foto avatar siswa.
         ============================================================ */}
      <div className="bg-tk-secondary-light rounded-2xl p-12 md:px-16 flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10 max-w-[60%]">
          <span className="inline-block bg-tk-primary text-white px-4 py-2 rounded-full font-semibold text-[0.85rem] mb-6">Welcome Back!</span>
          <h1 className="text-2xl md:text-3xl text-tk-primary font-bold mb-3">Assalamualaikum, {parentName}</h1>
          <p className="text-tk-text font-medium m-0">Ayo cek perkembangan buah hati Anda ({childName}) di sini.</p>
        </div>
        <div className="absolute right-16 bottom-0 w-[280px] h-[280px] rounded-t-3xl overflow-hidden shadow-lg border-4 border-b-0 border-white translate-y-4">
          <img src={profilePhoto} alt="Student" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* ============================================================
          BAGIAN 2: Grid Widget Utama (3 kolom)
          Tiga kartu utama yang ditampilkan berdampingan:
         ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ============================================================
            BAGIAN 2A: Widget Perkembangan Akademik
            Menampilkan nilai calistung (Membaca, Menulis, Berhitung) terbaru.
           ============================================================ */}
        <div className="bg-tk-card rounded-xl border border-tk-border p-6 shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-md bg-tk-secondary-light text-tk-primary flex items-center justify-center"><Icons.Book /></div>
              <h2 className="text-[1.1rem] font-semibold m-0">Proses Akademik</h2>
            </div>
            
            {latestAcademic ? (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-[0.9rem] font-semibold">
                  <span className="text-tk-text">Membaca</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E0F2FE] text-[#0369A1]">{latestAcademic.membaca}</span>
                </div>
                <div className="flex justify-between items-center text-[0.9rem] font-semibold">
                  <span className="text-tk-text">Menulis</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FCE7F3] text-[#BE185D]">{latestAcademic.menulis}</span>
                </div>
                <div className="flex justify-between items-center text-[0.9rem] font-semibold">
                  <span className="text-tk-text">Berhitung</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#B45309]">{latestAcademic.berhitung}</span>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 text-tk-muted text-sm font-semibold">
                Belum ada laporan calistung
              </div>
            )}
          </div>
          {latestAcademic && (
            <span className="text-[0.7rem] text-tk-muted mt-4 text-right block border-t border-tk-border/50 pt-2">
              Laporan: Minggu ke-{latestAcademic.minggu_ke}, {latestAcademic.bulan} {latestAcademic.tahun}
            </span>
          )}
        </div>

        {/* ============================================================
            BAGIAN 2B: Widget Catatan Mengaji
            Menampilkan catatan mengaji terkini (halaman/surah terakhir)
            yang diinput oleh guru.
           ============================================================ */}
        <div className="bg-tk-card rounded-xl border border-tk-border p-6 shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-md bg-[#FEF3C7] text-[#D97706] flex items-center justify-center"><Icons.Book /></div>
              <h2 className="text-[1.1rem] font-semibold m-0">Catatan Mengaji</h2>
            </div>
            
            {latestNgaji ? (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <div className="w-16 h-16 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mb-4">
                  <Icons.Book />
                </div>
                <p className="text-xs text-tk-muted m-0 uppercase font-bold tracking-wider">Halaman / Surah Terakhir</p>
                <h3 className="text-xl font-bold text-tk-primary mt-1 mb-2">{latestNgaji.catatan}</h3>
              </div>
            ) : (
              <div className="text-center p-6 text-tk-muted text-sm font-semibold">
                Belum ada catatan mengaji
              </div>
            )}
          </div>
          {latestNgaji && (
            <span className="text-[0.7rem] text-tk-muted mt-4 text-right block border-t border-tk-border/50 pt-2">
              Tanggal: {new Date(latestNgaji.tanggal).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
            </span>
          )}
        </div>

        {/* ============================================================
            BAGIAN 2C: Widget SPP
            Menampilkan tagihan SPP aktif yang belum lunas atau menunggu verifikasi.
            Dilengkapi tombol "Bayar / Upload Bukti" menuju halaman BayarSPP.
           ============================================================ */}
        <div className="bg-tk-card rounded-xl border border-tk-border p-6 shadow-sm flex flex-col min-h-[300px]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-md bg-red-100 text-red-600 flex items-center justify-center"><Icons.Payment /></div>
            <h2 className="text-[1.1rem] font-semibold m-0">SPP</h2>
          </div>

          {activeSPP ? (
            <div className="flex flex-col flex-1 justify-between">
              <div className="bg-[#FAFAFA] border border-tk-border rounded-md p-5 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-center mb-3 text-[0.9rem] font-semibold">
                  <span>{activeSPP.bulan} {activeSPP.tahun}</span>
                  <span className={`text-[0.7rem] px-2.5 py-1 rounded-full font-bold ${
                    activeSPP.status_pembayaran === 'Lunas' ? 'bg-green-100 text-green-700' :
                    activeSPP.status_pembayaran === 'Menunggu Verifikasi' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {activeSPP.status_pembayaran === 'Belum Lunas' ? 'BELUM BAYAR' : activeSPP.status_pembayaran.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-2xl font-bold m-0 text-tk-primary">Rp {activeSPP.nominal.toLocaleString('id-ID')}</h3>
                <p className="text-[0.75rem] text-tk-muted mt-1.5 m-0">Tahun Ajaran: 2026/2027</p>
              </div>

              <button 
                onClick={() => navigate('/orangtua/spp')}
                className="bg-tk-primary text-white w-full py-3.5 rounded-md font-bold hover:bg-tk-primary-light transition-colors border-0 cursor-pointer text-sm mt-5"
              >
                Bayar / Upload Bukti
              </button>
            </div>
          ) : (
            <div className="text-center p-6 text-tk-muted text-sm font-semibold flex-1 flex items-center justify-center">
              Belum ada tagihan SPP
            </div>
          )}
        </div>
      </div>

      {/* ============================================================
          BAGIAN 3: Log Aktivitas Perkembangan Anak
          Panel 3 kartu horizontal:
          - Kiri: Catatan perkembangan akademik guru (calistung)
          - Tengah: Catatan mengaji terbaru guru
          - Kanan: Status kehadiran terakhir (Hadir/Sakit/Izin/Alfa)
         ============================================================ */}
      <div className="bg-tk-card rounded-xl border border-tk-border p-6 shadow-sm flex flex-col col-span-1 md:col-span-3">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-tk-secondary-light text-tk-primary flex items-center justify-center"><Icons.User /></div>
            <h2 className="text-[1.1rem] font-semibold m-0">Log Aktivitas Perkembangan Anak</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Akademik */}
          <div className="p-6 rounded-md bg-[#FAFAFA] border-l-4 border-[#65A30D] relative flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-semibold m-0 text-tk-text">Perkembangan Calistung</h3>
                <span className="text-[0.7rem] text-tk-muted font-semibold">Akademik</span>
              </div>
              <p className="text-[0.85rem] text-tk-muted leading-relaxed m-0 mt-2">
                {latestAcademic ? latestAcademic.catatan : 'Belum ada catatan akademik terbaru.'}
              </p>
            </div>
            {latestAcademic && (
              <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-[#ECFCCB] text-[#4D7C0F] self-start mt-4 uppercase">
                Minggu ke-{latestAcademic.minggu_ke} ({latestAcademic.bulan})
              </span>
            )}
          </div>

          {/* Card 2: Mengaji */}
          <div className="p-6 rounded-md bg-[#FAFAFA] border-l-4 border-[#D97706] relative flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-semibold m-0 text-tk-text">Catatan Mengaji</h3>
                <span className="text-[0.7rem] text-tk-muted font-semibold">Mengaji</span>
              </div>
              <p className="text-[0.85rem] text-tk-muted leading-relaxed m-0 mt-2">
                {latestNgaji ? `Anak telah belajar: ${latestNgaji.catatan}` : 'Belum ada catatan mengaji terbaru.'}
              </p>
            </div>
            {latestNgaji && (
              <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] self-start mt-4 uppercase">
                {new Date(latestNgaji.tanggal).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
              </span>
            )}
          </div>

          {/* Card 3: Absensi */}
          <div className="p-6 rounded-md bg-[#FAFAFA] border-l-4 border-red-600 relative flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-semibold m-0 text-tk-text">Kehadiran Terakhir</h3>
                <span className="text-[0.7rem] text-tk-muted font-semibold">Absensi</span>
              </div>
              <p className="text-[0.85rem] text-tk-muted leading-relaxed m-0 mt-2">
                {latestAbsensi ? `Status kehadiran: ${latestAbsensi.status.toUpperCase()} ${latestAbsensi.keterangan ? `(${latestAbsensi.keterangan})` : ''}` : 'Belum ada catatan kehadiran terbaru.'}
              </p>
            </div>
            {latestAbsensi && (
              <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 self-start mt-4 uppercase">
                {new Date(latestAbsensi.tanggal).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOrangtua;
