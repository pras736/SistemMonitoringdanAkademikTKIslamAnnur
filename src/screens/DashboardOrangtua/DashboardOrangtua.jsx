import React from 'react';
import { Icons } from '../../components/Icons';
import student2Avatar from '../../assets/student_avatar_2.png';

const DashboardOrangtua = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="bg-tk-secondary-light rounded-2xl p-12 md:px-16 flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10 max-w-[50%]">
          <span className="inline-block bg-tk-primary text-white px-4 py-2 rounded-full font-semibold text-[0.85rem] mb-6">Welcome Back!</span>
          <h1 className="text-3xl text-tk-primary font-bold mb-3">Assalamualaikum, Bapak/Ibu</h1>
          <p className="text-tk-text font-medium m-0">Ayo cek perkembangan buah hati anda disini</p>
        </div>
        <div className="absolute right-16 bottom-0 w-[280px] h-[280px] rounded-t-3xl overflow-hidden shadow-lg border-4 border-b-0 border-white translate-y-4">
          <img src={student2Avatar} alt="Student" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Main Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Academic Progress */}
        <div className="bg-tk-card rounded-xl border border-tk-border p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-md bg-tk-secondary-light text-tk-primary flex items-center justify-center"><Icons.Book /></div>
            <h2 className="text-[1.1rem] font-semibold m-0">Proses Akademik</h2>
          </div>
          
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[0.9rem] font-medium">
                <span>Phonics & Literacy</span>
                <span>85%</span>
              </div>
              <div className="w-full h-2 bg-tk-border rounded-full overflow-hidden">
                <div className="h-full bg-tk-secondary rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[0.9rem] font-medium">
                <span>Early Mathematics</span>
                <span>92%</span>
              </div>
              <div className="w-full h-2 bg-tk-border rounded-full overflow-hidden">
                <div className="h-full bg-tk-secondary rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[0.9rem] font-medium">
                <span>Creative Arts</span>
                <span>78%</span>
              </div>
              <div className="w-full h-2 bg-tk-border rounded-full overflow-hidden">
                <div className="h-full bg-tk-secondary rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Catatan Mengaji */}
        <div className="bg-tk-card rounded-xl border border-tk-border p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-md bg-[#FEF3C7] text-[#D97706] flex items-center justify-center"><Icons.Book /></div>
            <h2 className="text-[1.1rem] font-semibold m-0">Catatan Mengaji</h2>
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="w-[140px] h-[140px] rounded-full flex items-center justify-center" style={{ background: 'conic-gradient(#A3B18A 70%, #E2E8DF 0)' }}>
              <div className="w-[120px] h-[120px] bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="text-2xl font-bold text-tk-primary">70%</span>
                <span className="text-[0.65rem] font-semibold text-tk-muted mt-1">COMPLETE</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[0.85rem] text-tk-muted m-0">Current Stage:</p>
            <p className="font-semibold text-tk-text my-1 m-0">Iqra 3 - Page 14</p>
            <div className="flex justify-center text-[#FBBF24]">
              <Icons.Chart />
            </div>
          </div>
        </div>

        {/* SPP Payment */}
        <div className="bg-tk-card rounded-xl border border-tk-border p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-md bg-red-100 text-red-600 flex items-center justify-center"><Icons.Payment /></div>
            <h2 className="text-[1.1rem] font-semibold m-0">SPP</h2>
          </div>

          <div className="bg-[#FAFAFA] border border-tk-border rounded-md p-5 mb-5">
            <div className="flex justify-between items-center mb-3 text-[0.9rem] font-medium">
              <span>October 2023</span>
              <span className="bg-red-100 text-red-600 text-[0.7rem] px-2 py-1 rounded-full font-bold">UNPAID</span>
            </div>
            <h3 className="text-2xl font-bold m-0">Rp 1.250.000</h3>
            <p className="text-[0.85rem] text-tk-muted mt-1 m-0">Due date: Oct 10, 2023</p>
          </div>

          <button className="bg-tk-primary text-white w-full p-4 rounded-md font-bold mb-5 hover:bg-tk-primary-light transition-colors">Pay Now</button>

          <div className="border border-dashed border-tk-border rounded-md p-6 flex flex-col items-center gap-2 text-tk-muted cursor-pointer bg-[#FAFAFA] hover:bg-tk-border transition-colors">
            <Icons.Upload />
            <p className="text-[0.85rem] font-medium m-0">Upload Transfer Proof</p>
          </div>
        </div>
      </div>

      {/* Log Aktivitas Guru */}
      <div className="bg-tk-card rounded-xl border border-tk-border p-6 shadow-sm flex flex-col col-span-1 md:col-span-3">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-tk-secondary-light text-tk-primary flex items-center justify-center"><Icons.User /></div>
            <h2 className="text-[1.1rem] font-semibold m-0">Log Aktivitas Guru</h2>
          </div>
          <a href="#" className="text-tk-primary font-semibold text-[0.9rem] hover:underline">View All</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-md bg-[#FAFAFA] border-l-4 border-[#65A30D] relative">
            <div className="absolute top-6 right-6 text-[0.8rem] text-tk-muted font-medium">10:30 AM</div>
            <h3 className="text-base mb-2 pr-16 font-semibold m-0">Morning Circle Time</h3>
            <p className="text-[0.9rem] text-tk-muted mb-6 leading-relaxed m-0">Aisyah was very active in participating during the...</p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-[0.7rem] font-bold px-2.5 py-1 rounded-full bg-[#ECFCCB] text-[#4D7C0F]">LITERACY</span>
              <span className="text-[0.7rem] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700">SOCIAL</span>
            </div>
          </div>

          <div className="p-6 rounded-md bg-[#FAFAFA] border-l-4 border-[#D97706] relative">
            <div className="absolute top-6 right-6 text-[0.8rem] text-tk-muted font-medium">12:00 PM</div>
            <h3 className="text-base mb-2 pr-16 font-semibold m-0">Lunch & Etiquette</h3>
            <p className="text-[0.9rem] text-tk-muted mb-6 leading-relaxed m-0">Successfully finished her vegetables and remembered</p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-[0.7rem] font-bold px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#B45309]">SELF-CARE</span>
            </div>
          </div>

          <div className="p-6 rounded-md bg-[#FAFAFA] border-l-4 border-red-600 relative">
            <div className="absolute top-6 right-6 text-[0.8rem] text-tk-muted font-medium">02:15 PM</div>
            <h3 className="text-base mb-2 pr-16 font-semibold m-0">Creative Art Project</h3>
            <p className="text-[0.9rem] text-tk-muted mb-6 leading-relaxed m-0">Created a beautiful butterfly using finger paints. Showed...</p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-[0.7rem] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700">ART</span>
              <span className="text-[0.7rem] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">FINE MOTOR</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardOrangtua;
