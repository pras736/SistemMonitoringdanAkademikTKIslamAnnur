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

// Nav Item configs
const guruNavItems = [
  { path: '/guru', icon: Icons.Dashboard, label: 'Dashboard' },
  { path: '/guru/absen', icon: Icons.Absen, label: 'Absen' },
  { path: '/guru/nilai', icon: Icons.Nilai, label: 'Nilai' },
  { path: '/guru/mengaji', icon: Icons.Mengaji, label: 'Mengaji' },
  { path: '/guru/jadwal', icon: Icons.Jadwal, label: 'Jadwal' },
];

const adminNavItems = [
  { path: '/admin', icon: Icons.Dashboard, label: 'Dashboard' },
  { path: '/admin/users', icon: Icons.Users, label: 'User Management' },
  { path: '/admin/academic', icon: Icons.Book, label: 'Academic Data' },
  { path: '/admin/spp', icon: Icons.Payment, label: 'SPP Payments' },
];

const orangtuaNavItems = [
  { path: '/orangtua', icon: Icons.Dashboard, label: 'Dashboard' },
  { path: '/orangtua/progress', icon: Icons.Chart, label: 'Perkembangan Anak' },
  { path: '/orangtua/reports', icon: Icons.Book, label: 'Academic Reports' },
  { path: '/orangtua/mengaji', icon: Icons.Mengaji, label: 'Catatan Mengaji' },
  { path: '/orangtua/spp', icon: Icons.Payment, label: 'Pembayaran SPP' },
  { path: '/orangtua/profile', icon: Icons.User, label: 'Profile Settings' },
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
          </Route>

          {/* Admin Routes */}
          <Route element={<Layout role="admin" navItems={adminNavItems} />}>
            <Route path="/admin" element={<DashboardAdmin />} />
          </Route>

          {/* Parent Routes */}
          <Route element={<Layout role="orangtua" navItems={orangtuaNavItems} />}>
            <Route path="/orangtua" element={<DashboardOrangtua />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
