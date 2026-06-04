import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Icons } from '../Icons';
import teacherAvatar from '../../assets/teacher_avatar.png';

export const Layout = ({ role = 'guru', navItems, userAvatar, userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-tk-bg text-tk-text">
      {/* Sidebar */}
      <aside className="w-[260px] bg-tk-card border-r border-tk-border flex flex-col p-6 shrink-0 sticky top-0 h-screen box-border">
        <div className="mb-10 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-tk-primary text-white flex items-center justify-center rounded-md font-bold text-lg shrink-0">TK</div>
            <div className="flex flex-col">
              <span className="font-bold text-[1.05rem] text-tk-primary">TK Islam An Nur</span>
              <span className="text-xs text-tk-muted">Sistem Monitoring & Akademik</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1">
          <ul className="flex flex-col gap-2">
            {navItems.map(item => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-md font-semibold text-[0.95rem] transition-all duration-200 cursor-pointer ${isActive ? 'bg-tk-secondary-light text-tk-primary' : 'text-tk-muted hover:bg-tk-secondary-light hover:text-tk-primary'}`}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto pt-6 border-t border-tk-border flex flex-col gap-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md font-semibold text-[0.95rem] text-tk-muted hover:bg-tk-secondary-light hover:text-tk-primary transition-all duration-200 cursor-pointer">
            <Icons.Help />
            <span>Help</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md font-semibold text-[0.95rem] text-tk-muted hover:bg-tk-secondary-light hover:text-tk-primary transition-all duration-200 cursor-pointer" onClick={handleLogout}>
            <Icons.Logout />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Global Header */}
        <header className="h-[72px] bg-tk-card border-b border-tk-border flex justify-between items-center px-10 sticky top-0 z-50">
          <h2 className="text-xl font-bold text-tk-primary m-0">TK Islam An Nur</h2>
          <div className="flex items-center gap-5">
            <button className="relative w-10 h-10 rounded-full flex items-center justify-center bg-transparent text-tk-muted transition-all duration-200 hover:bg-tk-bg hover:text-tk-primary">
              <Icons.Bell />
              <span className="absolute top-1 right-1 bg-red-600 text-white text-[0.65rem] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">3</span>
            </button>
            <button className="relative w-10 h-10 rounded-full flex items-center justify-center bg-transparent text-tk-muted transition-all duration-200 hover:bg-tk-bg hover:text-tk-primary">
              <Icons.Settings />
            </button>
            <div className="cursor-pointer">
              <img src={userAvatar || teacherAvatar} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-tk-border" />
            </div>
          </div>
        </header>

        {/* Page Content injected via Outlet */}
        <div className="p-10 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
