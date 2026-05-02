import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Star, MapPin, Calendar, X, Clock, Check } from 'lucide-react';
import { doctorService, Doctor } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../contexts/AuthContext';

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
  key?: React.Key;
}

function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex gap-6">
        <img 
          src={doctor.photoURL} 
          alt={doctor.name} 
          className="w-24 h-24 rounded-2xl object-cover shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500"
        />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight">{doctor.name}</h3>
              <p className="text-blue-600 font-medium text-sm">{doctor.specialty}</p>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold">
              <Star className="w-3 h-3 fill-current" />
              {doctor.rating}
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <MapPin className="w-4 h-4" />
            {doctor.location}
          </div>
          <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
            {doctor.bio}
          </p>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
        <div className="flex -space-x-2">
          {[1,2,3].map(i => (
            <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 overflow-hidden">
              <img src={`https://i.pravatar.cc/100?u=${i + doctor.uid}`} alt="" />
            </div>
          ))}
          <div className="pl-4 text-xs font-medium text-gray-400">+{doctor.reviewCount} reviews</div>
        </div>
        <button 
          onClick={() => onBook(doctor)}
          className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-gray-100"
        >
          <Calendar className="w-4 h-4" />
          Book Now
        </button>
      </div>
    </motion.div>
  );
}

function BookingModal({ doctor, onClose, onComplete }: { doctor: Doctor, onClose: () => void, onComplete: () => void }) {
  const { user, profile } = useAuth();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);

  const timeSlots = ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:00 PM'];

  const handleBook = async () => {
    if (!user) return;
    setBooking(true);
    try {
      await appointmentService.bookAppointment({
        patientId: user.uid,
        doctorId: doctor.uid,
        patientName: profile?.displayName || 'Patient',
        doctorName: doctor.name,
        date,
        time,
        status: 'pending',
        type: 'in-person',
        notes
      });
      setStep(3);
    } catch (error) {
      console.error(error);
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="p-10">
          {step === 1 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Select Date & Time</h2>
                <p className="text-gray-500">Pick a convenient slot for your visit with {doctor.name}.</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Available Dates</label>
                  <input 
                    type="date" 
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Available Slots</label>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setTime(slot)}
                        className={`p-3 rounded-xl text-sm font-semibold transition-all border ${
                          time === slot ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                disabled={!date || !time}
                onClick={() => setStep(2)}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
                <p className="text-gray-500">Anything specific you'd like the doctor to know?</p>
              </div>
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{date}</p>
                    <p className="text-xs text-blue-600 font-semibold">{time}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Reason for visit (Optional)</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Briefly describe your symptoms..."
                    rows={4}
                    className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-blue-600 transition-all font-medium resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-200 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
                <button
                  disabled={booking}
                  onClick={handleBook}
                  className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                >
                  {booking ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-12 text-center space-y-8">
              <div className="inline-flex p-6 bg-green-50 rounded-full text-green-600 mb-4 animate-bounce">
                <Check className="w-12 h-12" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-gray-900">Awesome!</h2>
                <p className="text-gray-500 px-8">Your appointment has been requested. We'll notify you once it's confirmed.</p>
              </div>
              <button
                onClick={onComplete}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-100"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function DoctorSearch() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    doctorService.getAllDoctors().then(data => {
      setDoctors(data);
      setLoading(false);
    });
  }, []);

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest"
          >
            <div className="w-6 h-[2px] bg-blue-600" />
            Available Now
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Our Specialists</h1>
          <p className="text-gray-500 max-w-md">Browse through our network of verified medical professionals and book your visit instantly.</p>
        </div>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search name, specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all placeholder:text-gray-400 font-medium"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-[2rem]" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredDoctors.map((doctor, idx) => (
              <DoctorCard key={doctor.uid} doctor={doctor} onBook={setSelectedDoctor} />
            ))}
          </div>
          {filteredDoctors.length === 0 && (
            <div className="text-center py-24 space-y-6">
              <div className="p-6 bg-gray-50 rounded-full inline-block text-gray-400">
                <Search className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No doctors found</h3>
              <p className="text-gray-500">Try adjusting your search criteria.</p>
              <button 
                onClick={() => setSearch('')}
                className="text-blue-600 font-bold hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {selectedDoctor && (
          <BookingModal 
            doctor={selectedDoctor} 
            onClose={() => setSelectedDoctor(null)} 
            onComplete={() => {
              setSelectedDoctor(null);
              window.location.href = '/dashboard';
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
