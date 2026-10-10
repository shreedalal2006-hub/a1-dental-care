import React from 'react';
import { Calendar, Phone, Star, MapPin, UserCheck, Clock, ShieldCheck } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const Hero: React.FC = () => {
  const { clinicInfo, openBookingWithPrefill } = useClinic();

  return (
    <section className="relative overflow-hidden pt-8 pb-14 md:pt-14 md:pb-20 border-b border-slate-200/60 bg-gradient-to-b from-[#FAFAF8] via-[#F6F7F3] to-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline, Value Proposition, Action CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Subtle editorial kicker (not a pill badge) */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-800 uppercase">
              <span>Doctor-Led Dental Practice</span>
              <span className="text-slate-400">·</span>
              <span>Piranwadi, Belagavi</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-slate-900 leading-[1.12] tracking-tight [text-wrap:balance]">
              Confident Smiles Begin With the Right Care.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Personalized dental care with a gentle, patient-first approach.
              Visit A1 Dental Care in Piranwadi, Belagavi and take the next step
              towards a healthier smile.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => openBookingWithPrefill()}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-teal-800 hover:bg-teal-900 active:bg-teal-950 rounded-md shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 whitespace-nowrap cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-teal-200" />
                <span>Book an Appointment</span>
              </button>

              <a
                href={`tel:${clinicInfo.phone}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-base font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300/80 rounded-md transition-colors shadow-2xs whitespace-nowrap"
              >
                <Phone className="w-4 h-4 text-teal-700" />
                <span>Call {clinicInfo.phoneDisplay}</span>
              </a>
            </div>

            {/* Verified Clinical Attributes */}
            <div className="pt-3 border-t border-slate-200/70 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-medium">
                <UserCheck className="w-4 h-4 text-teal-700" />
                <span>Dr. Akshata, Dental Surgeon</span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-teal-700" />
                <span>Open 7 Days (10 AM–2 PM · 4 PM–9 PM)</span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-teal-700" />
                <span>Opp. Raghavendra Hotel</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Frame featuring Dr. Akshata & Operatory */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Portrait Card */}
              <div className="relative bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-md">
                <div className="aspect-[4/4.5] sm:aspect-[4/4.2] overflow-hidden bg-slate-100 relative">
                  <img
                    src="/src/assets/images/dr_akshata_portrait_1791205007587.jpg"
                    alt="Dr. Akshata, Dental Surgeon at A1 Dental Care Belagavi"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top hover:scale-[1.02] transition-transform duration-500"
                    loading="eager"
                  />
                  
                  {/* Subtle Gradient Scrim at bottom of image for readability */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent p-5 text-white">
                    <p className="text-lg font-bold">Dr. Akshata</p>
                    <p className="text-xs text-teal-200 font-medium">Dental Surgeon · A1 Dental Care</p>
                  </div>
                </div>

                {/* Sub-card details */}
                <div className="p-4 bg-white flex items-center justify-between border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500">Practice Location</p>
                    <p className="text-xs font-semibold text-slate-800">2nd Floor, 331 Jamboti Rd, Piranwadi</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Consultation</p>
                    <p className="text-xs font-semibold text-teal-800">By Prior Appointment</p>
                  </div>
                </div>
              </div>

              {/* Inset Operatory Card */}
              <div className="hidden sm:flex items-center gap-3 absolute -bottom-5 -left-6 bg-white/95 backdrop-blur-md p-3 rounded-lg border border-slate-200 shadow-lg max-w-[260px]">
                <img
                  src="/src/assets/images/clinic_treatment_operatory_1791205104565.jpg"
                  alt="A1 Dental Care Treatment Room"
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 object-cover rounded-md flex-shrink-0"
                />
                <div className="text-xs leading-tight">
                  <div className="flex items-center gap-1 font-semibold text-slate-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                    <span>Hygienic Operatory</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pristine clinical environment for every visit</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Small Trust Strip Below Hero (as specified in prompt) */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          
          <div className="py-2 px-3">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-1" aria-label="5.0 out of 5 stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm font-bold text-slate-900">5.0 Google Rating</p>
            <p className="text-xs text-slate-500">Based on 32 verified reviews</p>
          </div>

          <div className="py-2 px-3 border-l-0 sm:border-l border-slate-200/80">
            <p className="text-base font-bold text-slate-900 mb-0.5">Doctor-Led Care</p>
            <p className="text-xs text-slate-500">Direct consultation with Dr. Akshata</p>
          </div>

          <div className="py-2 px-3 border-l-0 md:border-l border-slate-200/80">
            <p className="text-base font-bold text-slate-900 mb-0.5">Piranwadi, Belagavi</p>
            <p className="text-xs text-slate-500">Opp. Raghavendra Hotel, Jamboti Rd</p>
          </div>

          <div className="py-2 px-3 border-l-0 sm:border-l border-slate-200/80">
            <p className="text-base font-bold text-teal-800 mb-0.5">Appointments Available</p>
            <p className="text-xs text-slate-500">Open 7 days · Morning & Evening</p>
          </div>

        </div>

      </div>
    </section>
  );
};
