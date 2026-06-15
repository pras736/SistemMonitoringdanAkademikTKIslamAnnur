import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Icons } from './components/Icons';
import './App.css';

// Lazy loading screens
const Login = lazy(() => import('./screens/Login/Login'));
const DashboardGuru = lazy(() => import('./screens/DashboardGuru').then(m => ({ default: m.DashboardGuru })));
const DashboardAdmin = lazy(() => import('./screens/DashboardAdmin').then(m => ({ default: m.DashboardAdmin })));
const DashboardOrangtua = lazy(() => import('./screens/DashboardOrangtua').then(m => ({ default: m.DashboardOrangtua })));

// Admin screens
const ManageGuru = lazy(() => import('./screens/DashboardAdmin/ManageGuru').then(m => ({ default: m.ManageGuru })));
const ManageSiswa = lazy(() => import('./screens/DashboardAdmin/ManageSiswa').then(m => ({ default: m.ManageSiswa })));
const VerifySPP = lazy(() => import('./screens/DashboardAdmin/VerifySPP').then(m => ({ default: m.VerifySPP })));

// Guru screens
const ManageAbsen = lazy(() => import('./screens/DashboardGuru/ManageAbsen').then(m => ({ default: m.ManageAbsen })));
const InputAkademik = lazy(() => import('./screens/DashboardGuru/InputAkademik').then(m => ({ default: m.InputAkademik })));
const InputMengaji = lazy(() => import('./screens/DashboardGuru/InputMengaji').then(m => ({ default: m.InputMengaji })));
const ManageKegiatan = lazy(() => import('./screens/DashboardGuru/ManageKegiatan').then(m => ({ default: m.ManageKegiatan })));

// Orangtua screens
const EditAnak = lazy(() => import('./screens/DashboardOrangtua/EditAnak').then(m => ({ default: m.EditAnak })));
const ProgressAnak = lazy(() => import('./screens/DashboardOrangtua/ProgressAnak').then(m => ({ default: m.ProgressAnak })));
const ListKegiatan = lazy(() => import('./screens/DashboardOrangtua/ListKegiatan').then(m => ({ default: m.ListKegiatan })));
const BayarSPP = lazy(() => import('./screens/DashboardOrangtua/BayarSPP').then(m => ({ default: m.BayarSPP })));

// Nav Item configs
const guruNavItems = [
  { path: '/guru', icon: Icons.Dashboard, label: 'Dashboard' },
  { path: '/guru/absen', icon: Icons.Absen, label: 'Absensi Harian' },
  { path: '/guru/nilai', icon: Icons.Nilai, label: 'Perkembangan Calistung' },
  { path: '/guru/mengaji', icon: Icons.Mengaji, label: 'Catatan Mengaji' },
  { path: '/guru/jadwal', icon: Icons.Jadwal, label: 'Kegiatan Luar Sekolah' },
];

const adminNavItems = [
  { path: '/admin', icon: Icons.Dashboard, label: 'Dashboard' },
  { path: '/admin/users', icon: Icons.Users, label: 'Kelola Data Guru' },
  { path: '/admin/academic', icon: Icons.Book, label: 'Kelola Siswa & Kelas' },
  { path: '/admin/spp', icon: Icons.Payment, label: 'Verifikasi SPP' },
];

const orangtuaNavItems = [
  { path: '/orangtua', icon: Icons.Dashboard, label: 'Dashboard' },
  { path: '/orangtua/profile', icon: Icons.User, label: 'Biodata Anak' },
  { path: '/orangtua/progress', icon: Icons.Chart, label: 'Perkembangan Anak' },
  { path: '/orangtua/reports', icon: Icons.Book, label: 'Kegiatan Luar Sekolah' },
  { path: '/orangtua/spp', icon: Icons.Payment, label: 'Pembayaran SPP' },
];

function App() {
  return (
    <Router>
      <Suspense fallback={<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Teacher Routes */}
          <Route element={<Layout role="guru" navItems={guruNavItems} />}>
            <Route path="/guru" element={<DashboardGuru />} />
            <Route path="/guru/absen" element={<ManageAbsen />} />
            <Route path="/guru/nilai" element={<InputAkademik />} />
            <Route path="/guru/mengaji" element={<InputMengaji />} />
            <Route path="/guru/jadwal" element={<ManageKegiatan />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<Layout role="admin" navItems={adminNavItems} />}>
            <Route path="/admin" element={<DashboardAdmin />} />
            <Route path="/admin/users" element={<ManageGuru />} />
            <Route path="/admin/academic" element={<ManageSiswa />} />
            <Route path="/admin/spp" element={<VerifySPP />} />
          </Route>

          {/* Parent Routes */}
          <Route element={<Layout role="orangtua" navItems={orangtuaNavItems} />}>
            <Route path="/orangtua" element={<DashboardOrangtua />} />
            <Route path="/orangtua/profile" element={<EditAnak />} />
            <Route path="/orangtua/progress" element={<ProgressAnak />} />
            <Route path="/orangtua/reports" element={<ListKegiatan />} />
            <Route path="/orangtua/spp" element={<BayarSPP />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
