import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, MoreVertical, CheckCircle2, XCircle, AlertCircle, Phone, Video, User } from 'lucide-react';
import { appointmentService, Appointment } from '../services/appointmentService';
import { useAuth } from '../contexts/AuthContext';

function StatusBadge({ status }: { status: Appointment['status'] }) {
  const styles = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    confirmed: 'bg-green-50 text-green-700 border-green-100',
    completed: 'bg-blue-50 text-blue-700 border-blue-100',
    cancelled: 'bg-red-50 text-red-700 border-red-100',
  };

  const icons = {
    pending: <AlertCircle className="w-3 h-3" />,
    confirmed: <CheckCircle2 className="w-3 h-3" />,
    completed: <CheckCircle2 className="w-3 h-3" />,
    cancelled: <XCircle className="w-3 h-3" />,
  };

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}>
      {icons[status]}
      {status}
    </div>
  );
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !profile) return;

    const unsubscribe = appointmentService.subscribeToUserAppointments(
      user.uid,
      profile.role,
      (data) => {
        setAppointments(data);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, profile]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-500 font-medium tracking-tight">Syncing your health records...</p>
      </div>
    );
  }

  const upcoming = appointments.filter(a => ['pending', 'confirmed'].includes(a.status));
  const past = appointments.filter(a => ['completed', 'cancelled'].includes(a.status));

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Health Dashboard</h1>
          <p className="text-gray-500 font-medium">Welcome back, {profile?.displayName}. Here's your schedule.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/doctors'}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          Book New Visit
        </button>
      </header>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Visits</h2>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{upcoming.length} Total</span>
            </div>

            {upcoming.length > 0 ? (
              <div className="space-y-4">
                {upcoming.map((a) => (
                  <motion.div 
                    key={a.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-6 group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-gray-100 group-hover:border-blue-100 transition-colors">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{a.date.split('-')[1]}</span>
                        <span className="text-xl font-black text-gray-900 uppercase leading-none">{a.date.split('-')[2]}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-gray-900 text-lg">{a.doctorName}</h3>
                          <StatusBadge status={a.status} />
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {a.time}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Video className="w-4 h-4" />
                            Online Consultation
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:pl-6 border-l border-gray-50">
                      <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] border border-dashed border-gray-200 p-12 text-center space-y-4">
                <div className="p-4 bg-gray-50 rounded-full inline-block text-gray-300">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No upcoming appointments</h3>
                <p className="text-gray-500 text-sm">You're all up to date with your specialists.</p>
                <button 
                  onClick={() => window.location.href = '/doctors'}
                  className="text-blue-600 font-bold text-sm hover:underline"
                >
                  Schedule a visit
                </button>
              </div>
            )}
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Medical History</h2>
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Provider</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {past.length > 0 ? past.map(a => (
                    <tr key={a.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <User className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-gray-900 text-sm">{a.doctorName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">{a.date}</td>
                      <td className="px-6 py-4"><StatusBadge status={a.status} /></td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-gray-900 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm">No past records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sidebar / Profile Card */}
        <div className="space-y-8">
          <section className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <img src={profile?.photoURL || 'https://i.pravatar.cc/150'} alt="" className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/10" />
                <div>
                  <h3 className="text-xl font-bold tracking-tight">{profile?.displayName}</h3>
                  <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{profile?.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Blood Type</p>
                  <p className="text-xl font-bold">O Positive</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Age</p>
                  <p className="text-xl font-bold">28 Years</p>
                </div>
              </div>
              <button className="w-full py-4 bg-blue-600 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20">
                Complete Profile
              </button>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16" />
          </section>

          <section className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Health Insights</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">Hydration</p>
                  <p className="text-xs text-gray-500">8 Glasses daily</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">85%</p>
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div className="w-[85%] h-full bg-blue-600 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">Sleep</p>
                  <p className="text-xs text-gray-500">7.5 Hours avg</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-purple-600">92%</p>
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div className="w-[92%] h-full bg-purple-600 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
