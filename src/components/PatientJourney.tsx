import React from 'react';
import { Calendar, UserCheck, HeartHandshake, ArrowRight } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const PatientJourney: React.FC = () => {
  const { openBookingWithPrefill } = useClinic();

  const steps = [
    {
      step: '01',
      title: 'Book',
      description: 'Choose a convenient appointment slot online or via a quick telephone call. No advance fees required.',
      icon: <Calendar className="w-5 h-5 text-teal-800" />,
    },
    {
      step: '02',
      title: 'Visit',
      description: 'Meet Dr. Akshata in a calm, welcoming clinic setting and comfortably discuss your dental concerns.',
      icon: <UserCheck className="w-5 h-5 text-teal-800" />,
    },
    {
      step: '03',
      title: 'Care',
      description: 'Receive a personalized, transparent treatment plan focused on your oral health, comfort, and lasting well-being.',
      icon: <HeartHandshake className="w-5 h-5 text-teal-800" />,
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-[#FAFAF8] border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-teal-800 uppercase mb-2">
            <span>Simple Process</span>
            <span className="text-slate-400">·</span>
            <span>Patient Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight [text-wrap:balance]">
            Your Dental Care Journey
          </h2>
          <p className="text-base text-slate-600 mt-2">
            Clear, step-by-step guidance from your initial appointment booking to ongoing oral health maintenance.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className="relative bg-white rounded-xl border border-slate-200/80 p-7 flex flex-col justify-between hover:shadow-sm transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-2xl font-bold text-teal-900 tracking-tight">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Booking Trigger */}
        <div className="mt-10 text-center">
          <p className="text-xs text-slate-500 mb-3">
            Ready to schedule your visit with Dr. Akshata?
          </p>
          <button
            onClick={() => openBookingWithPrefill()}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-md transition-colors"
          >
            <span>Start Step 01: Book Your Slot</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
