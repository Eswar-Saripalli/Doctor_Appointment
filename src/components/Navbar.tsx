import React from 'react';
import { Stethoscope, LogIn, LogOut, User as UserIcon, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, profile, signIn, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
          <div className="p-2 bg-blue-600 rounded-xl">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-gray-900">MedFlow</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="/doctors" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Find a Doctor</a>
          {user && (
            <a href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">My Appointments</a>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 pr-4 border-r border-gray-100">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{profile?.displayName}</p>
                  <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
                </div>
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <UserIcon className="w-5 h-5" />
                  </div>
                )}
              </div>
              <button 
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={signIn}
              className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </motion.button>
          )}
        </div>
      </div>
    </nav>
  );
}
