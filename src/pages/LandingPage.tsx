import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Shield, Clock, Search, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const FEATURES = [
  {
    icon: <Search className="w-6 h-6 text-blue-600" />,
    title: "Find Top Doctors",
    description: "Browse verified healthcare professionals by specialty, location, and rating."
  },
  {
    icon: <Calendar className="w-6 h-6 text-blue-600" />,
    title: "Instant Booking",
    description: "Book appointments in seconds with real-time availability updates."
  },
  {
    icon: <Clock className="w-6 h-6 text-blue-600" />,
    title: "Manage Appointments",
    description: "Reschedule or cancel easily from your dashboard. Get timely reminders."
  },
  {
    icon: <Shield className="w-6 h-6 text-blue-600" />,
    title: "Secure & Private",
    description: "Your health records and personal information are protected with bank-grade security."
  }
];

export default function LandingPage() {
  const { signIn, user } = useAuth();

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wider uppercase">
              <Star className="w-3 h-3 fill-current" />
              Trusted by 10k+ Patients
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              Better health <br />
              <span className="text-blue-600">starts here.</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
              Book appointments with the world's best doctors. Unified health management at your fingertips. Simple, fast, and secure.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = user ? '/doctors' : '#'}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl shadow-blue-200 flex items-center gap-2 group"
              >
                Find a Doctor
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              {!user && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={signIn}
                  className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Join MedFlow
                </motion.button>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-blue-600/5 rounded-3xl -rotate-2 transform scale-105" />
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800&h=600" 
              alt="Medical Professional" 
              className="relative rounded-3xl shadow-2xl z-10 w-full aspect-[4/3] object-cover border-8 border-white"
            />
            {/* Floating Card */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 border border-gray-100 flex items-center gap-4"
            >
              <div className="p-3 bg-green-50 rounded-xl">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Wait Time</p>
                <p className="text-lg font-bold text-gray-900">&lt; 15 Mins</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-16 py-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Everything you need for care</h2>
          <p className="text-gray-600 leading-relaxed">
            MedFlow removes the hurdles from healthcare, letting you focus on what matters most—your well-being.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="p-3 bg-blue-50 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-gray-900 rounded-[3rem] p-12 lg:p-20 text-white overflow-hidden relative">
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold tracking-tight">Ready to streamline your health journey?</h2>
            <p className="text-gray-400 text-lg">Join thousands of patients who have transformed their healthcare experience with MedFlow.</p>
          </div>
          <div className="flex justify-start lg:justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={signIn}
              className="bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold flex items-center gap-3 shadow-2xl"
            >
              Get Started Now
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -ml-48 -mb-48" />
      </section>
    </div>
  );
}
