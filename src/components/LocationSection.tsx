import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Calendar,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Building,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { getLiveClinicStatus, ClinicStatus } from '../utils/timeZone';

export const LocationSection: React.FC = () => {
  const { clinicInfo, openBookingWithPrefill } = useClinic();
  const [status, setStatus] = useState<ClinicStatus>(getLiveClinicStatus());

  // Update live status every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setStatus(getLiveClinicStatus());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  return (
    <section id="location" className="py-16 md:py-24 bg-[#FAFAF8] border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-800 uppercase mb-2">
            <span>Visit the Clinic</span>
            <span className="text-slate-400">·</span>
            <span>Timings & Directions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight [text-wrap:balance]">
            Clinic Hours & Location
          </h2>
          <p className="text-base text-slate-600 mt-2">
            Located conveniently on the 2nd Floor, Jamboti Road in Piranwadi, Belagavi. Open all 7 days with dedicated morning and evening sessions.
          </p>
        </div>

        {/* 2-Column Grid: Left Card (Hours & Live Status) | Right Card (Map & Contact Actions) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Opening Hours & Live IST Status */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Status Card */}
            <div className={`p-6 rounded-xl border ${
              status.isOpen
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-amber-50/70 border-amber-200'
            } transition-all`}>
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    status.isOpen ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
                  }`} />
                  <span className={`text-base font-bold ${
                    status.isOpen ? 'text-emerald-950' : 'text-amber-950'
                  }`}>
                    {status.statusText}
                  </span>
                </div>
                <span className="text-xs font-mono font-medium text-slate-500">
                  IST {status.currentIstTime}
                </span>
              </div>

              <p className={`text-xs ${status.isOpen ? 'text-emerald-800' : 'text-amber-800'}`}>
                {status.subText}
              </p>

              {status.nextSessionText && (
                <div className="mt-3 pt-3 border-t border-slate-200/50 flex items-center gap-1.5 text-xs text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{status.nextSessionText}</span>
                </div>
              )}
            </div>

            {/* Timings Schedule Table */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-700" />
                  Weekly Consultation Hours
                </span>
                <span className="text-xs font-normal text-teal-800">All 7 Days</span>
              </h3>

              <div className="space-y-2 text-xs">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0"
                  >
                    <span className="font-semibold text-slate-700">{day}</span>
                    <div className="text-right text-slate-600">
                      <div>10:00 AM – 02:00 PM</div>
                      <div>04:00 PM – 09:00 PM</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-xl text-[11px] text-slate-500 flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Afternoon Break:</strong> The clinic remains closed between 2:00 PM and 4:00 PM daily for sterilization and clinic preparation.
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Address, Interactive Map, Action CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Address Banner */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-teal-700" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    A1 DENTAL CARE 🦷
                  </h3>
                  <p className="text-xs font-semibold text-teal-800">
                    Dr. Akshata · Dental Surgeon
                  </p>
                  <p className="text-sm text-slate-600 pt-1 leading-relaxed">
                    2nd Floor, 331, Jamboti Road,<br />
                    Opposite Raghavendra Hotel, Piranwadi,<br />
                    Belagavi, Karnataka 590014, India
                  </p>
                  <p className="text-xs text-slate-500 pt-1">
                    Landmark: Directly opposite Raghavendra Hotel on main Jamboti Road.
                  </p>
                </div>
              </div>

              {/* Action Buttons as requested */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=A1+DENTAL+CARE+331+Jamboti+Road+Opposite+Raghavendra+Hotel+Piranwadi+Belagavi+Karnataka+590014"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-md transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>

                <a
                  href={`tel:${clinicInfo.phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  <Phone className="w-4 h-4 text-teal-700" />
                  <span>Call Clinic ({clinicInfo.phoneDisplay})</span>
                </a>

                <button
                  onClick={() => openBookingWithPrefill()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100/80 border border-teal-200 rounded-md transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>

            {/* Embedded Interactive Map */}
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100 relative">
              <div className="p-2.5 bg-white border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5 font-medium text-slate-800">
                  <Building className="w-3.5 h-3.5 text-teal-700" />
                  Piranwadi, Belagavi Map View
                </span>
                <span className="text-[11px] text-slate-400">Jamboti Road, Belagavi 590014</span>
              </div>
              <iframe
                title="A1 Dental Care Clinic Location - Piranwadi Belagavi"
                src="https://maps.google.com/maps?q=15.8365,74.4578&hl=en&z=15&output=embed"
                width="100%"
                height="280"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full block"
              />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
