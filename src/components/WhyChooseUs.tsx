import React from 'react';
import {
  UserCheck,
  Heart,
  Clock,
  Stethoscope,
  Smile,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const WhyChooseUs: React.FC = () => {
  const { openBookingWithPrefill } = useClinic();

  const reasons = [
    {
      icon: <UserCheck className="w-5 h-5 text-teal-700" />,
      title: 'Doctor-Led Care',
      description: 'Your consultations, diagnosis, and treatment procedures are directly handled by Dr. Akshata with personal accountability.',
    },
    {
      icon: <Heart className="w-5 h-5 text-teal-700" />,
      title: 'Personalized Attention',
      description: 'We allocate unhurried appointments so you have ample time to discuss oral symptoms, dental history, and personal preferences.',
    },
    {
      icon: <Smile className="w-5 h-5 text-teal-700" />,
      title: 'Patient-First Experience',
      description: 'A calm, supportive setting designed to reduce apprehension and ensure you feel heard, respected, and fully at ease.',
    },
    {
      icon: <Clock className="w-5 h-5 text-teal-700" />,
      title: 'Convenient Appointment Scheduling',
      description: 'Open 7 days a week with both morning (10 AM–2 PM) and evening (4 PM–9 PM) slots tailored for working professionals and families.',
    },
    {
      icon: <Stethoscope className="w-5 h-5 text-teal-700" />,
      title: 'Comfortable Clinic Experience',
      description: 'A spotless, welcoming 2nd-floor practice maintaining strict hygiene routines and clear, transparent explanations.',
    },
    {
      icon: <MapPin className="w-5 h-5 text-teal-700" />,
      title: 'Trusted Local Dental Care',
      description: 'Proudly serving the community in Piranwadi, Belagavi with consistent 5.0-rated patient satisfaction on Google.',
    },
  ];

  return (
    <section id="why-us" className="py-16 md:py-24 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-800 uppercase mb-2">
            <span>Our Principles</span>
            <span className="text-slate-400">·</span>
            <span>Patient Commitment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight [text-wrap:balance]">
            Why Patients Choose A1 Dental Care
          </h2>
          <p className="text-base text-slate-600 mt-2">
            We focus on ethical, gentle, and transparent clinical care rather than commercialized dentistry.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reasons.map((item, index) => (
            <div
              key={item.title}
              className="p-6 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100/80 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-xs font-mono font-medium text-slate-400">0{index + 1}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Reassuring Action Strip */}
        <div className="mt-12 text-center">
          <button
            onClick={() => openBookingWithPrefill()}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-md shadow-2xs transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Your Visit Today</span>
          </button>
        </div>

      </div>
    </section>
  );
};
