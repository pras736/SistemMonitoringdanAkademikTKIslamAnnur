import React from 'react';
import { Icons } from '../../components/Icons';
import teacherAvatar from '../../assets/teacher_avatar.png';
import student1Avatar from '../../assets/student_avatar_1.png';

const DashboardAdmin = () => {
  // Dummy Data
  const users = [
    { id: 1, name: 'Aris Setiawan', email: 'aris.s@kindybloom.edu', role: 'Teacher', status: 'Active', avatar: teacherAvatar },
    { id: 2, name: 'Maya Angelia', email: 'maya.a@parent.com', role: 'Parent', status: 'Active', avatar: student1Avatar },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header Area */}
      <header>
        <h1 className="text-3xl font-bold mb-1">Hello, Admin !</h1>
        <p className="text-tk-muted text-[0.95rem]">Here's what's happening at TK Islam An Nur today.</p>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-tk-card p-6 rounded-xl border border-tk-border shadow-sm">
          <p className="text-[0.8rem] font-semibold text-tk-muted mb-2 uppercase">TOTAL USERS</p>
          <h2 className="text-4xl font-bold mb-2">1,284</h2>
          <p className="text-[0.85rem] text-[#65A30D]">+12% from last month</p>
        </div>
        <div className="bg-tk-card p-6 rounded-xl border border-tk-border shadow-sm">
          <p className="text-[0.8rem] font-semibold text-tk-muted mb-2 uppercase">ACTIVE CLASSES</p>
          <h2 className="text-4xl font-bold mb-2">42</h2>
          <p className="text-[0.85rem] text-tk-muted">+3 New starts today</p>
        </div>
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-sm">
          <p className="text-[0.8rem] font-semibold text-red-600 mb-2 uppercase">PENDING SPP</p>
          <h2 className="text-4xl font-bold mb-2">18</h2>
          <p className="text-[0.85rem] text-red-600 font-semibold">! Requires verification</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Management */}
        <div className="bg-tk-card rounded-xl border border-tk-border p-6 flex flex-col lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-[1.1rem] font-semibold m-0">User Management</h2>
              <span className="px-3 py-1 rounded-full text-[0.8rem] font-semibold bg-tk-secondary-light text-tk-primary">Recent Activity</span>
            </div>
            <button className="bg-tk-primary text-white px-4 py-2 rounded-md flex items-center gap-2 font-semibold hover:bg-tk-primary-light transition-colors">
              <Icons.Plus /> Add User
            </button>
          </div>
          
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 text-tk-muted border-b border-tk-border font-medium text-[0.9rem]">User</th>
                  <th className="text-left p-4 text-tk-muted border-b border-tk-border font-medium text-[0.9rem]">Role</th>
                  <th className="text-left p-4 text-tk-muted border-b border-tk-border font-medium text-[0.9rem]">Status</th>
                  <th className="text-left p-4 text-tk-muted border-b border-tk-border font-medium text-[0.9rem]">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="p-4 border-b border-tk-border">
                      <div className="flex items-center gap-4">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-semibold text-tk-text m-0">{user.name}</p>
                          <p className="text-[0.85rem] text-tk-muted m-0">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-tk-border">
                      <span className={`px-3 py-1 rounded-full text-[0.85rem] font-semibold ${user.role === 'Teacher' ? 'bg-[#FEF3C7] text-[#B45309]' : 'bg-[#FCE7F3] text-[#BE185D]'}`}>{user.role}</span>
                    </td>
                    <td className="p-4 border-b border-tk-border">
                      <span className="flex items-center gap-2 font-medium">
                        <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-[#65A30D]' : 'bg-tk-muted'}`}></span> {user.status}
                      </span>
                    </td>
                    <td className="p-4 border-b border-tk-border">
                      <button className="text-tk-muted hover:text-tk-primary transition-colors"><Icons.MoreVertical /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="w-full p-4 rounded-md font-semibold text-center bg-[#FAFAFA] border border-dashed border-tk-border text-tk-muted hover:bg-tk-border transition-colors mt-auto">View All 1,284 Users</button>
        </div>

        {/* SPP Verification */}
        <div className="bg-tk-card rounded-xl border border-tk-border p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[1.1rem] font-semibold m-0">SPP Verification</h2>
            <span className="px-3 py-1 rounded-full text-[0.8rem] font-semibold bg-red-600 text-white">Urgent</span>
          </div>

          <div className="flex flex-col gap-4">
            {[1, 2].map((item) => (
              <div key={item} className="border border-tk-border rounded-md p-4">
                <div className="flex gap-4 mb-4">
                  <div className="w-12 h-12 rounded-md bg-tk-secondary-light text-tk-primary flex items-center justify-center shrink-0"><Icons.Payment /></div>
                  <div>
                    <p className="font-semibold m-0">Leo's SPP - Sept</p>
                    <p className="text-[0.85rem] text-tk-muted m-0">Sender: Mrs. Sarah Kim</p>
                    <p className="font-bold text-tk-primary mt-1 m-0">Rp 1.500.000</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="border border-[#65A30D] text-[#65A30D] px-4 py-2 rounded-md flex-1 flex items-center justify-center gap-2 font-semibold hover:bg-[#65A30D] hover:text-white transition-colors"><Icons.Check /> Approve</button>
                  <button className="border border-red-600 text-red-600 px-4 py-2 rounded-md flex-1 flex items-center justify-center gap-2 font-semibold hover:bg-red-600 hover:text-white transition-colors"><Icons.Plus className="rotate-45" /> Reject</button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full p-4 rounded-md font-semibold text-center bg-[#FAFAFA] border border-dashed border-tk-border text-tk-muted hover:bg-tk-border transition-colors mt-auto">View All Pending Transfers</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
