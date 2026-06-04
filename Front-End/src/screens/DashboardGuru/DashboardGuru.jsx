import React from 'react';
import { Icons } from '../../components/Icons';
import student1Avatar from '../../assets/student_avatar_1.png';
import student2Avatar from '../../assets/student_avatar_2.png';

export const DashboardGuru = () => {
  // Dummy Data
  const attendanceData = [
    { id: 1, name: 'Ahmad Rizky', time: '07:15 AM', status: 'present', avatar: student1Avatar },
    { id: 2, name: 'Budi Pratama', status: 'absent', avatar: student2Avatar },
  ];

  const mengajiData = [
    { id: 1, name: 'Ahmad Rizky', hafalan: 'Al-Fatihah, An-Nas', nilai: 'A', status: 'Done' },
    { id: 2, name: 'Aisha Zahra', hafalan: 'Iqra 4: 12', nilai: 'B+', status: 'Ongoing' },
  ];

  const academicData = [
    { subject: 'Mathematics', score: '88.5', label: 'Average Class Score' },
    { subject: 'Science & Nature', score: '92.0', label: 'Average Class Score' },
    { subject: 'Ethics & Moral', score: '95.2', label: 'Average Class Score' },
    { subject: 'Arts & Crafts', score: '--', label: 'Average Class Score' },
  ];

  return (
    <div className="flex flex-col text-tk-text">
      {/* Page Header (Greeting) */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-tk-text mb-1">Assalamu'alaikum, Bu. Sarah!</h1>
          <p className="text-tk-muted text-[0.95rem]">Your TK An-Nur class is ready for another joyful day of learning.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="bg-tk-primary text-white inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-[0.9rem] transition-all duration-200 hover:bg-tk-primary-light hover:-translate-y-px hover:shadow-sm">
            <Icons.Plus />
            Daily Report
          </button>
        </div>
      </header>

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Attendance Widget */}
        <div className="bg-tk-card rounded-xl p-6 shadow-sm flex flex-col border border-tk-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="flex items-center gap-2 text-[1.1rem] font-semibold text-tk-primary"><Icons.Absen /> Daily Attendance</h2>
            <span className="px-3 py-1 rounded-full text-[0.8rem] font-semibold bg-[#ECFCCB] text-[#65A30D]">18 / 20 Present</span>
          </div>
          
          <div className="flex flex-col gap-4 mb-6">
            {attendanceData.map(student => (
              <div key={student.id} className="flex justify-between items-center p-3 border border-tk-border rounded-md bg-[#FAFAFA]">
                <div className="flex items-center gap-4">
                  <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-[0.95rem] text-tk-text m-0">{student.name}</p>
                    {student.time && <p className="text-[0.8rem] text-tk-muted m-0">{student.time}</p>}
                    {student.status === 'absent' && <p className="text-[0.8rem] text-red-600 font-medium m-0">Absent</p>}
                  </div>
                </div>
                <label className="relative inline-block w-11 h-6 cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={student.status === 'present'} />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#65A30D]"></div>
                </label>
              </div>
            ))}
          </div>
          <button className="text-tk-primary font-semibold text-[0.9rem] text-center p-2 mt-auto hover:underline">View All Students</button>
        </div>

        {/* Kartu Catatan Mengaji Widget */}
        <div className="bg-tk-card rounded-xl p-6 shadow-sm flex flex-col border border-tk-border lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="flex items-center gap-2 text-[1.1rem] font-semibold text-tk-primary"><Icons.Mengaji /> Kartu Catatan Mengaji</h2>
            <div className="flex gap-3 items-center">
              <select className="px-4 py-2 pr-8 border border-tk-border rounded-full bg-white font-sans text-[0.9rem] text-tk-text outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg_xmlns=%22http://www.w3.org/2000/svg%22_viewBox=%220_0_24_24%22_fill=%22none%22_stroke=%22currentColor%22_stroke-width=%222%22_stroke-linecap=%22round%22_stroke-linejoin=%22round%22%3e%3cpolyline_points=%226_9_12_15_18_9%22%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px]">
                <option>Iqra 4</option>
                <option>Iqra 5</option>
              </select>
              <button className="bg-transparent border border-tk-primary text-tk-primary px-4 py-2 rounded-full font-semibold flex items-center justify-center hover:bg-tk-secondary-light transition-colors">Add New</button>
            </div>
          </div>
          
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="px-4 py-3 font-medium text-tk-muted border-b-2 border-tk-border text-[0.85rem] uppercase tracking-wide">Student</th>
                  <th className="px-4 py-3 font-medium text-tk-muted border-b-2 border-tk-border text-[0.85rem] uppercase tracking-wide">Surah / Hafalan</th>
                  <th className="px-4 py-3 font-medium text-tk-muted border-b-2 border-tk-border text-[0.85rem] uppercase tracking-wide">Nilai</th>
                  <th className="px-4 py-3 font-medium text-tk-muted border-b-2 border-tk-border text-[0.85rem] uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 font-medium text-tk-muted border-b-2 border-tk-border text-[0.85rem] uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {mengajiData.map(item => (
                  <tr key={item.id}>
                    <td className="p-4 border-b border-tk-border align-middle font-medium m-0">{item.name}</td>
                    <td className="p-4 border-b border-tk-border align-middle font-medium m-0">{item.hafalan}</td>
                    <td className="p-4 border-b border-tk-border align-middle font-medium m-0"><span className="inline-block px-3 py-1 bg-tk-secondary-light text-tk-primary rounded font-bold">{item.nilai}</span></td>
                    <td className="p-4 border-b border-tk-border align-middle font-medium m-0">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${item.status === 'Done' ? 'bg-[#65A30D]' : 'bg-[#D97706]'}`}></span>
                      {item.status}
                    </td>
                    <td className="p-4 border-b border-tk-border align-middle font-medium m-0"><button className="w-8 h-8 rounded-full bg-[#ECFCCB] text-[#65A30D] flex items-center justify-center transition-all duration-200 hover:bg-[#65A30D] hover:text-white"><Icons.Check /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="text-tk-primary font-semibold text-[0.9rem] text-center p-2 mt-auto hover:underline">View Progress History</button>
        </div>

        {/* Academic Grade Input */}
        <div className="bg-tk-card rounded-xl p-6 shadow-sm flex flex-col border border-tk-border lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="flex items-center gap-2 text-[1.1rem] font-semibold text-tk-primary"><Icons.Nilai /> Academic Grade Input</h2>
            <div className="flex gap-3 items-center">
              <select className="px-4 py-2 pr-8 border border-tk-border rounded-full bg-white font-sans text-[0.9rem] text-tk-text outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg_xmlns=%22http://www.w3.org/2000/svg%22_viewBox=%220_0_24_24%22_fill=%22none%22_stroke=%22currentColor%22_stroke-width=%222%22_stroke-linecap=%22round%22_stroke-linejoin=%22round%22%3e%3cpolyline_points=%226_9_12_15_18_9%22%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px]">
                <option>Mid-Term</option>
                <option>Final-Term</option>
              </select>
              <button className="bg-tk-primary text-white px-5 py-2 rounded-full font-semibold flex items-center justify-center hover:bg-tk-primary-light transition-colors">Final Report</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {academicData.map((subject, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-tk-border bg-[#FAFAFA] flex flex-col">
                <h3 className="text-base text-tk-text mb-4 font-semibold">{subject.subject}</h3>
                <div className="text-3xl font-bold text-tk-primary mb-2">
                  <span>{subject.score}</span>
                </div>
                <p className="text-[0.8rem] text-tk-muted">{subject.label}</p>
                <button className="w-full mt-4 bg-transparent border border-tk-primary text-tk-primary px-4 py-2.5 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-tk-secondary-light transition-colors">
                  <Icons.Plus /> Input Grades
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
